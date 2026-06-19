/**
 * /api/admin/lessons-v2
 *
 * GET    — fetch a single lesson (with quiz_questions and exercise)
 * POST   — create a lesson inside a chapter
 * PATCH  — update lesson content, video, quiz, publish state
 *
 * No DELETE — lessons are preserved. Unpublish to hide from students.
 *
 * This route uses the correct production tables:
 *   courses → chapters → lessons
 * NOT the old skill_modules / skill_lessons tables.
 */
import { withInstructor, ok, E } from "@/lib/api"
import { cacheInvalidate, CacheKeys } from "@/lib/cache"

function toSlug(t: string) {
  return t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

// ── GET — single lesson ────────────────────────────────────────────────────
export const GET = withInstructor(async (req, { admin }) => {
  const lessonId = new URL(req.url).searchParams.get("id")
  if (!lessonId) return E.badRequest("Missing lesson id")

  const { data, error } = await admin
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single()

  if (error || !data) return E.notFound()
  return ok({ lesson: data })
})

// ── POST — create lesson ───────────────────────────────────────────────────
export const POST = withInstructor(async (req, { admin }) => {
  const body = await req.json().catch(() => ({}))
  const {
    chapter_id, course_id,
    title, content, video_url,
    xp_reward, is_free, is_published,
    starter_code, quiz_questions,
  } = body

  if (!chapter_id) return E.badRequest("chapter_id is required")
  if (!course_id)  return E.badRequest("course_id is required")
  if (!title?.trim()) return E.badRequest("Title is required")

  const slug = toSlug(title)

  // Check for duplicate slug in this chapter
  const { data: dup } = await admin
    .from("lessons").select("id").eq("chapter_id", chapter_id).eq("slug", slug).single()
  if (dup) return E.conflict(`A lesson with slug "${slug}" already exists in this chapter.`)

  // Get next order
  const { data: last } = await admin
    .from("lessons").select("order").eq("chapter_id", chapter_id)
    .order("order", { ascending: false }).limit(1)
  const nextOrder = ((last as any)?.[0]?.order ?? 0) + 1

  const { data: lesson, error } = await admin.from("lessons").insert({
    chapter_id,
    course_id,
    title:           title.trim(),
    slug,
    content:         content ?? "",
    video_url:       video_url?.trim() || null,
    xp_reward:       xp_reward ?? 10,
    is_free:         is_free ?? true,
    is_published:    is_published ?? false,
    starter_code:    starter_code?.trim() || null,
    quiz_questions:  quiz_questions?.length > 0 ? quiz_questions : null,
    order:           nextOrder,
    updated_at:      new Date().toISOString(),
  }).select().single()

  if (error) return E.serverError(error.message)
  return ok({ lesson }, 201)
})

// ── PATCH — update lesson ──────────────────────────────────────────────────
export const PATCH = withInstructor(async (req, { admin }) => {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body
  if (!id) return E.badRequest("Lesson ID required")

  // Normalize video_url
  if ("video_url" in updates) {
    updates.video_url = updates.video_url?.trim() || null
  }
  // Normalize starter_code
  if ("starter_code" in updates) {
    updates.starter_code = updates.starter_code?.trim() || null
  }
  // Normalize quiz
  if ("quiz_questions" in updates) {
    updates.quiz_questions = updates.quiz_questions?.length > 0 ? updates.quiz_questions : null
  }
  // Auto slug if title changes
  if (updates.title && !updates.slug) {
    updates.slug = toSlug(updates.title)
  }
  updates.updated_at = new Date().toISOString()

  const { data: lesson, error } = await admin
    .from("lessons").update(updates).eq("id", id).select().single()
  if (error) return E.serverError(error.message)
  return ok({ lesson })
})

// No DELETE export
