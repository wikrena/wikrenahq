/**
 * GET /api/auth/callback
 *
 * Handles email verification (token_hash) and OAuth (code).
 * Reads profile.role from DB — never creates or modifies profiles.
 * Routes each role to their correct dashboard.
 */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type       = searchParams.get("type")
  const redirectTo = searchParams.get("redirectTo") ?? ""
  const oauthRole  = searchParams.get("role") ?? "student"

  // createClient() from @/lib/supabase/server handles cookies correctly —
  // verifyOtp and exchangeCodeForSession set the session cookie on the response
  const supabase = createClient()

  // ── 1. Verify email OTP ───────────────────────────────────────────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
    if (error) {
      console.error("[callback] OTP verify error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=verification_failed`)
    }
  }

  // ── 1b. Handle password recovery — redirect straight to reset page ─────────
  if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: "recovery" })
    if (error) {
      console.error("[callback] Recovery OTP error:", error.message)
      return NextResponse.redirect(`${origin}/forgot-password?error=expired`)
    }
    // Session is now set — send to the reset password page
    const next = searchParams.get("next") ?? "/reset-password"
    return NextResponse.redirect(`${origin}${next}`)
  }

  // ── 2. Exchange OAuth code ────────────────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("[callback] OAuth error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=OAuthError`)
    }
  }

  // ── 3. Get user from the session just established ─────────────────────────
  // Must use the same supabase client (not admin) so we read the
  // session that was just set by verifyOtp / exchangeCodeForSession
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error("[callback] No user after auth:", userError?.message)
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  const admin = getAdminClient()

  // ── 4. Read profile from DB ───────────────────────────────────────────────
  const { data: profile } = await admin
    .from("profiles")
    .select("role, onboarding_done")
    .eq("id", user.id)
    .single()

  // ── 5. Handle Google OAuth — profile may not exist yet ───────────────────
  if (!profile && code) {
    const dbRole =
      oauthRole === "parent"     ? "PARENT"     :
      oauthRole === "school"     ? "SCHOOL"     :
      oauthRole === "teacher"    ? "TEACHER"    :
      oauthRole === "instructor" ? "INSTRUCTOR" :
      "STUDENT"

    try {
      await admin.from("profiles").insert({
        id:              user.id,
        email:           user.email ?? "",
        name:            user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
        role:            dbRole,
        onboarding_done: false,
        total_xp:        0,
        current_streak:  0,
        updated_at:      new Date().toISOString(),
      })
    } catch (err: any) {
      console.error("[callback] OAuth profile insert:", err?.message)
    }

    // If invited instructor has course assignments, create them now
    if (dbRole === "INSTRUCTOR") {
      const courseIds = user.user_metadata?.course_ids
      if (Array.isArray(courseIds) && courseIds.length > 0) {
        const invitedBy = user.user_metadata?.invited_by ?? null
        for (const courseId of courseIds) {
          try {
            await admin.from("course_assignments").upsert({
              course_id:     courseId,
              instructor_id: user.id,
              assigned_by:   invitedBy,
              assigned_at:   new Date().toISOString(),
            }, { onConflict: "course_id,instructor_id" })
          } catch { /* non-fatal */ }
        }
      }
    }

    try {
      const { sendEmail } = await import("@/lib/email")
      await sendEmail.welcome({ name: user.user_metadata?.name ?? "there", email: user.email! })
    } catch { /* non-fatal */ }
  }

  // Re-read after potential OAuth insert
  const { data: fresh } = await admin
    .from("profiles")
    .select("role, onboarding_done")
    .eq("id", user.id)
    .single()

  const role           = (fresh?.role ?? "STUDENT").toUpperCase()
  const onboardingDone = fresh?.onboarding_done ?? false

  // ── 6. Route by role — DB is the only source of truth ────────────────────
  let destination: string

  if (role === "ADMIN") {
    destination = "/admin/dashboard"

  } else if (role === "INSTRUCTOR") {
    destination = "/instructor/dashboard"

  } else if (role === "SCHOOL" || role === "TEACHER") {
    destination = "/school/dashboard"

  } else if (role === "PARENT") {
    destination = "/dashboard"

  } else {
    // STUDENT — honour redirectTo if safe
    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.includes("//")) {
      destination = redirectTo
    } else {
      destination = onboardingDone ? "/dashboard" : "/onboarding"
    }
  }

  // Send welcome email on first verification (email signups)
  if (token_hash && type === "signup") {
    try {
      const { sendEmail } = await import("@/lib/email")
      const { data: nameRow } = await admin
        .from("profiles").select("name").eq("id", user.id).single()
      await sendEmail.welcome({
        name:  nameRow?.name ?? user.user_metadata?.name ?? "there",
        email: user.email!,
      })
    } catch { /* non-fatal */ }
  }

  return NextResponse.redirect(`${origin}${destination}`)
}
