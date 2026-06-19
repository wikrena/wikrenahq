import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
  
    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
      .update(body)
      .digest("hex")
  
    const signature = req.headers.get("x-paystack-signature")
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  
    const event = JSON.parse(body)
  
    if (event.event === "charge.success") {
      const { user_id, plan_id, path_id } = event.data.metadata ?? {}
      if (!user_id) return NextResponse.json({ error: "Missing user_id in metadata" }, { status: 400 })
  
      const admin = getAdminClient()
  
      // Activate plan on profile
      await admin.from("profiles").update({
        plan_id,
        plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at:      new Date().toISOString(),
      }).eq("id", user_id)
  
      // Enroll in path if specified
      if (path_id) {
        await admin.from("course_enrollments").upsert({
          user_id,
          course_id: path_id,
          is_active:        true,
          progress_percent: 0,
          enrolled_at:      new Date().toISOString(),
        }, { onConflict: "user_id,course_id" })
      }
  
      // Award First Investment badge
      const { data: badge } = await admin
        .from("badges")
        .select("id")
        .eq("name", "First Investment")
        .single()
      if (badge) {
        await admin.from("user_badges").upsert(
          { user_id, badge_id: badge.id, earned_at: new Date().toISOString() },
          { onConflict: "user_id,badge_id" }
        )
      }
    }
  
    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Unexpected error" }, { status: 500 })
  }
}