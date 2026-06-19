/**
 * lib/data/gamification.ts
 * XP, streaks, badges, and leaderboard queries.
 *
 * IMPORTANT: XP and streak updates now go through the job queue.
 * Direct updates here are only used for admin operations and tests.
 */

import { getAdminClient }                          from "@/lib/supabase/admin"
import { cached, cacheInvalidate, CacheKeys, TTL } from "@/lib/cache"
import type { Badge, UserBadge, XpTransaction }    from "@/types"

const db = () => getAdminClient()

// ── BADGES ────────────────────────────────────────────────────────────────────

export async function getAllBadges(): Promise<Badge[]> {
  return cached(CacheKeys.allBadges(), TTL.STATIC, async () => {
    const { data, error } = await db().from("badges").select("*").order("rarity")
    if (error) return []
    return (data ?? []) as Badge[]
  })
}

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  return cached(CacheKeys.userBadges(userId), TTL.USER, async () => {
    const { data, error } = await db()
      .from("user_badges")
      .select("*, badges(*)")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
    if (error) return []
    return (data ?? []) as UserBadge[]
  })
}

export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  const { error } = await db()
    .from("user_badges")
    .upsert(
      { user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString() },
      { onConflict: "user_id,badge_id" }
    )
  if (error) { console.error("[awardBadge]", error.message); return false }

  // Invalidate user badges cache
  await cacheInvalidate(CacheKeys.userBadges(userId))
  return true
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const admin = db()
  const [{ data: profile }, badgeList, { data: userBadges }] = await Promise.all([
    admin.from("profiles").select("total_xp, current_streak, longest_streak").eq("id", userId).single(),
    getAllBadges(),
    admin.from("user_badges").select("badge_id").eq("user_id", userId),
  ])

  if (!profile || !badgeList.length) return []

  const earned     = new Set((userBadges ?? []).map(b => b.badge_id))
  const newlyEarned: string[] = []

  for (const badge of badgeList) {
    if (earned.has(badge.id)) continue
    const cond = badge.condition as any
    let qualifies = false

    if (cond.type === "xp"            && profile.total_xp      >= (cond.value ?? 0)) qualifies = true
    if (cond.type === "streak"        && profile.current_streak >= (cond.value ?? 0)) qualifies = true
    if (cond.type === "longest_streak" && profile.longest_streak >= (cond.value ?? 0)) qualifies = true

    if (qualifies) {
      await awardBadge(userId, badge.id)
      newlyEarned.push(badge.name)
    }
  }

  return newlyEarned
}

// ── XP (direct — for admin use) ───────────────────────────────────────────────

export async function getUserXp(userId: string): Promise<number> {
  const { data, error } = await db()
    .from("xp_transactions").select("amount").eq("user_id", userId)
  if (error) return 0
  return (data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0)
}

export async function addXp(params: {
  userId:       string
  amount:       number
  reason:       string
  referenceId?: string
}): Promise<void> {
  const admin = db()
  await Promise.all([
    admin.from("xp_transactions").insert({
      user_id:      params.userId,
      amount:       params.amount,
      reason:       params.reason,
      reference_id: params.referenceId ?? null,
    }),
    admin.from("profiles").select("total_xp").eq("id", params.userId).single()
      .then(({ data }) =>
        admin.from("profiles").update({
          total_xp:   (data?.total_xp ?? 0) + params.amount,
          updated_at: new Date().toISOString(),
        }).eq("id", params.userId)
      ),
  ])
  await cacheInvalidate(CacheKeys.userProfile(params.userId))
}

export async function updateStreak(userId: string): Promise<number> {
  const admin = db()
  const { data: profile } = await admin
    .from("profiles")
    .select("current_streak, longest_streak, last_activity_at")
    .eq("id", userId).single()

  if (!profile) return 0

  const now        = new Date()
  const lastActive = profile.last_activity_at ? new Date(profile.last_activity_at) : null
  const hoursSince = lastActive ? (now.getTime() - lastActive.getTime()) / 3_600_000 : 999
  const sameDay    = lastActive?.toDateString() === now.toDateString()
  const yesterday  = hoursSince >= 20 && hoursSince < 48

  let newStreak = profile.current_streak ?? 0
  if (!sameDay) {
    newStreak = yesterday ? newStreak + 1 : 1
  }

  const longest = Math.max(newStreak, profile.longest_streak ?? 0)

  await admin.from("profiles").update({
    current_streak:  newStreak,
    longest_streak:  longest,
    last_activity_at: now.toISOString(),
    updated_at:      now.toISOString(),
  }).eq("id", userId)

  await cacheInvalidate(CacheKeys.userProfile(userId))
  return newStreak
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────

export async function getLeaderboard(opts: {
  scope?:  string
  period?: string
  limit?:  number
} = {}): Promise<any[]> {
  const scope  = opts.scope  ?? "global"
  const period = opts.period ?? "all_time"
  const limit  = opts.limit  ?? 50

  return cached(
    CacheKeys.leaderboard(scope, period),
    TTL.SEMI_DYNAMIC,
    async () => {
      const { data, error } = await db()
        .from("profiles")
        .select("id, name, avatar, username, total_xp, current_streak")
        .eq("is_active", true)
        .neq("role", "ADMIN")
        .order("total_xp", { ascending: false })
        .limit(limit)

      if (error) { console.error("[getLeaderboard]", error.message); return [] }

      return (data ?? []).map((p, i) => ({
        rank:           i + 1,
        user_id:        p.id,
        name:           p.name,
        avatar:         p.avatar,
        username:       p.username,
        xp:             p.total_xp,
        current_streak: p.current_streak,
      }))
    }
  )
}
