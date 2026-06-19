import { withAuth, ok, E } from "@/lib/api"
import { enrollUserInCourse, getUserEnrollments, getCompletedLessonIds } from "@/lib/data/courses"
import { addXp, updateStreak, checkAndAwardBadges } from "@/lib/data/gamification"

export const GET = withAuth(async (req, { userId }) => {
  const enrollments = await getUserEnrollments(userId)
  return ok(enrollments)
})

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { course_id } = body
  if (!course_id) return E.badRequest("course_id required")

  // Verify course exists and is published
  const { data: course } = await admin
    .from("courses").select("id, is_published, is_free, title").eq("id", course_id).single()
  if (!course) return E.notFound("Course")

  const enrollment = await enrollUserInCourse(userId, course_id)
  if (!enrollment) return E.serverError("Failed to enroll")

  return ok(enrollment, 201)
})
