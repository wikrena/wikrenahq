"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Check, CheckCircle2,
  BookOpen, Code2, Bot, StickyNote, Loader2,
  Bookmark, BookmarkCheck, Flame, Zap, Menu, X,
  Play, Lock, RotateCcw, ArrowLeft, List
} from "lucide-react"
import { VideoPlayer } from "@/components/lesson/video-player"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string; title: string; slug: string; content: string | null
  video_url: string | null; xp_reward: number; order: number
  is_free: boolean; is_published: boolean
  chapter_id: string; chapter_title: string
  exercises?: { instructions: string | null; starter_code: string | null; solution_code: string | null; language: string }[]
  quiz_questions?: { id: string; question: string; options: string[]; correct: number; explanation: string | null; order: number }[]
}

interface Chapter {
  id: string; title: string; slug: string; order: number
  lessons: { id: string; title: string; slug: string; xp_reward: number; is_free: boolean; is_published: boolean; order: number }[]
}

interface Props {
  course:        { id: string; title: string; slug: string }
  chapters:      Chapter[]
  allLessons:    Lesson[]
  currentLesson: Lesson
  completedIds:  Set<string>
  savedNote:     string
  isBookmarked:  boolean
  userEmail:     string
  userId:        string
  profile:       any
}

const TABS = [
  { id: "learn",    label: "Learn",    icon: BookOpen },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "quiz",     label: "Quiz",     icon: CheckCircle2 },
  { id: "wren",     label: "Ask Wren", icon: Bot },
] as const

export function NewLessonPlayer({
  course, chapters, allLessons, currentLesson,
  completedIds: initialCompleted, savedNote, isBookmarked: initBookmarked,
  userEmail, userId, profile,
}: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [tab,          setTab]          = useState<"learn"|"practice"|"quiz"|"wren">("learn")
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [completed,    setCompleted]    = useState(initialCompleted.has(currentLesson.id))
  const [completing,   setCompleting]   = useState(false)
  const [bookmarked,   setBookmarked]   = useState(initBookmarked)
  const [note,         setNote]         = useState(savedNote)
  const [noteSaving,   setNoteSaving]   = useState(false)
  const [code,         setCode]         = useState(currentLesson.exercises?.[0]?.starter_code ?? "# Write your code here\n")
  const [output,       setOutput]       = useState("")
  const [running,      setRunning]      = useState(false)
  const [quizAnswers,  setQuizAnswers]  = useState<Record<number, number>>({})
  const [quizDone,     setQuizDone]     = useState(false)
  const [quizScore,    setQuizScore]    = useState(0)
  const [aiInput,      setAiInput]      = useState("")
  const [aiMessages,   setAiMessages]   = useState<{ role: "user" | "ai"; text: string }[]>([])
  const [aiLoading,    setAiLoading]    = useState(false)
  const aiEndRef = useRef<HTMLDivElement>(null)

  const completedIds  = new Set([...initialCompleted, ...(completed ? [currentLesson.id] : [])])
  const currentIndex  = allLessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson    = allLessons[currentIndex - 1] ?? null
  const nextLesson    = allLessons[currentIndex + 1] ?? null
  const exercise      = currentLesson.exercises?.[0] ?? null
  const quizQuestions = currentLesson.quiz_questions ?? []
  const progress      = allLessons.length > 0 ? Math.round(completedIds.size / allLessons.length * 100) : 0

  // Save note with debounce
  const saveNoteDebounced = useCallback(
    debounce(async (content: string) => {
      setNoteSaving(true)
      await fetch("/api/notes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: currentLesson.id, content }),
      }).catch(() => null)
      setNoteSaving(false)
    }, 1200),
    [currentLesson.id]
  )

  function handleNoteChange(val: string) {
    setNote(val)
    saveNoteDebounced(val)
  }

  async function markComplete() {
    if (completed || completing) return
    setCompleting(true)
    await fetch("/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId:  currentLesson.id,
        courseId:  course.id,
        chapterId: currentLesson.chapter_id,
        xpEarned:  currentLesson.xp_reward,
      }),
    }).catch(() => null)
    setCompleted(true)
    setCompleting(false)
  }

  async function toggleBookmark() {
    setBookmarked(b => !b)
    await fetch("/api/bookmarks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: currentLesson.id }),
    }).catch(() => null)
  }

  async function runCode() {
    setRunning(true); setOutput("")
    try {
      const res  = await fetch("/api/code/run", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: exercise?.language ?? "python" }),
      })
      const data = await res.json()
      setOutput(data.output ?? data.error ?? "No output")
    } catch { setOutput("Could not run code. Check your connection.") }
    finally { setRunning(false) }
  }

  function submitQuiz() {
    let score = 0
    quizQuestions.forEach((q, i) => { if (quizAnswers[i] === q.correct) score++ })
    setQuizScore(score)
    setQuizDone(true)
    if (score >= Math.ceil(quizQuestions.length * 0.7)) markComplete()
  }

  async function sendToWren() {
    if (!aiInput.trim() || aiLoading) return
    const msg = aiInput.trim()
    setAiInput("")
    setAiMessages(prev => [...prev, { role: "user", text: msg }])
    setAiLoading(true)
    try {
      const res  = await fetch("/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          context: `Course: ${course.title}. Lesson: ${currentLesson.title}.`,
          mode: "explain",
        }),
      })
      const data = await res.json()
      setAiMessages(prev => [...prev, { role: "ai", text: data.message ?? "I had trouble with that. Try rephrasing." }])
    } catch {
      setAiMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Try again." }])
    } finally { setAiLoading(false) }
  }

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [aiMessages])

  return (
    <div className="flex h-screen bg-[#0a192f] overflow-hidden">

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-navy-900 border-r border-white/10 flex flex-col transition-transform duration-200",
        "lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-white/10">
          <Link href={`/courses/${course.slug}`}
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to course
          </Link>
          <div className="font-bold text-white text-sm leading-tight truncate">{course.title}</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-white/40 text-[10px] font-mono shrink-0">{progress}%</span>
          </div>
        </div>

        {/* Chapters + lessons */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {chapters.map(ch => (
            <div key={ch.id}>
              <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {ch.title}
              </div>
              {(ch.lessons ?? [])
                .filter(l => l.is_published)
                .sort((a, b) => a.order - b.order)
                .map(l => {
                  const isDone    = completedIds.has(l.id)
                  const isCurrent = l.id === currentLesson.id
                  return (
                    <Link key={l.id}
                      href={`/courses/${course.slug}/learn/${l.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all",
                        isCurrent ? "bg-teal-500/20 text-teal-300" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      )}>
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border",
                        isDone    ? "bg-teal-500 border-teal-500" : "border-white/20"
                      )}>
                        {isDone && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="truncate leading-tight">{l.title}</span>
                    </Link>
                  )
                })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-12 border-b border-white/10 flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(s => !s)}
            className="lg:hidden text-white/50 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
              {currentLesson.chapter_title}
            </div>
            <div className="font-semibold text-white text-sm truncate leading-tight">
              {currentLesson.title}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleBookmark} className="text-white/30 hover:text-amber-400 transition-colors">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
            {profile && (
              <div className="hidden sm:flex items-center gap-1 text-teal-400 text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5" /> {profile.total_xp ?? 0}
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all",
                tab === t.id
                  ? "text-teal-400 border-b-2 border-teal-400"
                  : "text-white/30 hover:text-white/60"
              )}>
              <t.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 px-4">
            {prevLesson && (
              <Link href={`/courses/${course.slug}/learn/${prevLesson.slug}`}
                className="text-white/30 hover:text-white/70 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
            <span className="text-white/20 text-[10px] font-mono">
              {currentIndex + 1} / {allLessons.length}
            </span>
            {nextLesson && (
              <Link href={`/courses/${course.slug}/learn/${nextLesson.slug}`}
                className="text-white/30 hover:text-white/70 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-auto">

          {/* LEARN TAB */}
          {tab === "learn" && (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
              {currentLesson.video_url && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <VideoPlayer url={currentLesson.video_url} title={currentLesson.title} />
                </div>
              )}
              {currentLesson.content ? (
                <div
                  className="prose prose-invert prose-sm max-w-none text-white/80 prose-headings:text-white prose-headings:font-bold prose-strong:text-white prose-code:text-teal-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-a:text-teal-400"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              ) : (
                <p className="text-white/40 text-sm">No content added yet.</p>
              )}

              {/* Notes */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-4 h-4 text-white/40" />
                  <span className="text-white/50 text-sm font-semibold">My Notes</span>
                  {noteSaving && <span className="text-white/20 text-[10px] font-mono">Saving...</span>}
                </div>
                <textarea
                  value={note}
                  onChange={e => handleNoteChange(e.target.value)}
                  placeholder="Add notes for this lesson..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-teal-500/50 resize-none transition-colors"
                />
              </div>

              {/* Complete button */}
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                {!completed ? (
                  <button onClick={markComplete} disabled={completing}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                    {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Mark as Complete (+{currentLesson.xp_reward} XP)
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Completed
                  </div>
                )}
                {nextLesson && (
                  <Link href={`/courses/${course.slug}/learn/${nextLesson.slug}`}
                    className="flex items-center gap-2 border border-white/20 hover:border-teal-500/50 text-white/60 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all">
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* PRACTICE TAB */}
          {tab === "practice" && (
            <div className="flex flex-col h-full">
              {exercise?.instructions && (
                <div className="p-4 bg-teal-500/5 border-b border-white/5">
                  <div className="font-semibold text-white text-sm mb-1">Challenge</div>
                  <div className="text-white/60 text-sm leading-relaxed">{exercise.instructions}</div>
                </div>
              )}
              {exercise ? (
                <>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    className="flex-1 min-h-[220px] font-mono text-sm bg-[#0d1117] text-green-300 p-4 outline-none resize-none border-b border-white/5"
                    placeholder="# Write your code here"
                  />
                  <div className="p-3 flex items-center gap-2 bg-black/30">
                    <button onClick={runCode} disabled={running}
                      className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-all">
                      {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" fill="white" />}
                      Run Code
                    </button>
                    <button onClick={() => setCode(exercise.starter_code ?? "")}
                      className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>
                  {output && (
                    <div className="p-4 bg-[#0d1117] border-t border-white/5 max-h-48 overflow-auto">
                      <div className="text-[10px] text-white/30 font-mono mb-2 uppercase tracking-wide">Output</div>
                      <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">{output}</pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white/30 text-sm">
                  No exercise for this lesson.
                </div>
              )}
            </div>
          )}

          {/* QUIZ TAB */}
          {tab === "quiz" && (
            <div className="max-w-xl mx-auto px-4 py-8">
              {quizQuestions.length === 0 ? (
                <div className="text-center text-white/30 text-sm py-16">No quiz for this lesson.</div>
              ) : !quizDone ? (
                <>
                  <div className="text-center mb-8">
                    <div className="font-bold text-white text-lg mb-1">Quiz Time</div>
                    <div className="text-white/40 text-sm">{quizQuestions.length} questions — score 70%+ to complete the lesson</div>
                  </div>
                  <div className="space-y-6">
                    {quizQuestions.map((q, qi) => (
                      <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="font-semibold text-white text-sm mb-4 leading-relaxed">
                          {qi + 1}. {q.question}
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <button key={oi} onClick={() => setQuizAnswers(p => ({ ...p, [qi]: oi }))}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm transition-all",
                                quizAnswers[qi] === oi
                                  ? "border-teal-500 bg-teal-500/20 text-teal-200"
                                  : "border-white/10 text-white/60 hover:border-white/25"
                              )}>
                              <div className={cn(
                                "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                                quizAnswers[qi] === oi ? "border-teal-400 bg-teal-400" : "border-white/20"
                              )}>
                                {quizAnswers[qi] === oi && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className="mt-6 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white py-3.5 rounded-2xl font-bold text-sm transition-all">
                    Submit Answers
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">{quizScore / quizQuestions.length >= 0.7 ? "🏆" : "💪"}</div>
                  <div className="font-bold text-white text-2xl mb-2">
                    {quizScore}/{quizQuestions.length} correct
                  </div>
                  <div className="text-white/50 text-sm mb-8">
                    {quizScore / quizQuestions.length >= 0.7
                      ? "Excellent work! Lesson complete."
                      : "Good try. Review the lesson and try again."}
                  </div>
                  <div className="space-y-3 text-left mb-8">
                    {quizQuestions.map((q, qi) => (
                      <div key={q.id} className={cn(
                        "p-4 rounded-xl border text-sm",
                        quizAnswers[qi] === q.correct
                          ? "border-teal-500/40 bg-teal-500/10"
                          : "border-red-500/40 bg-red-500/10"
                      )}>
                        <div className="font-semibold text-white mb-1">
                          {quizAnswers[qi] === q.correct ? "✅" : "❌"} {q.question}
                        </div>
                        {q.explanation && (
                          <div className="text-white/50 text-xs">{q.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {nextLesson && (
                    <Link href={`/courses/${course.slug}/learn/${nextLesson.slug}`}
                      className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                      Next Lesson <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* WREN AI TAB */}
          {tab === "wren" && (
            <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {aiMessages.length === 0 && (
                  <div className="text-center pt-12">
                    <div className="text-4xl mb-3">🤖</div>
                    <div className="font-bold text-white mb-1">Ask Wren</div>
                    <div className="text-white/40 text-sm mb-6">
                      Your AI tutor for {course.title}. Ask anything about this lesson.
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Explain this more simply", "Give me a hint", "How does this apply at Nigerian companies?"].map(s => (
                        <button key={s} onClick={() => setAiInput(s)}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white/70 px-3 py-1.5 rounded-full transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {aiMessages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    {m.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-teal-500/30 border border-teal-500/50 flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5">
                        🤖
                      </div>
                    )}
                    <div className={cn(
                      "max-w-sm rounded-2xl px-4 py-2.5 text-sm",
                      m.role === "user"
                        ? "bg-teal-500 text-white rounded-br-sm"
                        : "bg-white/10 text-white/80 rounded-bl-sm"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-teal-500/30 border border-teal-500/50 flex items-center justify-center text-sm mr-2">🤖</div>
                    <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={aiEndRef} />
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendToWren()}
                    placeholder="Ask Wren anything about this lesson..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-500/60"
                  />
                  <button onClick={sendToWren} disabled={!aiInput.trim() || aiLoading}
                    className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
