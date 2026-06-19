import type { Metadata }        from "next"
import { redirect, notFound }   from "next/navigation"
import { createClient }         from "@/lib/supabase/server"
import { getAdminClient }       from "@/lib/supabase/admin"
import { AdminShell }           from "@/components/admin/admin-shell"
import { CourseEditor }         from "@/components/admin/course-editor"

export const metadata: Metadata = { title: "Edit Course — Wikrena Admin" }

interface Props { params: { courseId: string } }

export default async function CoursePage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles").select("role, name").eq("id", user.id).single()

  if (!["ADMIN", "TEACHER", "INSTRUCTOR"].includes(profile?.role ?? "")) {
    redirect("/dashboard")
  }

  const { data: course } = await admin
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single()

  if (!course) notFound()

  const { data: chapters } = await admin
    .from("chapters")
    .select("id, title, slug, order, lessons(id, title, slug, is_published, is_free, xp_reward, order, video_url)")
    .eq("course_id", params.courseId)
    .order("order")

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <CourseEditor
        course={course as any}
        chapters={(chapters ?? []) as any}
      />
    </AdminShell>
  )
}
