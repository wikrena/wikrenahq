/**
 * POST /api/jobs/weekly
 *
 * Weekly jobs — runs every Sunday at 7am WAT (6am UTC).
 * Configured in vercel.json.
 *
 * Jobs:
 *   1. Recalculate leaderboard rankings
 *   2. Clean up old completed/failed jobs (keep last 7 days)
 */

import { NextRequest, NextResponse } from "next/server"
import { getAdminClient }            from "@/lib/supabase/admin"
import { enqueueJob }                from "@/lib/queue"
import { cacheInvalidatePattern }    from "@/lib/cache"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = getAdminClient()
  let queued = 0

  // 1. Queue leaderboard recalculation
  await enqueueJob("recalc_leaderboard", { scope: "global", period: "weekly" }, { priority: 2 })
  await enqueueJob("recalc_leaderboard", { scope: "global", period: "all_time" }, { priority: 2 })
  queued += 2

  // 2. Clean up old jobs (older than 7 days and completed/failed)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  await admin
    .from("jobs")
    .delete()
    .in("status", ["complete", "failed"])
    .lt("created_at", sevenDaysAgo)

  // 4. Invalidate all semi-dynamic caches for fresh weekly start
  await cacheInvalidatePattern("leaderboard:*")

  return NextResponse.json({ success: true, jobsQueued: queued })
}
