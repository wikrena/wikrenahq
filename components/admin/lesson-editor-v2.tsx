"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Save, Eye, EyeOff, Plus, Trash2,
  Loader2, Check, AlertCircle, Video, Code2,
  HelpCircle, FileText, ChevronDown, ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
interface CourseCtx {
  id:    string
  title: string
  slug:  string
}
interface ChapterCtx {
  id:    string
  title: string
}
interface LessonRow {
  id:             string
  title:          string
  slug:           string
  content:        string | null
  video_url:      string | null
  xp_reward:      number
  is_free:        boolean
  is_published:   boolean
  starter_code:   string | null
  quiz_questions: QuizQuestion[] | null
  order:          number
}
interface QuizQuestion {
  question:    string
  options:     [string, string, string, string]
  correct:     number
  explanation: string
}

interface Props {
  course:  CourseCtx
  chapter: ChapterCtx
  lesson:  LessonRow | null  // null = new lesson
}

const BLANK_Q: QuizQuestion = {
  question:    "",
  options:     ["", "", "", ""],
  correct:     0,
  explanation: "",
}

type Tab = "content" | "video" | "code" | "quiz"

// ── Component ──────────────────────────────────────────────────────────────
export function LessonEditorV2({ course, chapter, lesson }: Props) {
  const router = useRouter()
  const isNew  = !lesson

  // ── Form state ──────────────────────────────────────────────────────────
  const [tab,           setTab]           = useState<Tab>("content")
  const [title,         setTitle]         = useState(lesson?.title ?? "")
  const [content,       setContent]       = useState(lesson?.content ?? "")
  const [videoUrl,      setVideoUrl]      = useState(lesson?.video_url ?? "")
  const [xpReward,      setXpReward]      = useState(lesson?.xp_reward ?? 10)
  const [isFree,        setIsFree]        = useState(lesson?.is_free ?? true)
  const [isPublished,   setIsPublished]   = useState(lesson?.is_published ?? false)
  const [starterCode,   setStarterCode]   = useState(lesson?.starter_code ?? "# Write your code here\n")
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(lesson?.quiz_questions ?? [])

  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState("")
  const [lessonId, setLessonId] = useState(lesson?.id ?? "")

  // ── Quiz helpers ────────────────────────────────────────────────────────
  function addQuestion() {
    setQuizQuestions(prev => [...prev, { ...BLANK_Q, options: ["", "", "", ""] }])
  }
  function updateQ(i: number, field: keyof QuizQuestion, value: any) {
    setQuizQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q))
  }
  function updateOpt(qi: number, oi: number, value: string) {
    setQuizQuestions(prev => prev.map((q, idx) => {
      if (idx !== qi) return q
      const opts = [...q.options] as [string,string,string,string]
      opts[oi] = value
      return { ...q, options: opts }
    }))
  }
  function removeQ(i: number) {
    setQuizQuestions(prev => prev.filter((_, idx) => idx !== i))
  }
  function moveQ(i: number, dir: -1 | 1) {
    setQuizQuestions(prev => {
      const arr = [...prev]
      const j   = i + dir
      if (j < 0 || j >= arr.length) return prev
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  // ── Save ────────────────────────────────────────────────────────────────
  async function save(publishOverride?: boolean) {
    const t = title.trim()
    if (!t) { setError("Title is required"); setTab("content"); return }

    // Validate quiz if any questions added
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i]
      if (!q.question.trim()) { setError(`Question ${i + 1}: question text is required`); setTab("quiz"); return }
      if (q.options.some(o => !o.trim())) { setError(`Question ${i + 1}: all 4 options are required`); setTab("quiz"); return }
    }

    const pub = publishOverride !== undefined ? publishOverride : isPublished

    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const payload = {
        ...(lessonId ? { id: lessonId } : {}),
        ...(isNew ? {
          chapter_id: chapter.id,
          course_id:  course.id,
        } : {}),
        title:           t,
        content:         content.trim(),
        video_url:       videoUrl.trim() || null,
        xp_reward:       xpReward,
        is_free:         isFree,
        is_published:    pub,
        starter_code:    starterCode.trim() || null,
        quiz_questions:  quizQuestions.length > 0 ? quizQuestions : null,
      }

      const res  = await fetch("/api/admin/lessons-v2", {
        method:  lessonId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      let data: any = {}
      try { data = await res.json() } catch { /* ignore */ }

      if (!res.ok) {
        setError(data.error ?? "Save failed. Please try again.")
        setSaving(false)
        return
      }

      setIsPublished(pub)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      // If this was a new lesson, update the ID and redirect
      if (!lessonId && data.lesson?.id) {
        setLessonId(data.lesson.id)
        router.replace(
          `/admin/content/${course.id}/chapters/${chapter.id}/lessons/${data.lesson.id}`
        )
      }
    } catch (e: any) {
      setError(e.message ?? "Network error")
    } finally {
      setSaving(false)
    }
  }

  // ── Tab count badges ────────────────────────────────────────────────────
  const hasVideo  = videoUrl.trim().length > 0
  const hasCode   = starterCode.trim().length > 0 && starterCode.trim() !== "# Write your code here"
  const quizCount = quizQuestions.length

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-6">
        <Link href={`/admin/content/${course.id}`}
          className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-navy-800 hover:bg-neutral-100 transition-all shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-neutral-400 mb-2">
            <Link href="/admin/content" className="hover:text-teal-600 transition-colors">{course.title}</Link>
            <span>/</span>
            <span>{chapter.title}</span>
            <span>/</span>
            <span className="text-navy-800 font-medium">{isNew ? "New Lesson" : title || "Untitled"}</span>
          </div>

          {/* Title input */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Lesson title…"
            className="w-full text-xl font-bold text-navy-800 border-0 outline-none bg-transparent placeholder:text-neutral-300"
          />

          {!isNew && lesson && (
            <p className="text-xs text-neutral-400 font-mono mt-0.5">slug: {lesson.slug}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {saved && (
            <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {/* Save draft */}
          <button onClick={() => save(false)} disabled={saving}
            className="flex items-center gap-2 bg-white border border-[#E5E9F0] hover:border-teal-300 text-navy-800 px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>

          {/* Publish / Unpublish */}
          <button onClick={() => save(!isPublished)} disabled={saving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all",
              isPublished
                ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                : "bg-teal-500 hover:bg-teal-400 text-white"
            )}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 border-b border-[#E5E9F0]">
        {([
          { id: "content", icon: FileText, label: "Content",    badge: null      },
          { id: "video",   icon: Video,    label: "Video",      badge: hasVideo ? "✓" : null },
          { id: "code",    icon: Code2,    label: "Starter Code", badge: hasCode ? "✓" : null },
          { id: "quiz",    icon: HelpCircle, label: "Quiz",     badge: quizCount > 0 ? String(quizCount) : null },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all",
              tab === t.id
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-neutral-400 hover:text-navy-800"
            )}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.badge && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                t.badge === "✓" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"
              )}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content tab ────────────────────────────────────────────────── */}
      {tab === "content" && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
          <div>
            <div className="px-4 py-3 bg-neutral-50 border-b border-[#E5E9F0] flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">
                Lesson content — HTML supported. Use h2, p, pre/code, ul, blockquote tags.
              </span>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="<h2>Introduction</h2>\n\n<p>Start your lesson here...</p>"
              className="w-full h-[500px] px-5 py-4 text-sm font-mono text-navy-800 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* ── Video tab ──────────────────────────────────────────────────── */}
      {tab === "video" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              Video URL
            </label>
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEOID"
              className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 font-mono"
            />
            <p className="text-xs text-neutral-400 mt-2">
              Supported: YouTube (unlisted or public), Loom share URLs, direct .mp4 URLs.
              YouTube videos are embedded with no ads and no related videos shown.
            </p>
          </div>

          {videoUrl.trim() && (
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
              <p className="text-xs font-semibold text-neutral-500 mb-3 uppercase tracking-wide">Preview</p>
              <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden">
                {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(videoUrl)}?rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                    Preview not available for this URL type
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Starter code tab ───────────────────────────────────────────── */}
      {tab === "code" && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 border-b border-[#E5E9F0] flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Starter Code — shown in the Code tab when student opens this lesson
            </span>
            <span className="text-xs text-neutral-400">
              Python / SQL / JS depending on course language
            </span>
          </div>
          <textarea
            value={starterCode}
            onChange={e => setStarterCode(e.target.value)}
            className="w-full h-72 px-5 py-4 text-sm font-mono text-navy-800 outline-none resize-none"
            spellCheck={false}
          />
        </div>
      )}

      {/* ── Quiz tab ───────────────────────────────────────────────────── */}
      {tab === "quiz" && (
        <div className="space-y-4">
          {quizQuestions.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E9F0] rounded-2xl p-10 text-center">
              <HelpCircle className="w-8 h-8 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm mb-4">No quiz questions yet.</p>
              <button onClick={addQuestion}
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
                <Plus className="w-4 h-4" /> Add First Question
              </button>
            </div>
          ) : (
            <>
              {quizQuestions.map((q, qi) => (
                <div key={qi} className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-6 h-6 rounded-full bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qi + 1}
                    </span>
                    <div className="flex-1">
                      <textarea
                        value={q.question}
                        onChange={e => updateQ(qi, "question", e.target.value)}
                        placeholder="Question text…"
                        rows={2}
                        className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveQ(qi, -1)} disabled={qi === 0}
                        className="w-6 h-6 flex items-center justify-center rounded text-neutral-300 hover:text-neutral-600 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveQ(qi, 1)} disabled={qi === quizQuestions.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded text-neutral-300 hover:text-neutral-600 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeQ(qi)}
                        className="w-6 h-6 flex items-center justify-center rounded text-neutral-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 ml-9 mb-4">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button
                          onClick={() => updateQ(qi, "correct", oi)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                            q.correct === oi
                              ? "border-teal-500 bg-teal-500"
                              : "border-neutral-300 hover:border-teal-300"
                          )}>
                          {q.correct === oi && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <input
                          value={opt}
                          onChange={e => updateOpt(qi, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className={cn(
                            "flex-1 border rounded-xl px-3 py-2 text-sm outline-none transition-colors",
                            q.correct === oi
                              ? "border-teal-300 bg-teal-50 focus:border-teal-500"
                              : "border-[#E5E9F0] focus:border-teal-500"
                          )}
                        />
                        {q.correct === oi && (
                          <span className="text-[10px] text-teal-600 font-bold uppercase">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="ml-9">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Explanation (shown after answer)
                    </label>
                    <textarea
                      value={q.explanation}
                      onChange={e => updateQ(qi, "explanation", e.target.value)}
                      placeholder="Explain why the correct answer is right…"
                      rows={2}
                      className="w-full border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                    />
                  </div>
                </div>
              ))}

              <button onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E5E9F0] hover:border-teal-300 rounded-2xl py-4 text-sm font-semibold text-neutral-400 hover:text-teal-600 transition-all">
                <Plus className="w-4 h-4" /> Add Another Question
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Lesson settings bar ───────────────────────────────────────── */}
      <div className="mt-6 bg-white border border-[#E5E9F0] rounded-2xl p-5 flex flex-wrap gap-6 items-center">
        {/* XP reward */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide shrink-0">XP Reward</label>
          <input type="number" min={0} step={5} value={xpReward}
            onChange={e => setXpReward(Number(e.target.value))}
            className="w-20 border border-[#E5E9F0] rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-teal-500" />
        </div>

        {/* Free toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className={cn(
            "w-9 h-5 rounded-full transition-colors relative",
            isFree ? "bg-teal-500" : "bg-neutral-200"
          )}>
            <div className={cn(
              "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
              isFree ? "left-[18px]" : "left-0.5"
            )} />
          </div>
          <input type="checkbox" className="sr-only" checked={isFree} onChange={e => setIsFree(e.target.checked)} />
          <span className="text-sm font-medium text-neutral-700">Free lesson</span>
        </label>

        {/* Publish status indicator */}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isPublished ? "bg-teal-500 animate-pulse" : "bg-neutral-300"
          )} />
          <span className={isPublished ? "text-teal-600 font-semibold" : "text-neutral-400"}>
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* ── Save buttons at bottom ─────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-3">
        <button onClick={() => save(false)} disabled={saving}
          className="flex items-center gap-2 bg-white border border-[#E5E9F0] hover:border-teal-300 text-navy-800 px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Draft"}
        </button>

        <button onClick={() => save(true)} disabled={saving}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-all">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          {saving ? "Saving…" : "Save & Publish"}
        </button>

        {saved && (
          <span className="text-sm text-teal-600 font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Saved successfully
          </span>
        )}
      </div>
    </div>
  )
}

// ── Utility ────────────────────────────────────────────────────────────────
function extractYouTubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ""
}
