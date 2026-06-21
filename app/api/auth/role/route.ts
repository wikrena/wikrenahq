/**
 * GET /api/auth/role
 * Returns the current user's role and routing info from the DB.
 * Called by /auth/confirm after establishing a session client-side.
 */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const admin = getAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("role, onboarding_done")
    .eq("id", user.id)
    .single()

  // If profile missing, create it from metadata as safety net
  if (!profile) {
    const metaRaw = (user.user_metadata?.role ?? "student").toLowerCase()
    const dbRole  =
      metaRaw === "instructor" ? "INSTRUCTOR" :
      metaRaw === "admin"      ? "ADMIN"      :
      "STUDENT"

    try {
      await admin.from("profiles").insert({
        id:              user.id,
        email:           user.email ?? "",
        name:            user.user_metadata?.name ?? null,
        role:            dbRole,
        onboarding_done: false,
        total_xp:        0,
        current_streak:  0,
        updated_at:      new Date().toISOString(),
      })
    } catch { /* profile may already exist — non-fatal */ }

    return NextResponse.json({ role: dbRole, onboardingDone: false })
  }

  const role = (profile.role ?? "STUDENT").toUpperCase()

  // Send welcome email on first confirm
  try {
    const { sendEmail } = await import("@/lib/email")
    const { data: nameRow } = await admin
      .from("profiles").select("name").eq("id", user.id).single()
    await sendEmail.welcome({
      name:  nameRow?.name ?? user.user_metadata?.name ?? "there",
      email: user.email!,
    })
  } catch { /* non-fatal */ }

  return NextResponse.json({
    role,
    onboardingDone: profile.onboarding_done ?? false,
  })
}
