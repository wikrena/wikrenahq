import type { Metadata }      from "next"
import { redirect, notFound } from "next/navigation"
import { createClient }       from "@/lib/supabase/server"
import { getAdminClient }     from "@/lib/supabase/admin"
import { AdminShell }         from "@/components/admin/admin-shell"
import { LessonEditorV2 }     from "@/components/admin/lesson-editor-v2"

export const metadata: Metadata = { title: "New Lesson — Wikrena Admin" }

interface Props {
  params: { courseId: string; chapterId: string }
}

export default async function NewLessonPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles").select("role, name").eq("id", user.id).single()

  if (!["ADMIN", "INSTRUCTOR"].includes(profile?.role ?? "")) {
    redirect("/dashboard")
  }

  const [courseRes, chapterRes] = await Promise.all([
    admin.from("courses")
      .select("id, title, slug")
      .eq("id", params.courseId)
      .single(),
    admin.from("chapters")
      .select("id, title")
      .eq("id", params.chapterId)
      .single(),
  ])

  if (!courseRes.data || !chapterRes.data) notFound()

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <LessonEditorV2
        course={courseRes.data as any}
        chapter={chapterRes.data as any}
        lesson={null}
      />
    </AdminShell>
  )
}
