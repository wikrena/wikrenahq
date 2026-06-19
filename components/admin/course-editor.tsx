"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Save, Eye, EyeOff, Plus, Loader2, Check,
  ChevronRight, AlertCircle, Globe, Lock,
  Pencil, X
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
interface LessonRow {
  id:           string
  title:        string
  slug:         string
  is_published: boolean
  is_free:      boolean
  xp_reward:    number
  order:        number
  video_url:    string | null
}
interface ChapterRow {
  id:       string
  title:    string
  slug:     string
  order:    number
  lessons:  LessonRow[]
}
interface CourseRow {
  id:                string
  title:             string
  slug:              string
  description:       string
  short_description: string | null
  difficulty:        string
  language:          string
  is_published:      boolean
  is_free:           boolean
  tags:              string[]
  estimated_hours:   number
}

interface Props { course: CourseRow; chapters: ChapterRow[] }

// ── Component ──────────────────────────────────────────────────────────────
export function CourseEditor({ course: initial, chapters: initialChapters }: Props) {
  const router = useRouter()

  const [course,   setCourse]   = useState(initial)
  const [chapters, setChapters] = useState(initialChapters)
  const [editing,  setEditing]  = useState(false) // metadata edit mode
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState("")

  // Metadata edit fields
  const [eTitle,       setETitle]       = useState(course.title)
  const [eSlug,        setESlug]        = useState(course.slug)
  const [eDesc,        setEDesc]        = useState(course.description ?? "")
  const [eShortDesc,   setEShortDesc]   = useState(course.short_description ?? "")
  const [eDifficulty, setEDifficulty] = useState(course.difficulty)
  const [eLanguage,   setELanguage]   = useState(course.language)
  const [eIsFree,     setEIsFree]     = useState(course.is_free)
  const [eHours,       setEHours]       = useState(course.estimated_hours ?? 2)

  // Chapter management
  const [addingChapter,    setAddingChapter]    = useState(false)
  const [newChapterTitle,  setNewChapterTitle]  = useState("")
  const [savingChapter,    setSavingChapter]    = useState(false)
  const [chapterError,     setChapterError]     = useState("")
  const [togglingLessonId, setTogglingLessonId] = useState<string | null>(null)

  // ── Save course metadata ────────────────────────────────────────────────
  async function saveCourse() {
    if (!eTitle.trim()) { setError("Title is required"); return }
    if (!eSlug.trim())  { setError("Slug is required"); return }

    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const res = await fetch("/api/admin/courses", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          id:                course.id,
          title:             eTitle.trim(),
          slug:              eSlug.trim(),
          description:       eDesc,
          short_description: eShortDesc.trim() || null,
          difficulty:        eDifficulty,
          language:          eLanguage,
          is_free:           eIsFree,
          estimated_hours:   eHours,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Save failed"); return }

      setCourse({ ...course, ...data.course })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message ?? "Network error")
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle course publish ───────────────────────────────────────────────
  async function togglePublish() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/courses", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: course.id, is_published: !course.is_published }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed"); return }
      setCourse({ ...course, is_published: !course.is_published })
    } finally {
      setSaving(false)
    }
  }

  // ── Add chapter ─────────────────────────────────────────────────────────
  async function addChapter() {
    const t = newChapterTitle.trim()
    if (!t) { setChapterError("Chapter title is required"); return }

    setSavingChapter(true)
    setChapterError("")
    try {
      const res = await fetch("/api/admin/chapters", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ course_id: course.id, title: t }),
      })
      const data = await res.json()
      if (!res.ok) { setChapterError(data.error ?? "Failed to add chapter"); return }

      setChapters(prev => [...prev, { ...data.chapter, lessons: [] }])
      setNewChapterTitle("")
      setAddingChapter(false)
    } catch (e: any) {
      setChapterError(e.message ?? "Network error")
    } finally {
      setSavingChapter(false)
    }
  }

  // ── Toggle lesson publish ───────────────────────────────────────────────
  async function toggleLessonPublish(chapterId: string, lesson: LessonRow) {
    setTogglingLessonId(lesson.id)
    try {
      const res = await fetch("/api/admin/lessons-v2", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: lesson.id, is_published: !lesson.is_published }),
      })
      if (res.ok) {
        setChapters(prev => prev.map(ch => ch.id !== chapterId ? ch : {
          ...ch,
          lessons: ch.lessons.map(l => l.id !== lesson.id ? l : { ...l, is_published: !l.is_published }),
        }))
      }
    } finally {
      setTogglingLessonId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

      {/* ── Back + header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-6">
        <Link href="/admin/content"
          className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-navy-800 hover:bg-neutral-100 transition-all shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="font-display font-black text-2xl text-navy-800">{course.title}</h1>
            {course.is_published ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                <Globe className="w-2.5 h-2.5" /> LIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" /> DRAFT
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 font-mono">slug: {course.slug}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {saved && (
            <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <button onClick={togglePublish} disabled={saving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              course.is_published
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-teal-500 text-white hover:bg-teal-400"
            )}>
            {saving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : course.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />
            }
            {course.is_published ? "Unpublish" : "Publish Course"}
          </button>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Course metadata ────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy-800 text-sm">Course Settings</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <button onClick={() => { setEditing(false); setError("") }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!editing ? (
          /* Read-only view */
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Title</span>
              <p className="text-navy-800 font-medium mt-0.5">{course.title}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Slug</span>
              <p className="text-navy-800 font-mono text-xs mt-0.5">{course.slug}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Difficulty</span>
              <p className="text-navy-800 font-medium mt-0.5">{course.difficulty}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Language</span>
              <p className="text-navy-800 font-medium mt-0.5">{course.language}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Access</span>
              <p className="text-navy-800 font-medium mt-0.5">{course.is_free ? "Free" : "Paid"}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wide">Est. Hours</span>
              <p className="text-navy-800 font-medium mt-0.5">{course.estimated_hours}h</p>
            </div>
            {course.description && (
              <div className="col-span-2">
                <span className="text-xs text-neutral-400 uppercase tracking-wide">Description</span>
                <p className="text-navy-600 mt-0.5 text-xs leading-relaxed line-clamp-3">{course.description}</p>
              </div>
            )}
          </div>
        ) : (
          /* Edit form */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Title *</label>
                <input value={eTitle} onChange={e => setETitle(e.target.value)}
                  className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                  Slug *
                </label>
                <input value={eSlug} onChange={e => setESlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-teal-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea value={eDesc} onChange={e => setEDesc(e.target.value)} rows={3}
                className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Short Description</label>
              <input value={eShortDesc} onChange={e => setEShortDesc(e.target.value)}
                placeholder="One-line description shown in course cards"
                className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Difficulty</label>
                <select value={eDifficulty} onChange={e => setEDifficulty(e.target.value)}
                  className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 bg-white">
                  {["BEGINNER","INTERMEDIATE","ADVANCED"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Language</label>
                <select value={eLanguage} onChange={e => setELanguage(e.target.value)}
                  className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 bg-white">
                  {["python","sql","javascript","html","scratch","general"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Est. Hours</label>
                <input type="number" min={0.5} step={0.5} value={eHours}
                  onChange={e => setEHours(Number(e.target.value))}
                  className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>

            {/* Is Free */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className={cn(
                "w-10 h-5 rounded-full transition-colors relative",
                eIsFree ? "bg-teal-500" : "bg-neutral-200"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
                  eIsFree ? "left-5" : "left-0.5"
                )} />
              </div>
              <input type="checkbox" className="sr-only" checked={eIsFree} onChange={e => setEIsFree(e.target.checked)} />
              <span className="text-sm font-medium text-neutral-700">Free course (no payment required)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={saveCourse} disabled={saving}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button onClick={() => { setEditing(false); setError("") }}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-medium transition-colors px-2">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Chapters + Lessons ────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-navy-800">
          Chapters & Lessons
          <span className="text-neutral-400 font-normal text-sm ml-2">
            ({chapters.length} chapter{chapters.length !== 1 ? "s" : ""})
          </span>
        </h2>
        <button onClick={() => setAddingChapter(true)}
          className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-3 py-2 rounded-xl font-semibold text-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Chapter
        </button>
      </div>

      {/* Add chapter form */}
      {addingChapter && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-4 mb-4">
          <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Chapter Title</label>
          <div className="flex gap-3">
            <input autoFocus value={newChapterTitle}
              onChange={e => setNewChapterTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addChapter(); if (e.key === "Escape") { setAddingChapter(false); setNewChapterTitle("") } }}
              placeholder="e.g. Python Basics"
              className="flex-1 border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            <button onClick={addChapter} disabled={savingChapter || !newChapterTitle.trim()}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
              {savingChapter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Add
            </button>
            <button onClick={() => { setAddingChapter(false); setNewChapterTitle("") }}
              className="text-neutral-400 hover:text-neutral-600 px-2">
              <X className="w-4 h-4" />
            </button>
          </div>
          {chapterError && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {chapterError}
            </p>
          )}
        </div>
      )}

      {chapters.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E5E9F0] rounded-2xl p-10 text-center">
          <p className="text-neutral-400 text-sm mb-3">No chapters yet. Add a chapter to start adding lessons.</p>
          <button onClick={() => setAddingChapter(true)}
            className="inline-flex items-center gap-2 bg-navy-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
            <Plus className="w-3.5 h-3.5" /> Add First Chapter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, ci) => (
            <div key={chapter.id} className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
              {/* Chapter header */}
              <div className="px-5 py-3 bg-neutral-50 border-b border-[#E5E9F0] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-navy-800 text-sm">{chapter.title}</span>
                  <span className="text-neutral-400 text-xs ml-2">
                    {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? "s" : ""} ·{" "}
                    {chapter.lessons.filter(l => l.is_published).length} published
                  </span>
                </div>
                <Link
                  href={`/admin/content/${course.id}/chapters/${chapter.id}/lessons/new`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all">
                  <Plus className="w-3 h-3" /> Add Lesson
                </Link>
              </div>

              {/* Lessons */}
              {chapter.lessons.length === 0 ? (
                <div className="px-5 py-4 text-center">
                  <p className="text-neutral-400 text-xs">No lessons yet.</p>
                </div>
              ) : (
                <div>
                  {chapter.lessons.sort((a, b) => a.order - b.order).map((lesson, li) => (
                    <div key={lesson.id}
                      className="px-5 py-3 flex items-center gap-4 border-b border-[#F0F4F8] last:border-0 hover:bg-neutral-50 transition-colors group">

                      <span className="text-xs text-neutral-300 font-mono w-5 shrink-0">{li + 1}</span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-navy-800">{lesson.title}</span>
                          {lesson.is_published ? (
                            <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-bold">PUB</span>
                          ) : (
                            <span className="text-[10px] bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded font-bold">DRAFT</span>
                          )}
                          {lesson.is_free && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">FREE</span>
                          )}
                          {lesson.video_url && (
                            <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold">VIDEO</span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">
                          {lesson.xp_reward} XP · slug: {lesson.slug}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleLessonPublish(chapter.id, lesson)}
                          title={lesson.is_published ? "Unpublish" : "Publish"}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-navy-800 hover:bg-neutral-100 transition-all">
                          {togglingLessonId === lesson.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : lesson.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />
                          }
                        </button>
                        <Link
                          href={`/admin/content/${course.id}/chapters/${chapter.id}/lessons/${lesson.id}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Archive notice ───────────────────────────────────────────── */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Chapters and lessons cannot be deleted</strong> — unpublish them to hide from students.
        </span>
      </div>
    </div>
  )
}
