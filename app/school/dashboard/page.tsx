import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { SchoolDashboard } from "@/components/school/school-dashboard"

export const metadata: Metadata = { title: "School Dashboard — Wikrena" }

export default async function SchoolDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("*").eq("id", user.id).single()
  if (!["SCHOOL","TEACHER","ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  // Get or create school record
  let school = null
  if (profile?.school_id) {
    const { data } = await admin.from("schools").select("*").eq("id", profile.school_id).single()
    school = data
  }

  // Get cohorts
  const { data: cohorts } = school
    ? await admin.from("cohorts")
        .select("*, cohort_students(student_id), cohort_courses(course_id)")
        .eq("school_id", school.id)
        .order("created_at", { ascending: false })
    : { data: [] }

  // Get available courses for assignment
  const { data: courses } = await admin
    .from("courses")
    .select("id, title, slug, difficulty")
    .eq("is_published", true)
    .order("title")

  return (
    <SchoolDashboard
      profile={profile}
      school={school}
      cohorts={cohorts ?? []}
      courses={courses ?? []}
      userEmail={user.email ?? ""}
    />
  )
}
