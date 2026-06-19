/**
 * /api/admin/chapters
 *
 * POST  — add a chapter to a course
 * PATCH — update chapter title/order
 *
 * No DELETE — chapters are preserved. Unpublish all lessons to effectively hide a chapter.
 */
import { withInstructor, ok, E } from "@/lib/api"

function toSlug(t: string) {
  return t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export const POST = withInstructor(async (req, { userId, role, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { course_id, title } = body

  if (!course_id) return E.badRequest("course_id is required")
  if (!title?.trim()) return E.badRequest("Chapter title is required")

  // Verify ownership for instructors
  if (role === "INSTRUCTOR") {
    const { data: course } = await admin
      .from("courses").select("instructor_id").eq("id", course_id).single()
    if (!course) return E.notFound()
    if ((course as any).instructor_id !== userId) return E.forbidden()
  }

  // Get next order
  const { data: last } = await admin
    .from("chapters")
    .select("order")
    .eq("course_id", course_id)
    .order("order", { ascending: false })
    .limit(1)
  const nextOrder = ((last as any)?.[0]?.order ?? 0) + 1

  const { data: chapter, error } = await admin.from("chapters").insert({
    course_id,
    title:     title.trim(),
    slug:      toSlug(title),
    order:     nextOrder,
    xp_reward: 0,
  }).select().single()

  if (error) return E.serverError(error.message)
  return ok({ chapter }, 201)
})

export const PATCH = withInstructor(async (req, { userId, role, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body
  if (!id) return E.badRequest("Chapter ID required")

  if (updates.title && !updates.slug) {
    updates.slug = toSlug(updates.title)
  }

  const { data: chapter, error } = await admin
    .from("chapters").update(updates).eq("id", id).select().single()
  if (error) return E.serverError(error.message)
  return ok({ chapter })
})

// No DELETE export
