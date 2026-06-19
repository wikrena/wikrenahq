"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Play, Clock, Zap, Users, ChevronDown, ChevronUp,
  CheckCircle2, Lock, BookOpen, Code2, Loader2,
  Star, Award, ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson   { id: string; title: string; slug: string; xp_reward: number; is_free: boolean; video_url: string | null; order: number }
interface Chapter  { id: string; title: string; slug: string; xp_reward: number; lessons: Lesson[] }
interface Course   { id: string; title: string; slug: string; description: string; short_description: string | null; difficulty: string; estimated_hours: number; language: string; is_free: boolean; xp_reward: number }
interface Instructor { name: string | null; avatar: string | null; bio: string | null }
interface Enrollment { progress_percent: number; completed_at: string | null }

interface Props {
  course:      Course
  chapters:    Chapter[]
  instructor:  Instructor | null
  enrollment:  Enrollment | null
  userId:      string | null
}

const DIFF_COLOR: Record<string, string> = {
  BEGINNER:     "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED:     "bg-red-100 text-red-700",
}

export function CourseOverview({ course, chapters, instructor, enrollment, userId }: Props) {
  const router  = useRouter()
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set([chapters[0]?.id]))
  const [enrolling, setEnrolling] = useState(false)

  const totalLessons = chapters.reduce((s, ch) => s + ch.lessons.length, 0)
  const totalXp      = chapters.reduce((s, ch) => s + ch.xp_reward, 0)
  const firstLesson  = chapters[0]?.lessons[0]
  const isEnrolled   = !!enrollment

  // Find where student left off
  const continueUrl = firstLesson
    ? `/courses/${course.slug}/learn/${firstLesson.slug}`
    : null

  async function handleEnroll() {
    if (!userId) { router.push("/register"); return }
    setEnrolling(true)
    try {
      await fetch("/api/course-enrollments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ courseId: course.id }),
      })
      router.refresh()
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      {/* Hero */}
      <div className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: course info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  INTERACTIVE COURSE
                </span>
                <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border", DIFF_COLOR[course.difficulty] ?? DIFF_COLOR.BEGINNER)}>
                  {course.difficulty}
                </span>
                {course.is_free && (
                  <span className="text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-1 rounded-full">FREE</span>
                )}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-xl">
                {course.description}
              </p>
              <div className="flex items-center gap-5 text-sm text-white/60 flex-wrap">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.estimated_hours} hours</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {totalLessons} lessons</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> {totalXp} XP</span>
                <span className="flex items-center gap-1.5 capitalize"><Code2 className="w-4 h-4" /> {course.language}</span>
              </div>
            </div>

            {/* Right: enroll card */}
            <div className="bg-white rounded-2xl p-5 text-navy-800 shadow-float">
              {enrollment ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold">Your progress</span>
                      <span className="font-bold text-teal-600">{Math.round(enrollment.progress_percent)}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percent}%` }} />
                    </div>
                  </div>
                  {enrollment.completed_at ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mb-4">
                      <CheckCircle2 className="w-5 h-5" /> Course Complete!
                    </div>
                  ) : (
                    continueUrl && (
                      <Link href={continueUrl}
                        className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white py-3 rounded-xl font-bold text-sm transition-all mb-3">
                        <Play className="w-4 h-4" fill="white" /> Continue Learning
                      </Link>
                    )
                  )}
                </>
              ) : (
                <>
                  {continueUrl && (
                    <Link href={continueUrl}
                      className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white py-3 rounded-xl font-bold text-sm transition-all mb-3">
                      <Play className="w-4 h-4" fill="white" /> Start Course
                    </Link>
                  )}
                  <button onClick={handleEnroll} disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 border-2 border-navy-200 hover:border-navy-400 text-navy-700 py-3 rounded-xl font-semibold text-sm transition-all">
                    {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                    Add to My Library
                  </button>
                </>
              )}
              <div className="mt-4 pt-4 border-t border-[#F0F4F8] space-y-2 text-xs text-neutral-500">
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {course.estimated_hours} hours to complete</div>
                <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-500" /> Earn up to {totalXp} XP</div>
                <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-teal-500" /> Certificate on completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Course content */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-xl text-navy-800 mb-5">Course Contents</h2>
            <div className="space-y-3">
              {chapters.map((chapter, ci) => {
                const isOpen  = expanded.has(chapter.id)
                const chXp    = chapter.xp_reward

                return (
                  <div key={chapter.id} className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
                    {/* Chapter header */}
                    <button
                      onClick={() => setExpanded(prev => {
                        const n = new Set(prev)
                        n.has(chapter.id) ? n.delete(chapter.id) : n.add(chapter.id)
                        return n
                      })}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FAFBFC] transition-colors"
                    >
                      {/* Status icon */}
                      <div className="w-8 h-8 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-navy-600">{ci + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-navy-800 text-sm">{chapter.title}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? "s" : ""} · {chXp} XP
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                    </button>

                    {/* Lessons */}
                    {isOpen && (
                      <div className="border-t border-[#F0F4F8] divide-y divide-[#F8F9FA]">
                        {chapter.lessons.map((lesson, li) => {
                          const canAccess = course.is_free || lesson.is_free || isEnrolled
                          const lessonUrl = `/courses/${course.slug}/learn/${lesson.slug}`

                          return (
                            <div key={lesson.id} className="flex items-center gap-3.5 px-5 py-3 hover:bg-[#FAFBFC] transition-colors">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                {canAccess
                                  ? <Play className="w-3.5 h-3.5 text-teal-500" />
                                  : <Lock className="w-3.5 h-3.5 text-neutral-300" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                {canAccess ? (
                                  <Link href={lessonUrl} className="text-sm text-navy-700 hover:text-teal-600 font-medium transition-colors">
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="text-sm text-neutral-400">{lesson.title}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.is_free && !course.is_free && (
                                  <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">FREE</span>
                                )}
                                <span className="text-[11px] text-amber-500 font-code">{lesson.xp_reward} XP</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Instructor */}
            {instructor && (
              <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wide">Instructor</h3>
                <div className="flex items-center gap-3 mb-3">
                  {instructor.avatar ? (
                    <img src={instructor.avatar} alt={instructor.name ?? ""} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                      {instructor.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-navy-800 text-sm">{instructor.name}</div>
                    <div className="text-xs text-neutral-400">Wikrena Instructor</div>
                  </div>
                </div>
                {instructor.bio && (
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-4">{instructor.bio}</p>
                )}
              </div>
            )}

            {/* What you'll learn */}
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-neutral-500 mb-3 uppercase tracking-wide">What You&apos;ll Learn</h3>
              <div className="space-y-2">
                {chapters.map(ch => (
                  <div key={ch.id} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-600">{ch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
