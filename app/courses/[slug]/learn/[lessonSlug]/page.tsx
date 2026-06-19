import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { NewLessonPlayer } from "@/components/lesson/new-lesson-player"

interface Props {
  params: { slug: string; lessonSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = getAdminClient()
  const { data: lesson } = await admin
    .from("lessons")
    .select("title, courses(title)")
    .eq("slug", params.lessonSlug)
    .single()
  if (!lesson) return { title: "Lesson" }
  return { title: `${lesson.title} — ${(lesson.courses as any)?.title ?? "Wikrena Academy"}` }
}

export default async function CourseLessonPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirectTo=/courses/${params.slug}/learn/${params.lessonSlug}`)

  // Declare admin once at the top — used throughout this function
  const admin = getAdminClient()

  // Check if admin/instructor so we can show unpublished content for preview
  const { data: profileData } = await admin
    .from("profiles").select("role").eq("id", user.id).single()
  const isAdmin = ["ADMIN", "INSTRUCTOR", "TEACHER"].includes(profileData?.role ?? "")

  // Get the course
  const { data: course } = await admin
    .from("courses")
    .select("id, title, slug")
    .eq("slug", params.slug)
    .single()

  if (!course) notFound()

  // Get all chapters + lessons for this course (for sidebar)
  const { data: chapters } = await admin
    .from("chapters")
    .select("id, title, slug, order, lessons(id, title, slug, xp_reward, is_free, is_published, order, video_url)")
    .eq("course_id", course.id)
    .order("order")

  if (!chapters?.length) notFound()

  // Flatten all published lessons (admins see unpublished too for preview)
  const allLessons = (chapters ?? [])
    .flatMap((ch: any) =>
      (ch.lessons ?? [])
        .filter((l: any) => l.is_published || isAdmin)
        .map((l: any) => ({ ...l, chapter_id: ch.id, chapter_title: ch.title }))
    )
    .sort((a: any, b: any) => a.order - b.order)

  if (!allLessons.length) notFound()

  // Find the current lesson by slug
  const currentLesson = allLessons.find((l: any) => l.slug === params.lessonSlug)
    ?? allLessons[0]

  // Get full lesson data including exercise and quiz
  const { data: lessonFull } = await admin
    .from("lessons")
    .select("*, exercises(*), quiz_questions(*)")
    .eq("id", currentLesson.id)
    .single()

  if (!lessonFull) notFound()

  // Sort quiz questions by order
  if (lessonFull.quiz_questions) {
    lessonFull.quiz_questions.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
  }

  // Get user's completions for this course
  const { data: completions } = await admin
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)

  const completedIds = new Set((completions ?? []).map((c: any) => c.lesson_id))

  // Get note, bookmark and profile in parallel
  const [noteRes, bookmarkRes, profileRes] = await Promise.all([
    admin.from("notes").select("content").eq("user_id", user.id).eq("lesson_id", currentLesson.id).single(),
    admin.from("bookmarks").select("id").eq("user_id", user.id).eq("lesson_id", currentLesson.id).single(),
    admin.from("profiles").select("name, total_xp, current_streak").eq("id", user.id).single(),
  ])

  return (
    <NewLessonPlayer
      course={course}
      chapters={chapters}
      allLessons={allLessons}
      currentLesson={lessonFull}
      completedIds={completedIds}
      savedNote={noteRes.data?.content ?? ""}
      isBookmarked={!!bookmarkRes.data}
      userEmail={user.email ?? ""}
      userId={user.id}
      profile={profileRes.data}
    />
  )
}
