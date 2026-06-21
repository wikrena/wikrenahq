/**
 * POST /api/auth/register
 *
 * Server-side registration:
 * 1. Validate input
 * 2. Create Supabase auth user via admin API (service role key)
 * 3. Create profile in DB with correct role immediately
 * 4. Send verification email via Supabase built-in (triggers email template)
 *
 * The DB profile exists with the correct role BEFORE the user clicks
 * the verification link. The callback only reads — never writes.
 */
import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

function toDbRole(raw: string): string {
  const r = raw.toLowerCase().trim()
  if (r === "instructor") return "INSTRUCTOR"
  if (r === "admin")      return "ADMIN"
  return "STUDENT"
}

function getRedirectPath(role: string): string {
  if (role === "INSTRUCTOR")                   return "/instructor/dashboard"
  if (role === "ADMIN")                        return "/admin/dashboard"
  return "/onboarding"
}

export async function POST(req: NextRequest) {
  // ── 1. Parse and validate ──────────────────────────────────────────────────
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const { name, email, password, role: roleRaw } = body as {
    name?: string; email?: string; password?: string; role?: string
  }

  if (!name?.trim())       return NextResponse.json({ error: "Name is required" },     { status: 400 })
  if (!email?.trim())      return NextResponse.json({ error: "Email is required" },    { status: 400 })
  if (!password)           return NextResponse.json({ error: "Password is required" }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  if (!roleRaw)            return NextResponse.json({ error: "Role is required" },     { status: 400 })

  const dbRole       = toDbRole(roleRaw)
  const redirectPath = getRedirectPath(dbRole)
  const appUrl       = process.env.NEXT_PUBLIC_SITE_URL
                    ?? process.env.NEXT_PUBLIC_APP_URL
                    ?? "https://academy.wikrena.com"
  const admin        = getAdminClient()

  // ── 2. Check for existing account ─────────────────────────────────────────
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle()

  if (existingProfile) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in." },
      { status: 409 }
    )
  }

  // ── 3. Create Supabase auth user via admin API ─────────────────────────────
  // email_confirm: false — we control verification via generateLink below
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email:         email.toLowerCase().trim(),
    password,
    email_confirm: false,
    user_metadata: { name: name.trim(), role: roleRaw.toLowerCase() },
  })

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered") ||
        authError.message.toLowerCase().includes("already exists")) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try signing in." },
        { status: 409 }
      )
    }
    console.error("[register] Auth user creation error:", authError.message)
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const userId = authData.user.id

  // ── 4. Create profile with correct role in DB ──────────────────────────────
  const { error: profileError } = await admin.from("profiles").insert({
    id:              userId,
    email:           email.toLowerCase().trim(),
    name:            name.trim(),
    role:            dbRole,
    onboarding_done: false,
    total_xp:        0,
    current_streak:  0,
    updated_at:      new Date().toISOString(),
  })

  if (profileError) {
    // Clean up auth user to avoid orphaned accounts
    try { await admin.auth.admin.deleteUser(userId) } catch { /* best effort */ }
    console.error("[register] Profile insert error:", profileError.message)
    return NextResponse.json(
      { error: "Could not create account. Please try again." },
      { status: 500 }
    )
  }

  // ── 5. Generate email verification link ────────────────────────────────────
  // Use type "magiclink" which does not require a password parameter,
  // but sends the same token_hash that /api/auth/callback handles.
  // The user's password is already set — clicking this just verifies the email.
  try {
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type:  "magiclink",
      email: email.toLowerCase().trim(),
      options: {
        redirectTo: `${appUrl}/api/auth/callback?redirectTo=${redirectPath}`,
      },
    })

    if (!linkError && linkData?.properties?.action_link) {
      // Send branded email via Resend if configured
      try {
        const { sendEmail } = await import("@/lib/email")
        await sendEmail.verification({
          name:      name.trim(),
          email:     email.toLowerCase().trim(),
          verifyUrl: linkData.properties.action_link,
        })
      } catch (emailErr: any) {
        // Non-fatal — Supabase also sends its own email as fallback
        console.warn("[register] Custom email failed (Supabase fallback active):", emailErr?.message)
      }
    }
  } catch (linkErr: any) {
    // Non-fatal — user can request resend from login page
    console.warn("[register] Link generation failed:", linkErr?.message)
  }

  return NextResponse.json({ success: true, immediate: false })
}
