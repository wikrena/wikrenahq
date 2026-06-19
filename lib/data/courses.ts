/**
 * lib/data/courses.ts
 * All course, chapter, lesson and enrollment queries.
 * Single source of truth — import from here, never write raw queries in pages.
 *
 * CACHING STRATEGY:
 * - Course content (getCourses, getCourseBySlug): cached 1 hour
 *   Courses change rarely — only when admin publishes/edits content
 *   Cache is invalidated immediately when admin saves changes
 *
 * - User-specific data (enrollments, completions): cached 2 minutes
 *   Changes when a student completes a lesson (handled by queue)
 *
 * - Never cached: payment-related data, auth data
 */

import { getAdminClient }                           from "@/lib/supabase/admin"
import { cached, cacheInvalidate, CacheKeys, TTL }  from "@/lib/cache"
import type {
  Course, Chapter, Lesson,
  CourseWithChapters, ChapterWithLessons,
  CourseEnrollment, LessonCompletion,
  LearningPath, PathEnrollment,
} from "@/types"

const db = () => getAdminClient()

// ── COURSES ───────────────────────────────────────────────────────────────────

export async function getCourses(opts: {
  published?: boolean
  free?:      boolean
} = {}): Promise<Course[]> {
  if (opts.published === true && !opts.free) {
    return cached(CacheKeys.allCourses(), TTL.STATIC, () => fetchCourses(opts))
  }
  return fetchCourses(opts)
}

async function fetchCourses(opts: {
  published?: boolean
  free?:      boolean
}): Promise<Course[]> {
  let q = db().from("courses").select("*").order("order")
  if (opts.published !== undefined) q = q.eq("is_published", opts.published)
  if (opts.free      !== undefined) q = q.eq("is_free",      opts.free)
  const { data, error } = await q
  if (error) { console.error("[getCourses]", error.message); return [] }
  return (data ?? []) as Course[]
}

export async function getCourseBySlug(slug: string): Promise<CourseWithChapters | null> {
  return cached(
    CacheKeys.courseBySlug(slug),
    TTL.STATIC,
    async () => {
      const { data, error } = await db()
        .from("courses")
        .select("*, chapters(*, lessons(*))")
        .eq("slug", slug)
        .eq("is_published", true)
        .order("order", { referencedTable: "chapters" })
        .order("order", { referencedTable: "chapters.lessons" })
        .single()
      if (error) { console.error("[getCourseBySlug]", error.message); return null }
      return data as unknown as CourseWithChapters
    }
  )
}

export async function getCourseById(id: string): Promise<CourseWithChapters | null> {
  return cached(
    CacheKeys.courseById(id),
    TTL.STATIC,
    async () => {
      const { data, error } = await db()
        .from("courses")
        .select("*, chapters(*, lessons(*))")
        .eq("id", id)
        .order("order", { referencedTable: "chapters" })
        .order("order", { referencedTable: "chapters.lessons" })
        .single()
      if (error) { console.error("[getCourseById]", error.message); return null }
      return data as unknown as CourseWithChapters
    }
  )
}

/** Call this whenever a course is saved/published in the CMS */
export async function invalidateCourseCache(courseId: string, slug?: string): Promise<void> {
  const keys = [
    CacheKeys.allCourses(),
    CacheKeys.courseById(courseId),
  ]
  if (slug) keys.push(CacheKeys.courseBySlug(slug))
  await cacheInvalidate(...keys)
}

// ── CHAPTERS ──────────────────────────────────────────────────────────────────

export async function getChapterById(id: string): Promise<ChapterWithLessons | null> {
  const { data, error } = await db()
    .from("chapters")
    .select("*, lessons(*)")
    .eq("id", id)
    .order("order", { referencedTable: "lessons" })
    .single()
  if (error) { console.error("[getChapterById]", error.message); return null }
  return data as unknown as ChapterWithLessons
}

// ── LESSONS ───────────────────────────────────────────────────────────────────

export async function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): Promise<(Lesson & { chapter: Chapter & { course: Course } }) | null> {
  const { data, error } = await db()
    .from("lessons")
    .select("*, chapters(*, courses(*))")
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .single()
  if (error) { console.error("[getLessonBySlug]", error.message); return null }
  return data as any
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await db()
    .from("lessons").select("*").eq("id", id).single()
  if (error) { console.error("[getLessonById]", error.message); return null }
  return data as Lesson
}

// ── ENROLLMENTS ───────────────────────────────────────────────────────────────

export async function getEnrollment(
  userId:   string,
  courseId: string
): Promise<CourseEnrollment | null> {
  const { data } = await db()
    .from("course_enrollments")
    .select("*")
    .eq("user_id",  userId)
    .eq("course_id", courseId)
    .eq("is_active", true)
    .single()
  return data as CourseEnrollment | null
}

export async function getUserEnrollments(
  userId: string
): Promise<(CourseEnrollment & { courses: Course })[]> {
  return cached(
    CacheKeys.userEnrollments(userId),
    TTL.USER,
    async () => {
      const { data, error } = await db()
        .from("course_enrollments")
        .select("*, courses(*)")
        .eq("user_id",  userId)
        .eq("is_active", true)
        .order("enrolled_at", { ascending: false })
      if (error) { console.error("[getUserEnrollments]", error.message); return [] }
      return (data ?? []) as any
    }
  )
}

export async function enrollUserInCourse(
  userId:   string,
  courseId: string
): Promise<CourseEnrollment | null> {
  const { data, error } = await db()
    .from("course_enrollments")
    .upsert({
      user_id:          userId,
      course_id:        courseId,
      enrolled_at:      new Date().toISOString(),
      progress_percent: 0,
      is_active:        true,
    }, { onConflict: "user_id,course_id" })
    .select().single()

  if (error) { console.error("[enrollUserInCourse]", error.message); return null }

  // Invalidate enrollments cache
  await cacheInvalidate(CacheKeys.userEnrollments(userId))

  return data as CourseEnrollment
}

// ── COMPLETIONS ───────────────────────────────────────────────────────────────

export async function getLessonCompletions(
  userId:   string,
  courseId?: string
): Promise<LessonCompletion[]> {
  const cacheKey = CacheKeys.userEnrollments(userId) // reuse user bucket
  // Note: completions are NOT cached because they change frequently
  // and must be accurate immediately after a lesson is completed.
  // The fast path is handled by the lesson player's local state.

  let q = db().from("lesson_completions").select("*").eq("user_id", userId)
  if (courseId) q = q.eq("course_id", courseId)
  const { data, error } = await q
  if (error) { console.error("[getLessonCompletions]", error.message); return [] }
  return (data ?? []) as LessonCompletion[]
}

export async function completeLesson(params: {
  userId:    string
  lessonId:  string
  courseId:  string
  chapterId: string
  xpEarned?: number
}): Promise<LessonCompletion | null> {
  const { data, error } = await db()
    .from("lesson_completions")
    .upsert({
      user_id:      params.userId,
      lesson_id:    params.lessonId,
      course_id:    params.courseId,
      chapter_id:   params.chapterId,
      xp_earned:    params.xpEarned ?? 10,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" })
    .select().single()

  if (error) { console.error("[completeLesson]", error.message); return null }
  return data as LessonCompletion
}

export async function getCompletedLessonIds(
  userId:   string,
  courseId?: string
): Promise<Set<string>> {
  const completions = await getLessonCompletions(userId, courseId)
  return new Set(completions.map(c => c.lesson_id))
}

export async function updateCourseProgress(userId: string, courseId: string): Promise<void> {
  const admin = db()
  const [{ count: totalLessons }, { count: completedLessons }] = await Promise.all([
    admin.from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("chapters.course_id", courseId),
    admin.from("lesson_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", courseId),
  ])
  if (!totalLessons) return
  const progress   = Math.round(((completedLessons ?? 0) / totalLessons) * 100)
  const isComplete = progress >= 100
  await admin.from("course_enrollments").update({
    progress_percent: progress,
    ...(isComplete ? { completed_at: new Date().toISOString() } : {}),
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId).eq("course_id", courseId)
}

// ── LEARNING PATHS ────────────────────────────────────────────────────────────

export async function getLearningPaths(publishedOnly = true): Promise<LearningPath[]> {
  return cached(
    CacheKeys.allPaths(),
    TTL.STATIC,
    async () => {
      let q = db().from("learning_paths").select("*").order("order")
      if (publishedOnly) q = q.eq("is_published", true)
      const { data, error } = await q
      if (error) { console.error("[getLearningPaths]", error.message); return [] }
      return (data ?? []) as LearningPath[]
    }
  )
}

export async function getUserPathEnrollments(userId: string): Promise<PathEnrollment[]> {
  // NOTE: path_enrollments is the adult learning PATH enrollment table
  // (different from the deprecated skill_completions/skill_modules)
  const { data, error } = await db()
    .from("path_enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
  if (error) { console.error("[getUserPathEnrollments]", error.message); return [] }
  return (data ?? []) as PathEnrollment[]
}
