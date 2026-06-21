import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { InstructorDashboard } from "@/components/instructor/instructor-dashboard"

export const metadata: Metadata = { title: "Instructor Dashboard — Wikrena" }

export default async function InstructorDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single()
  if (!["INSTRUCTOR","ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  // Get assigned courses
  const { data: assignments } = await admin
    .from("course_assignments")
    .select("course_id")
    .eq("instructor_id", user.id)

  const courseIds = assignments?.map(a => a.course_id) ?? []

  // Also get courses where they are the instructor_id
  const { data: ownCourses } = await admin
    .from("courses")
    .select("*, chapters(id, lessons(id, is_published))")
    .eq("instructor_id", user.id)
    .order("updated_at", { ascending: false })

  // Merge and deduplicate
  const allCourseIds = [...new Set([...courseIds, ...(ownCourses?.map(c => c.id) ?? [])])]

  let extraCourses: any[] = []
  if (courseIds.length > 0) {
    const { data } = await admin
      .from("courses")
      .select("*, chapters(id, lessons(id, is_published))")
      .in("id", courseIds)
      .not("instructor_id", "eq", user.id)
    extraCourses = data ?? []
  }

  const courses = [...(ownCourses ?? []), ...extraCourses]
    .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i)

  // Get enrollment counts per course
  const enrollmentCounts = await Promise.all(
    courses.map(async c => {
      const { count } = await admin.from("course_enrollments").select("id", { count: "exact", head: true }).eq("course_id", c.id)
      return { courseId: c.id, count: count ?? 0 }
    })
  )
  const enrollMap = Object.fromEntries(enrollmentCounts.map(e => [e.courseId, e.count]))

  return (
    <InstructorDashboard
      profile={profile}
      courses={courses.map(c => ({ ...c, enrollments: enrollMap[c.id] ?? 0 }))}
      userEmail={user.email ?? ""}
    />
  )
}
