/**
 * lib/cache.ts
 *
 * Production-grade caching layer using Upstash Redis.
 *
 * ARCHITECTURE:
 * This module is the single entry point for ALL caching on Wikrena.
 * No other file should import @upstash/redis directly.
 *
 * PATTERN:
 * Every cacheable data function follows this pattern:
 *   1. Check cache → return if hit
 *   2. Fetch from DB → store in cache → return
 *   3. On mutation → invalidate relevant cache keys
 *
 * CACHE KEY NAMESPACING:
 * Keys follow the pattern: entity:identifier:variant
 * Examples:
 *   courses:all:published
 *   course:slug:python-fundamentals
 *   user:profile:abc-123
 *   leaderboard:global:weekly
 *
 * TTL (Time To Live) strategy:
 *   - Static content (courses, badges):    1 hour   (3600s)
 *   - Semi-dynamic (leaderboard, paths):   5 minutes (300s)
 *   - User-specific (progress, XP):        2 minutes (120s)
 *   Never cache: payments, auth tokens, lesson completions
 *
 * GRACEFUL DEGRADATION:
 * If Redis is unavailable (network error, quota exceeded),
 * every function falls back to the database transparently.
 * The platform continues to work — just without the speed benefit.
 * This is critical: Redis should NEVER be a single point of failure.
 */

import { Redis } from "@upstash/redis"

// ── TTL Constants ─────────────────────────────────────────────────────────────
export const TTL = {
  STATIC:       3600,   // 1 hour   — course content, badge definitions
  SEMI_DYNAMIC:  300,   // 5 mins   — leaderboard, paths
  USER:          120,   // 2 mins   — user-specific progress
  SHORT:          60,   // 1 min    — fast-changing aggregates
} as const

// ── Redis client ──────────────────────────────────────────────────────────────
// Lazy singleton — created once, reused across requests in the same process.
// Falls back to null if env vars are not set (development without Redis).
let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (_redis) return _redis

  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Redis not configured — log once in development, silent in production
    if (process.env.NODE_ENV === "development") {
      console.info("[cache] Redis not configured — running without cache. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env to enable.")
    }
    return null
  }

  _redis = new Redis({ url, token })
  return _redis
}

// ── Core cache operations ─────────────────────────────────────────────────────

/**
 * Get a value from cache.
 * Returns null on cache miss OR on any Redis error (graceful degradation).
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null

  try {
    const value = await redis.get<T>(key)
    return value ?? null
  } catch (err: any) {
    // Log but never throw — cache miss is always safe
    console.warn(`[cache] GET failed for "${key}":`, err?.message)
    return null
  }
}

/**
 * Set a value in cache with TTL in seconds.
 * Fire-and-forget — never awaited in hot paths to avoid slowing responses.
 */
export async function cacheSet<T>(key: string, value: T, ttl: number): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (err: any) {
    console.warn(`[cache] SET failed for "${key}":`, err?.message)
  }
}

/**
 * Delete one or more cache keys.
 * Call this whenever the underlying data changes.
 */
export async function cacheInvalidate(...keys: string[]): Promise<void> {
  const redis = getRedis()
  if (!redis || !keys.length) return

  try {
    await redis.del(...keys)
  } catch (err: any) {
    console.warn(`[cache] DEL failed for keys [${keys.join(", ")}]:`, err?.message)
  }
}

/**
 * Delete all cache keys matching a pattern.
 * Use for bulk invalidation e.g. all course-related keys when a course changes.
 * Pattern uses Redis SCAN — safe for large keysets (does not block).
 */
export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    let cursor = 0
    const keys: string[] = []

    do {
      const [nextCursor, batch] = await redis.scan(cursor, { match: pattern, count: 100 })
      cursor = Number(nextCursor)
      keys.push(...batch)
    } while (cursor !== 0)

    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (err: any) {
    console.warn(`[cache] Pattern invalidation failed for "${pattern}":`, err?.message)
  }
}

/**
 * The primary cache helper — stale-while-revalidate pattern.
 *
 * Usage:
 *   const courses = await cached(
 *     "courses:all:published",
 *     TTL.STATIC,
 *     () => fetchCoursesFromDB()
 *   )
 *
 * This is the recommended way to use caching in data functions.
 * - If cached: returns immediately from Redis (5-20ms)
 * - If not cached: fetches from DB, stores in cache, returns result
 * - If Redis fails: fetches directly from DB (graceful degradation)
 */
export async function cached<T>(
  key:     string,
  ttl:     number,
  fetcher: () => Promise<T>
): Promise<T> {
  // 1. Try cache
  const cached = await cacheGet<T>(key)
  if (cached !== null) return cached

  // 2. Cache miss — fetch from source
  const fresh = await fetcher()

  // 3. Store in cache (non-blocking — don't await)
  cacheSet(key, fresh, ttl).catch(() => null)

  return fresh
}

/**
 * Cache key builders — centralised so key naming is consistent everywhere.
 * If you ever need to change a key format, change it here once.
 */
export const CacheKeys = {
  // Courses
  allCourses:           ()           => "courses:all:published",
  courseBySlug:         (slug: string) => `course:slug:${slug}`,
  courseById:           (id: string)   => `course:id:${id}`,

  // Paths
  allPaths:             ()             => "paths:all:published",
  pathBySlug:           (slug: string) => `path:slug:${slug}`,

  // Users
  userProfile:          (id: string)   => `user:profile:${id}`,
  userEnrollments:      (id: string)   => `user:enrollments:${id}`,
  userBadges:           (id: string)   => `user:badges:${id}`,

  // Gamification
  leaderboard:          (scope: string, period: string) => `leaderboard:${scope}:${period}`,
  allBadges:            ()             => "badges:all",

  // Forum
  forumCategories:      ()             => "forum:categories",
  forumPosts:           (catId: string, page: number) => `forum:posts:${catId}:${page}`,

  // Admin stats
  adminStats:           ()             => "admin:stats:overview",
} as const
