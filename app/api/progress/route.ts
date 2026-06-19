/**
 * POST /api/progress
 *
 * Records a lesson completion.
 *
 * ARCHITECTURE:
 * This route does TWO things only:
 *   1. Records the lesson_completion row immediately (so the student gets credit)
 *   2. Enqueues a background job for all side effects (XP, streak, badges, progress%)
 *
 * The student sees the success response in ~60ms.
 * XP, streak, and badges update 1-2 seconds later via the job queue.
 * This is the correct pattern for a production LMS.
 *
 * If the queue job fails for any reason, the completion is NOT lost.
 * The job retries up to 3 times with exponential backoff.
 */

import { withAuth, ok, E } from "@/lib/api"
import { completeLesson }  from "@/lib/data/courses"
import { enqueueJob }      from "@/lib/queue"

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { lesson_id, course_id, chapter_id } = body

  if (!lesson_id || !course_id || !chapter_id) {
    return E.badRequest("lesson_id, course_id, and chapter_id are required")
  }

  // Get lesson XP reward
  const { data: lesson } = await admin
    .from("lessons")
    .select("xp_reward, title")
    .eq("id", lesson_id)
    .single()

  const xpEarned = lesson?.xp_reward ?? 10

  // Step 1 — Record completion immediately (the student MUST get credit now)
  const completion = await completeLesson({
    userId,
    lessonId:  lesson_id,
    courseId:  course_id,
    chapterId: chapter_id,
    xpEarned,
  })

  if (!completion) return E.serverError("Failed to record lesson completion")

  // Step 2 — Enqueue background job for all side effects
  // This returns immediately — processing happens in the background
  await enqueueJob("lesson_complete", {
    userId,
    lessonId:  lesson_id,
    courseId:  course_id,
    chapterId: chapter_id,
    xpEarned,
  })

  // Return immediately — student sees success right away
  return ok({ completion, xpEarned })
})
