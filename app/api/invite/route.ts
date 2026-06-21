/**
 * POST /api/invite
 *
 * Invites a user by email with a specific role.
 * Optionally assigns an instructor to one or more courses.
 *
 * ACCOUNT CREATION:
 * The invited user does NOT need an existing account.
 * Supabase generates a secure magic link. When they click it:
 *   1. Their account is created with the correct role
 *   2. They are redirected to /api/auth/callback
 *   3. Callback reads the role from metadata and routes them correctly
 *
 * COURSE ASSIGNMENT:
 * Supports assigning an instructor to multiple courses simultaneously.
 */
import { withAdmin, ok, E }    from "@/lib/api"
import { sendInvitationEmail } from "@/lib/email"
import type { UserRole }       from "@/types"

const VALID_ROLES: UserRole[] = ["ADMIN", "INSTRUCTOR"]

export const POST = withAdmin(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { email, role, name, message, course_ids } = body

  if (!email?.trim())                       return E.badRequest("Email is required")
  if (!role || !VALID_ROLES.includes(role)) return E.badRequest(`Role must be one of: ${VALID_ROLES.join(", ")}`)

  const normalEmail  = email.toLowerCase().trim()
  const courseIds    = Array.isArray(course_ids) ? course_ids.filter(Boolean) : []

  // ── If user already exists — update their role and assignments ────────────
  const { data: existing } = await admin
    .from("profiles").select("id, role").eq("email", normalEmail).single()

  if (existing) {
    await admin.from("profiles").update({
      role,
      updated_at: new Date().toISOString(),
    }).eq("id", existing.id)

    // Assign to all specified courses
    if (courseIds.length > 0 && role === "INSTRUCTOR") {
      await Promise.all(courseIds.map(courseId =>
        admin.from("course_assignments").upsert({
          course_id:     courseId,
          instructor_id: existing.id,
          assigned_by:   userId,
          assigned_at:   new Date().toISOString(),
        }, { onConflict: "course_id,instructor_id" })
      ))
    }

    return ok({
      updated: true,
      message: `${normalEmail} already has an account. Role updated to ${role}${courseIds.length > 0 ? ` and assigned to ${courseIds.length} course${courseIds.length !== 1 ? "s" : ""}` : ""}.`,
    })
  }

  // ── New user — generate magic invite link ─────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const { data: linkData, error: linkError } = await (admin.auth.admin as any).generateLink({
    type:    "invite",
    email:   normalEmail,
    options: {
      redirectTo: `${siteUrl}/api/auth/callback?role=${role.toLowerCase()}&invited=true`,
      data: {
        name:        name?.trim() ?? null,
        role:        role.toLowerCase(),
        invited_by:  userId,
        course_ids:  courseIds,
      },
    },
  })

  if (linkError) {
    return E.serverError(`Failed to generate invite link: ${linkError.message}`)
  }

  const inviteUrl = (linkData as any)?.properties?.action_link

  // ── Get course titles for the email ───────────────────────────────────────
  let courseNames: string[] = []
  if (courseIds.length > 0) {
    const { data: courses } = await admin
      .from("courses")
      .select("title")
      .in("id", courseIds)
    courseNames = (courses ?? []).map(c => c.title)
  }

  // ── Send invitation email ─────────────────────────────────────────────────
  let emailSent = false
  try {
    await sendInvitationEmail({
      toEmail:     normalEmail,
      toName:      name?.trim() ?? normalEmail,
      role,
      inviteUrl,
      message:     message?.trim() ?? null,
      courseNames,
    })
    emailSent = true
  } catch (emailErr: any) {
    console.error("[invite] Email failed:", emailErr?.message)
    return ok({
      invited:   true,
      email:     normalEmail,
      role,
      inviteUrl,
      emailSent: false,
      warning:   "Invite link created but email failed to send. Share this link manually with the instructor.",
    })
  }

  return ok({
    invited:      true,
    email:        normalEmail,
    role,
    emailSent,
    coursesAssigned: courseNames.length,
  })
})

export const GET = withAdmin(async (_req, { admin }) => {
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, name, role, created_at")
    .in("role", VALID_ROLES)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})
