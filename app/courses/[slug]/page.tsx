import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { CourseOverview } from "@/components/academy/course-overview"

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = getAdminClient()
  const { data } = await admin.from("courses").select("title, short_description").eq("slug", params.slug).single()
  return { title: data ? `${data.title} — Wikrena Academy` : "Course" }
}

export default async function CoursePage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = getAdminClient()

  // Load course regardless of publish status so admins can preview
  const { data: course } = await admin
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!course) notFound()

  // Non-admin users can only see published courses
  if (!course.is_published) {
    if (!user) redirect(`/login?redirectTo=/courses/${params.slug}`)
    const { data: profile } = await admin
      .from("profiles").select("role").eq("id", user.id).single()
    if (!["ADMIN","INSTRUCTOR","TEACHER"].includes(profile?.role ?? "")) notFound()
  }

  const [chaptersRes, instructorRes, enrollmentRes] = await Promise.all([
    admin
      .from("chapters")
      .select("*, lessons(id, title, slug, xp_reward, is_free, video_url, order)")
      .eq("course_id", course.id)
      .order("order"),
    course.instructor_id
      ? admin.from("profiles").select("name, avatar, bio").eq("id", course.instructor_id).single()
      : Promise.resolve({ data: null }),
    user
      ? admin.from("course_enrollments").select("progress_percent, completed_at").eq("user_id", user.id).eq("course_id", course.id).single()
      : Promise.resolve({ data: null }),
  ])

  const chapters    = chaptersRes.data ?? []
  const instructor  = instructorRes.data
  const enrollment  = enrollmentRes.data

  return (
    <CourseOverview
      course={course}
      chapters={chapters}
      instructor={instructor}
      enrollment={enrollment}
      userId={user?.id ?? null}
    />
  )
}
