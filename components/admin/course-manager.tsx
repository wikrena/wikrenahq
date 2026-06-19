"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus, BookOpen, ChevronRight, Eye, EyeOff,
  Pencil, Loader2, Check, X,
  AlertCircle, Globe, Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
interface LessonSummary { id: string; is_published: boolean }
interface ChapterSummary { id: string; lessons: LessonSummary[] }
interface Course {
  id:           string
  title:        string
  slug:         string
  is_published: boolean
  difficulty:   string
  language:     string
  chapters:     ChapterSummary[]
}
interface Props { courses: Course[]; userRole: string }

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
const LANGUAGES    = ["python", "sql", "javascript", "html", "scratch", "general"]

// ── Component ──────────────────────────────────────────────────────────────
export function CourseManager({ courses: initial, userRole }: Props) {
  const router = useRouter()

  const [courses,    setCourses]    = useState(initial)
  const [showForm,   setShowForm]   = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState("")
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // New course form state
  const [title,      setTitle]      = useState("")
  const [difficulty, setDifficulty] = useState("BEGINNER")
  const [language,   setLanguage]   = useState("python")

  function resetForm() {
    setTitle(""); setDifficulty("BEGINNER"); setLanguage("python"); setError("")
  }

  async function createCourse() {
    const t = title.trim()
    if (!t) { setError("Course title is required"); return }

    setSaving(true)
    setError("")

    try {
      const res  = await fetch("/api/admin/courses", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title: t, difficulty, language }),
      })

      // Parse response — even if navigation is about to happen
      let data: any = {}
      try { data = await res.json() } catch { /* ignore parse errors on redirect */ }

      if (!res.ok) {
        setError(data.error ?? "Failed to create. Please try again.")
        setSaving(false)
        return
      }

      // Success — navigate without touching state (avoids flicker)
      const courseId = data.course?.id
      if (courseId) {
        // Don't setSaving(false) — we're navigating away, avoids race
        router.push(`/admin/content/${courseId}`)
      } else {
        setError("Course created but ID missing. Refresh and try again.")
        setSaving(false)
      }
    } catch (e: any) {
      setError(e.message ?? "Network error. Please try again.")
      setSaving(false)
    }
  }

  async function togglePublish(course: Course) {
    setTogglingId(course.id)
    try {
      const res = await fetch("/api/admin/courses", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: course.id, is_published: !course.is_published }),
      })
      if (res.ok) {
        setCourses(prev => prev.map(c =>
          c.id === course.id ? { ...c, is_published: !c.is_published } : c
        ))
      }
    } finally {
      setTogglingId(null)
    }
  }

  // ── Stats helpers ─────────────────────────────────────────────────────
  function lessonCount(c: Course) {
    return c.chapters.reduce((n, ch) => n + ch.lessons.length, 0)
  }
  function publishedLessons(c: Course) {
    return c.chapters.reduce((n, ch) => n + ch.lessons.filter(l => l.is_published).length, 0)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-navy-800">Content Manager</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""} ·{" "}
            {courses.reduce((n, c) => n + lessonCount(c), 0)} lessons total
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        )}
      </div>

      {/* ── New course form ──────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy-800">Create New Course</h2>
            <button onClick={() => { setShowForm(false); resetForm() }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              Course Title *
            </label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") createCourse() }}
              placeholder="e.g. SQL Fundamentals for Data Analysts"
              className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Difficulty + Language */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                Difficulty
              </label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                Language
              </label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white">
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={createCourse}
              disabled={saving || !title.trim()}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Creating…" : "Create & Open Editor"}
            </button>
            <button onClick={() => { setShowForm(false); resetForm() }}
              className="text-neutral-400 hover:text-neutral-600 text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Course list ──────────────────────────────────────────────────── */}
      {courses.length === 0 ? (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <h3 className="font-semibold text-neutral-600 mb-1">No courses yet</h3>
          <p className="text-neutral-400 text-sm mb-4">
            Create your first course to start adding content.
          </p>
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
            <Plus className="w-4 h-4" /> Create First Course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => {
            const total     = lessonCount(course)
            const published = publishedLessons(course)
            const chapters  = course.chapters.length

            return (
              <div key={course.id}
                className="bg-white border border-[#E5E9F0] rounded-2xl p-4 flex items-center gap-4 group hover:border-teal-200 transition-colors">

                {/* Course icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-blue-50 border border-blue-100">
                  📚
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-navy-800 text-sm">{course.title}</span>

                    {course.is_published ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        <Globe className="w-2.5 h-2.5" /> LIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" /> DRAFT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    slug: {course.slug} · {chapters} chapter{chapters !== 1 ? "s" : ""} · {published}/{total} lessons published
                  </div>
                </div>

                {/* Actions — NO DELETE BUTTON */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Publish toggle */}
                  <button
                    onClick={() => togglePublish(course)}
                    title={course.is_published ? "Unpublish" : "Publish"}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-navy-800 hover:bg-neutral-100 transition-all">
                    {togglingId === course.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : course.is_published
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                    }
                  </button>

                  {/* Edit */}
                  <Link href={`/admin/content/${course.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-navy-800 hover:bg-neutral-100 transition-all">
                    <Pencil className="w-4 h-4" />
                  </Link>

                  {/* Open editor */}
                  <Link href={`/admin/content/${course.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 px-2 py-1.5 rounded-lg hover:bg-teal-50 transition-all">
                    Edit <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Archive notice ───────────────────────────────────────────────── */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>No course deletion in this CMS.</strong> To archive a course, unpublish it using
          the eye icon — it will be hidden from students but preserved in the database.
          Contact the developer if a course needs to be permanently removed.
        </div>
      </div>
    </div>
  )
}
