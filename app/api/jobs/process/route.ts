/**
 * POST /api/jobs/process
 *
 * Background job processor — called by Vercel Cron every minute.
 *
 * SECURITY:
 * Protected by CRON_SECRET environment variable.
 * Vercel passes this automatically for cron jobs.
 * Direct HTTP calls without the secret are rejected.
 *
 * VERCEL CRON CONFIGURATION:
 * This is configured in vercel.json (see /vercel.json)
 * Runs every minute in production.
 * In development, call manually: POST /api/jobs/process
 * with header Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server"
import { processJobs } from "@/lib/queue"

export const maxDuration = 60 // Maximum 60 seconds — Vercel Pro limit

export async function POST(req: NextRequest) {
  // Verify this is a legitimate cron call
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const startTime = Date.now()

  try {
    const results = await processJobs({ limit: 50 })

    const duration = Date.now() - startTime

    return NextResponse.json({
      success:   true,
      processed: results.processed,
      failed:    results.failed,
      duration:  `${duration}ms`,
      ...(results.errors.length > 0 ? { errors: results.errors } : {}),
    })

  } catch (err: any) {
    console.error("[jobs/process] Fatal error:", err?.message)
    return NextResponse.json(
      { success: false, error: err?.message ?? "Job processor crashed" },
      { status: 500 }
    )
  }
}

// Also support GET for health checks
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json({ status: "ok", message: "Job processor ready" })
}
