import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  const body = await req.json().catch(() => ({}))
  const { industry, pathSlug } = body as { industry?: string; pathSlug?: string }

  const admin = getAdminClient()
  const now   = new Date().toISOString()

  // ── 3. Read existing profile ───────────────────────────────────────────────
  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("role, name, total_xp, current_streak")
    .eq("id", user.id)
    .single()

  if (readError && readError.code !== "PGRST116") {
    return NextResponse.json(
      { error: "Could not read profile. Please try again." },
      { status: 500 }
    )
  }

  // Capture role before if/else so TypeScript doesn't narrow existing to never
  const existingRole = existing?.role ?? "STUDENT"

  // Only STUDENT role may complete student onboarding
  if (existingRole !== "STUDENT") {
    return NextResponse.json(
      { error: "This onboarding flow is for students only." },
      { status: 403 }
    )
  }

  // ── 4. Save profile ────────────────────────────────────────────────────────
  let saveError: { message: string } | null = null

  if (existing) {
    // Row exists — update only what onboarding owns
    const updatePayload: Record<string, unknown> = {
      onboarding_done: true,
      updated_at:      now,
    }
    if (industry) updatePayload.industry = industry

    const { error } = await admin
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)

    saveError = error
  } else {
    // Row does not exist — insert with all required fields
    // Use existingRole (captured above) rather than existing?.role (would be 'never' here)
    const insertPayload: Record<string, unknown> = {
      id:              user.id,
      email:           user.email ?? "",
      name:            user.user_metadata?.name ?? null,
      role:            existingRole,
      onboarding_done: true,
      total_xp:        0,
      current_streak:  0,
      updated_at:      now,
    }
    if (industry) insertPayload.industry = industry

    const { error } = await admin
      .from("profiles")
      .insert(insertPayload)

    saveError = error
  }

  if (saveError) {
    return NextResponse.json(
      { error: `Could not save profile: ${saveError.message}` },
      { status: 500 }
    )
  }

  // ── 5. Enroll in chosen learning path ─────────────────────────────────────
  if (pathSlug) {
    const { data: path, error: pathError } = await admin
      .from("learning_paths")
      .select("id")
      .eq("slug", pathSlug)
      .maybeSingle()

    if (pathError) {
      console.error("[onboarding] Path lookup error:", pathError.message)
    }

    if (path?.id) {
      const { error: enrollError } = await admin
        .from("course_enrollments")
        .upsert(
          {
            user_id:          user.id,
            path_id:          path.id,
            is_active:        true,
            progress_percent: 0,
            enrolled_at:      now,
          },
          { onConflict: "user_id,path_id" }
        )

      if (enrollError) {
        console.error("[onboarding] Enrollment error:", enrollError.message)
      }
    }
  }

  return NextResponse.json({ success: true })
}
