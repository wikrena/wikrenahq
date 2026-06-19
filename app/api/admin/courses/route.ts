/**
 * /api/admin/courses
 *
 * GET    — list all courses (with chapter/lesson counts)
 * POST   — create a new course
 * PATCH  — update course metadata or is_published
 *
 * NOTE: DELETE is intentionally removed. To hide a course, set is_published=false.
 */
import { withInstructor, ok, E } from "@/lib/api"
import { cacheInvalidate, CacheKeys } from "@/lib/cache"

function toSlug(t: string) {
  return t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

// ── GET — list courses ─────────────────────────────────────────────────────
export const GET = withInstructor(async (_req, { userId, role, admin }) => {
  let query = admin
    .from("courses")
    .select("*, chapters(id, title, order, lessons(id, is_published))")
    .order("order")

  // Instructors only see their own courses
  if (role === "INSTRUCTOR") {
    const { data: assignments } = await admin
      .from("course_assignments")
      .select("course_id")
      .eq("instructor_id", userId)
    const assignedIds = assignments?.map((a: any) => a.course_id) ?? []
    if (assignedIds.length > 0) {
      query = query.or(`instructor_id.eq.${userId},id.in.(${assignedIds.join(",")})`)
    } else {
      query = query.eq("instructor_id", userId)
    }
  }

  const { data, error } = await query
  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})

// ── POST — create course ───────────────────────────────────────────────────
export const POST = withInstructor(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const {
    title, difficulty, language,
    description, short_description,
    thumbnail, tags, is_free,
    estimated_hours,
  } = body

  if (!title?.trim()) return E.badRequest("Title is required")

  const slug = toSlug(title)

  // Check for duplicate slug
  const { data: existing } = await admin
    .from("courses").select("id").eq("slug", slug).single()
  if (existing) return E.conflict(`A course with slug "${slug}" already exists. Choose a different title.`)

  // Determine next order
  const { data: last } = await admin
    .from("courses").select("order").order("order", { ascending: false }).limit(1)
  const nextOrder = ((last as any)?.[0]?.order ?? 0) + 1

  const { data: course, error } = await admin.from("courses").insert({
    title:             title.trim(),
    slug,
    description:       description ?? "",
    short_description: short_description ?? null,
    thumbnail:         thumbnail ?? null,
    instructor_id:     userId,
    difficulty:        difficulty ?? "BEGINNER",
    estimated_hours:   estimated_hours ?? 2,
    language:          language ?? "python",
    tags:              tags ?? [],
    is_free:           is_free ?? true,
    is_published:      false,
    order:             nextOrder,
    updated_at:        new Date().toISOString(),
  }).select().single()

  if (error) return E.serverError(error.message)

  try {
    await cacheInvalidate(CacheKeys.allCourses())
  } catch { /* Redis may not be configured — non-fatal */ }

  return ok({ course }, 201)
})

// ── PATCH — update course ──────────────────────────────────────────────────
export const PATCH = withInstructor(async (req, { userId, role, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body
  if (!id) return E.badRequest("Course ID required")

  // Instructors can only edit their own courses
  if (role === "INSTRUCTOR") {
    const { data: course } = await admin
      .from("courses").select("instructor_id").eq("id", id).single()
    if (!course) return E.notFound()
    if ((course as any).instructor_id !== userId) return E.forbidden()
  }

  // Auto-update slug if title changes but slug not explicitly provided
  if (updates.title && !updates.slug) {
    updates.slug = toSlug(updates.title)
  }
  updates.updated_at = new Date().toISOString()

  const { data: course, error } = await admin
    .from("courses").update(updates).eq("id", id).select().single()
  if (error) return E.serverError(error.message)

  try {
    await cacheInvalidate(CacheKeys.allCourses())
  } catch { /* non-fatal */ }

  return ok({ course })
})

// DELETE intentionally not exported — use PATCH to set is_published=false
