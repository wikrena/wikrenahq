/**
 * POST /api/admin/seed-content
 * Seed endpoint — to be implemented with Wikrena Academy course content.
 * Admin only.
 */
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "No seed data configured. Add course content via the admin CMS." },
    { status: 404 }
  )
}
