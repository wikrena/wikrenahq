import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { CourseCatalog } from "@/components/academy/course-catalog"

export const metadata: Metadata = { title: "Courses — Wikrena Academy" }

export default async function CoursesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = getAdminClient()

  const [coursesRes, enrollmentsRes] = await Promise.all([
    admin
      .from("courses")
      .select("id, title, slug, short_description, difficulty, estimated_hours, language, is_free, tags, chapters(id, lessons(id))")
      .eq("is_published", true)
      .order("order"),
    user
      ? admin.from("course_enrollments").select("course_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ])

  const enrolledIds = new Set((enrollmentsRes.data ?? []).map((e: any) => e.course_id))

  return (
    <CourseCatalog
      courses={coursesRes.data ?? []}
      enrolledIds={enrolledIds}
      userId={user?.id ?? null}
    />
  )
}
