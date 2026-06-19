import type { Metadata } from "next"
import { redirect }       from "next/navigation"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AdminShell }     from "@/components/admin/admin-shell"
import { CourseManager }  from "@/components/admin/course-manager"

export const metadata: Metadata = { title: "Content — Wikrena Admin" }

export default async function ContentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles").select("role, name").eq("id", user.id).single()

  const allowed = ["ADMIN", "TEACHER", "INSTRUCTOR"]
  if (!allowed.includes(profile?.role ?? "")) redirect("/dashboard")

  const isInstructor = profile?.role === "INSTRUCTOR"

  // Build query — courses table (not skill_modules)
  let query = admin
    .from("courses")
    .select("id, title, slug, is_published, difficulty, language, chapters(id, lessons(id, is_published))")
    .order("order")

  if (isInstructor) {
    const { data: assignments } = await admin
      .from("course_assignments")
      .select("course_id")
      .eq("instructor_id", user.id)

    const assignedIds = assignments?.map((a: any) => a.course_id) ?? []

    if (assignedIds.length > 0) {
      query = (query as any).or(`instructor_id.eq.${user.id},id.in.(${assignedIds.join(",")})`)
    } else {
      query = (query as any).eq("instructor_id", user.id)
    }
  }

  const { data: courses } = await query

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <CourseManager
        courses={courses ?? []}
        userRole={profile?.role ?? "INSTRUCTOR"}
      />
    </AdminShell>
  )
}
