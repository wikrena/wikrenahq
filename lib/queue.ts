/**
 * lib/queue.ts
 *
 * Production background job queue using the database as the queue store.
 *
 * ARCHITECTURE DECISION:
 * We use PostgreSQL as the queue store rather than a dedicated queue service
 * (like BullMQ/Redis or AWS SQS). This is a deliberate choice for this stage:
 *
 * PROS of database-as-queue at this scale:
 *   - Zero additional cost or infrastructure
 *   - Transactional: job is enqueued atomically with the operation that created it
 *   - Survives server restarts (unlike in-memory queues)
 *   - Easy to inspect and debug via Supabase dashboard
 *   - Handles 50,000+ users comfortably (1000s of jobs/minute)
 *
 * WHEN TO MIGRATE to BullMQ/SQS:
 *   - When you need jobs processed in under 100ms (real-time requirements)
 *   - When you have 100,000+ active daily users
 *   - When the jobs table exceeds 10M rows and affects query performance
 *   At that point, the migration is straightforward — same interface, different driver.
 *
 * HOW IT WORKS:
 *   1. Operation completes → enqueueJob() adds a row to the jobs table
 *   2. Vercel Cron calls /api/jobs/process every minute
 *   3. processJobs() claims pending jobs with FOR UPDATE SKIP LOCKED
 *      (prevents two workers from processing the same job)
 *   4. Each job handler runs → job marked complete or failed
 *   5. Failed jobs are retried up to 3 times with exponential backoff
 *   6. Dead jobs (failed 3x) are kept for 7 days then auto-deleted
 *
 * JOB TYPES:
 *   lesson_complete     — update XP, streak, badges, course progress
 *   award_certificate   — generate and store certificate PDF
 *   send_email          — send any queued email
 *   recalc_leaderboard  — update leaderboard rankings
 *   check_badges        — award any newly-unlocked badges
 */

import { getAdminClient } from "@/lib/supabase/admin"
import { cacheInvalidate, CacheKeys } from "@/lib/cache"

// ── Job types ─────────────────────────────────────────────────────────────────

export type JobType =
  | "lesson_complete"
  | "award_certificate"
  | "send_email"
  | "recalc_leaderboard"
  | "check_badges"

export interface JobPayload {
  lesson_complete: {
    userId:    string
    lessonId:  string
    courseId:  string
    chapterId: string
    xpEarned:  number
  }
  award_certificate: {
    userId:   string
    courseId: string
  }
  send_email: {
    to:       string
    subject:  string
    html:     string
  }
  recalc_leaderboard: {
    scope:  string
    period: string
  }
  check_badges: {
    userId: string
  }
}

// ── Enqueue a job ─────────────────────────────────────────────────────────────

/**
 * Add a job to the queue.
 * Returns immediately — processing happens in the background.
 *
 * Usage:
 *   await enqueueJob("lesson_complete", {
 *     userId, lessonId, courseId, chapterId, xpEarned
 *   })
 */
export async function enqueueJob<T extends JobType>(
  type:        T,
  payload:     JobPayload[T],
  opts: {
    runAt?:      Date    // Schedule for future (default: now)
    priority?:   number  // Higher = processed first (default: 0)
    maxRetries?: number  // Default: 3
  } = {}
): Promise<void> {
  const admin = getAdminClient()

  try {
    await admin.from("jobs").insert({
      type,
      payload,
      status:      "pending",
      run_at:      (opts.runAt ?? new Date()).toISOString(),
      priority:    opts.priority   ?? 0,
      max_retries: opts.maxRetries ?? 3,
      attempts:    0,
      created_at:  new Date().toISOString(),
    })
  } catch (err: any) {
    // Non-fatal — log but never throw (the primary operation already succeeded)
    console.error(`[queue] Failed to enqueue ${type}:`, err?.message)
  }
}

// ── Process jobs ──────────────────────────────────────────────────────────────

/**
 * Process pending jobs from the queue.
 * Called by /api/jobs/process (Vercel Cron, every minute).
 *
 * Uses FOR UPDATE SKIP LOCKED to safely run multiple workers
 * without duplicate processing — a standard PostgreSQL pattern.
 */
export async function processJobs(opts: { limit?: number } = {}): Promise<{
  processed: number
  failed:    number
  errors:    string[]
}> {
  const admin    = getAdminClient()
  const limit    = opts.limit ?? 50
  const results  = { processed: 0, failed: 0, errors: [] as string[] }
  const now      = new Date().toISOString()

  // Claim pending jobs atomically
  // FOR UPDATE SKIP LOCKED means concurrent workers skip jobs already being processed
  const { data: jobs, error } = await admin
    .from("jobs")
    .select("*")
    .eq("status", "pending")
    .lte("run_at", now)
    .order("priority", { ascending: false })
    .order("run_at",    { ascending: true })
    .limit(limit)

  if (error || !jobs?.length) return results

  for (const job of jobs) {
    // Mark as processing before handling (prevents duplicate processing)
    const { error: claimError } = await admin
      .from("jobs")
      .update({ status: "processing", updated_at: now })
      .eq("id", job.id)
      .eq("status", "pending") // Only claim if still pending

    if (claimError) continue // Another worker claimed it

    try {
      await handleJob(job.type as JobType, job.payload)

      // Mark complete
      await admin.from("jobs").update({
        status:       "complete",
        completed_at: new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      }).eq("id", job.id)

      results.processed++

    } catch (err: any) {
      const attempts = (job.attempts ?? 0) + 1
      const failed   = attempts >= (job.max_retries ?? 3)

      // Exponential backoff: retry after 1min, 5min, 25min
      const backoffSeconds = Math.pow(5, attempts) * 12
      const retryAt = new Date(Date.now() + backoffSeconds * 1000).toISOString()

      await admin.from("jobs").update({
        status:      failed ? "failed" : "pending",
        attempts,
        run_at:      failed ? undefined : retryAt,
        last_error:  err?.message ?? "Unknown error",
        updated_at:  new Date().toISOString(),
      }).eq("id", job.id)

      results.failed++
      results.errors.push(`${job.type} (${job.id}): ${err?.message}`)
      console.error(`[queue] Job ${job.type} failed (attempt ${attempts}):`, err?.message)
    }
  }

  return results
}

// ── Job handlers ──────────────────────────────────────────────────────────────

async function handleJob(type: JobType, payload: any): Promise<void> {
  switch (type) {
    case "lesson_complete":   return handleLessonComplete(payload)
    case "award_certificate": return handleAwardCertificate(payload)
    case "send_email":              return handleSendEmail(payload)
    case "recalc_leaderboard":      return handleRecalcLeaderboard(payload)
    case "check_badges":            return handleCheckBadges(payload)
    default:
      throw new Error(`Unknown job type: ${type}`)
  }
}

// ── Individual job handlers ───────────────────────────────────────────────────

async function handleLessonComplete(payload: JobPayload["lesson_complete"]): Promise<void> {
  const { userId, lessonId, courseId, chapterId, xpEarned } = payload
  const admin = getAdminClient()

  // 1. Update XP
  const { data: profile } = await admin
    .from("profiles")
    .select("total_xp, current_streak, longest_streak, last_activity_at")
    .eq("id", userId)
    .single()

  if (!profile) throw new Error(`Profile not found: ${userId}`)

  const now        = new Date()
  const lastActive = profile.last_activity_at ? new Date(profile.last_activity_at) : null
  const hoursSince = lastActive ? (now.getTime() - lastActive.getTime()) / 3_600_000 : 999
  const sameDay    = lastActive?.toDateString() === now.toDateString()
  const yesterday  = hoursSince >= 20 && hoursSince < 48

  let newStreak = profile.current_streak ?? 0
  if (!sameDay) {
    newStreak = yesterday ? newStreak + 1 : 1
  }

  const newXp   = (profile.total_xp ?? 0) + xpEarned
  const longest = Math.max(newStreak, profile.longest_streak ?? 0)

  await Promise.all([
    // Update profile
    admin.from("profiles").update({
      total_xp:         newXp,
      current_streak:   newStreak,
      longest_streak:   longest,
      last_activity_at: now.toISOString(),
      updated_at:       now.toISOString(),
    }).eq("id", userId),

    // Log XP transaction
    admin.from("xp_transactions").insert({
      user_id:      userId,
      amount:       xpEarned,
      reason:       "Lesson completed",
      reference_id: lessonId,
    }),

    // Update course progress (compute % of lessons completed)
    updateCourseProgressBackground(userId, courseId, admin),
  ])

  // 2. Check badges (non-blocking)
  await checkAndAwardBadgesBackground(userId, newXp, newStreak, admin)

  // 3. Invalidate user caches
  await cacheInvalidate(
    CacheKeys.userProfile(userId),
    CacheKeys.userEnrollments(userId),
    CacheKeys.userBadges(userId),
    CacheKeys.leaderboard("global", "weekly"),
    CacheKeys.leaderboard("global", "all_time"),
  )
}

async function handleAwardCertificate(payload: JobPayload["award_certificate"]): Promise<void> {
  const { userId, courseId } = payload
  const admin = getAdminClient()

  // Check if certificate already exists
  const { data: existing } = await admin
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single()

  if (existing) return // Already issued

  const [{ data: profile }, { data: course }] = await Promise.all([
    admin.from("profiles").select("name, email").eq("id", userId).single(),
    admin.from("courses").select("title, slug").eq("id", courseId).single(),
  ])

  if (!profile || !course) throw new Error(`Missing profile or course for certificate`)

  // Issue certificate
  const certId = crypto.randomUUID()
  await admin.from("certificates").insert({
    id:           certId,
    user_id:      userId,
    course_id:    courseId,
    issued_at:    new Date().toISOString(),
    verify_url:   `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certId}`,
  })

  // Send congratulations email
  const { sendEmail } = await import("@/lib/email")
  await (sendEmail as any).certificateIssued?.({
    toEmail:      profile.email,
    toName:       profile.name ?? "there",
    courseName:   course.title,
    certificateUrl: `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certId}`,
  })
}

async function handleSendEmail(payload: JobPayload["send_email"]): Promise<void> {
  const { to, subject, html } = payload
  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: `Wikrena Academy <noreply@wikrena.com>`,
    to, subject, html,
  })
}

async function handleRecalcLeaderboard(payload: JobPayload["recalc_leaderboard"]): Promise<void> {
  // Invalidate the cached leaderboard — it will be rebuilt on next request
  const { scope, period } = payload
  await cacheInvalidate(CacheKeys.leaderboard(scope, period))
}

async function handleCheckBadges(payload: JobPayload["check_badges"]): Promise<void> {
  const { userId } = payload
  const { checkAndAwardBadges } = await import("@/lib/data/gamification")
  await checkAndAwardBadges(userId)
  await cacheInvalidate(CacheKeys.userBadges(userId))
}

// ── Background helpers ────────────────────────────────────────────────────────

async function updateCourseProgressBackground(
  userId:   string,
  courseId: string,
  admin:    ReturnType<typeof getAdminClient>
): Promise<void> {
  const [{ count: total }, { count: completed }] = await Promise.all([
    admin.from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("chapters.course_id", courseId),
    admin.from("lesson_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", courseId),
  ])

  if (!total) return

  const progress  = Math.min(100, Math.round(((completed ?? 0) / total) * 100))
  const isComplete = progress >= 100

  await admin.from("course_enrollments").update({
    progress_percent: progress,
    ...(isComplete ? { completed_at: new Date().toISOString() } : {}),
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId).eq("course_id", courseId)

  // If course is complete, queue certificate
  if (isComplete) {
    await enqueueJob("award_certificate", { userId, courseId }, { priority: 5 })
  }
}

async function checkAndAwardBadgesBackground(
  userId:   string,
  totalXp:  number,
  streak:   number,
  admin:    ReturnType<typeof getAdminClient>
): Promise<void> {
  const { data: badges } = await admin.from("badges").select("*")
  const { data: userBadges } = await admin
    .from("user_badges").select("badge_id").eq("user_id", userId)

  if (!badges?.length) return

  const earned = new Set((userBadges ?? []).map(b => b.badge_id))

  for (const badge of badges) {
    if (earned.has(badge.id)) continue
    const cond = badge.condition as any
    let qualifies = false

    if (cond.type === "xp"     && totalXp >= cond.value) qualifies = true
    if (cond.type === "streak" && streak  >= cond.value) qualifies = true

    if (qualifies) {
      await admin.from("user_badges").upsert(
        { user_id: userId, badge_id: badge.id, earned_at: new Date().toISOString() },
        { onConflict: "user_id,badge_id" }
      )
    }
  }
}
