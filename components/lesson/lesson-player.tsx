"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Play, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown,
  BookOpen, Code2, Bot, StickyNote, Lightbulb, RotateCcw,
  Bookmark, BookmarkCheck, Trophy, Flame, Zap, X, Menu,
  Lock, Check, Clock, ArrowLeft
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { VideoPlayer } from "@/components/lesson/video-player"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lesson {
  id: string
  title: string
  slug: string
  type: string
  content: string | null
  video_url: string | null
  mux_playback_id: string | null
  xp_reward: number
  order: number
  is_free: boolean
  course_id: string
}

interface Module {
  id: string
  title: string
  slug: string
  description: string
  icon: string | null
  estimated_hours: number
}

interface Props {
  module:        Module
  lessons:       Lesson[]
  currentLesson: Lesson
  completedIds:  Set<string>
  savedNote:     string
  isBookmarked:  boolean
  userEmail:     string
  userId:        string
  profile:       any
}

// ── Wren AI modes ──────────────────────────────────────────────────────────────
const AI_MODES = [
  { id:"explain", icon:"💡", label:"Explain", desc:"Break it down clearly" },
  { id:"hint",    icon:"🔍", label:"Hint",    desc:"Nudge me in the right direction" },
  { id:"debug",   icon:"🐛", label:"Debug",   desc:"Help me fix my code" },
  { id:"quiz",    icon:"🎯", label:"Quiz",    desc:"Test my understanding" },
  { id:"career",  icon:"💼", label:"Career",  desc:"How does this apply to real jobs?" },
]

// ── Quiz data ─────────────────────────────────────────────────────────────────
const DEMO_QUIZ = [
  {
    id:"q1",
    question:"Which SQL clause is used to filter rows AFTER aggregation?",
    options:["WHERE","HAVING","GROUP BY","ORDER BY"],
    correct:1,
    explanation:"HAVING filters grouped results, while WHERE filters individual rows before grouping."
  },
  {
    id:"q2",
    question:"In a Flutterwave transaction table, which query finds all failed payments above ₦50,000?",
    options:[
      "SELECT * FROM txns WHERE amount > 50000",
      "SELECT * FROM txns WHERE status = 'failed' AND amount > 50000",
      "SELECT * FROM txns WHERE amount > 50000 HAVING status = 'failed'",
      "SELECT * FROM txns GROUP BY status WHERE amount > 50000"
    ],
    correct:1,
    explanation:"You need both conditions: status filter and amount filter, joined with AND."
  },
  {
    id:"q3",
    question:"What does COUNT(DISTINCT customer_id) return?",
    options:[
      "Total number of rows",
      "Number of unique customers",
      "Average customer count",
      "Sum of all customer IDs"
    ],
    correct:1,
    explanation:"DISTINCT inside COUNT removes duplicates, so you get the count of unique values."
  },
]

export function LessonPlayer({
  module, lessons, currentLesson, completedIds,
  savedNote, isBookmarked, userEmail, userId, profile
}: Props) {
  const router   = useRouter()
  const supabase = createClient()

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<"exercise"|"quiz"|"wren"|"notes">("exercise")
  const [code,         setCode]         = useState("# Write your Python code here\n\ndf = pd.read_csv('transactions.csv')\nprint(df.head())\n")
  const [output,       setOutput]       = useState("")
  const [running,      setRunning]      = useState(false)
  const [completed,    setCompleted]    = useState(completedIds.has(currentLesson.id))
  const [marking,      setMarking]      = useState(false)
  const [xpEarned,     setXpEarned]     = useState<number|null>(null)
  const [note,         setNote]         = useState(savedNote)
  const [noteSaving,   setNoteSaving]   = useState(false)
  const [bookmarked,   setBookmarked]   = useState(isBookmarked)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [showXpBanner, setShowXpBanner] = useState(false)

  // Quiz state
  const [quizAnswers,  setQuizAnswers]  = useState<Record<string,number>>({})
  const [quizSubmitted,setQuizSubmitted]= useState(false)
  const [quizScore,    setQuizScore]    = useState(0)

  // Wren AI state
  const [aiMode,       setAiMode]       = useState("explain")
  const [aiMessages,   setAiMessages]   = useState<{role:string,content:string}[]>([])
  const [aiInput,      setAiInput]      = useState("")
  const [aiLoading,    setAiLoading]    = useState(false)
  const [sessionId,    setSessionId]    = useState<string|null>(null)
  const aiBottomRef = useRef<HTMLDivElement>(null)

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson   = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson   = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const moduleProgress = Math.round((completedIds.size / lessons.length) * 100)

  // ── Run code via Judge0 ────────────────────────────────────────────────────
  async function runCode() {
    setRunning(true)
    setOutput("")
    try {
      const res = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ code, language:"python" }),
      })
      const data = await res.json()
      setOutput(data.output || data.error || "No output")
    } catch {
      setOutput("Error running code. Check your JUDGE0_API_KEY.")
    } finally {
      setRunning(false)
    }
  }

  // ── Mark lesson complete ───────────────────────────────────────────────────
  async function markComplete() {
    if (completed || marking) return
    setMarking(true)
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ lessonId: currentLesson.id }),
      })
      const data = await res.json()
      if (data.success) {
        setCompleted(true)
        setXpEarned(data.xpEarned)
        setShowXpBanner(true)
        setTimeout(() => setShowXpBanner(false), 4000)
        // Auto advance to next lesson after 2s
        if (nextLesson) {
          setTimeout(() => {
            router.push(`/learn/${module.slug}/${nextLesson.slug}`)
          }, 2500)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setMarking(false)
    }
  }

  // ── Quiz submit ────────────────────────────────────────────────────────────
  function submitQuiz() {
    let score = 0
    DEMO_QUIZ.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score++
    })
    setQuizScore(score)
    setQuizSubmitted(true)
    // Award XP for passing
    if (score >= 2) {
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ lessonId: currentLesson.id, score, total: DEMO_QUIZ.length }),
      }).catch(() => {})
    }
  }

  // ── Save note ──────────────────────────────────────────────────────────────
  const saveNote = useCallback(async (content: string) => {
    setNoteSaving(true)
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ lessonId: currentLesson.id, content }),
    })
    setNoteSaving(false)
  }, [currentLesson.id])

  // Debounced note save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (note !== savedNote) saveNote(note)
    }, 1500)
    return () => clearTimeout(timer)
  }, [note, savedNote, saveNote])

  // ── Toggle bookmark ────────────────────────────────────────────────────────
  async function toggleBookmark() {
    const was = bookmarked
    setBookmarked(!was)
    await fetch("/api/bookmarks", {
      method: was ? "DELETE" : "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ lessonId: currentLesson.id }),
    })
  }

  // ── Wren AI send ───────────────────────────────────────────────────────────
  async function sendAiMessage() {
    if (!aiInput.trim() || aiLoading) return
    const msg = aiInput.trim()
    setAiInput("")
    setAiMessages(prev => [...prev, { role:"user", content:msg }])
    setAiLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          message: msg,
          sessionId,
          mode: aiMode,
          lessonTitle: currentLesson.title,
          userCode: code,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setAiMessages(prev => [...prev, { role:"assistant", content:data.reply }])
        if (data.sessionId) setSessionId(data.sessionId)
      }
    } catch {
      setAiMessages(prev => [...prev, { role:"assistant", content:"Sorry, Wren is unavailable right now. Check your ANTHROPIC_API_KEY." }])
    } finally {
      setAiLoading(false)
    }
  }

  // Auto-scroll AI
  useEffect(() => {
    aiBottomRef.current?.scrollIntoView({ behavior:"smooth" })
  }, [aiMessages])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0d1117] overflow-hidden">

      {/* ── XP Banner ── */}
      {showXpBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="flex items-center gap-3 bg-teal-500 text-white px-6 py-3 rounded-2xl shadow-float">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">+{xpEarned} XP earned!</span>
            {nextLesson && <span className="text-teal-100 text-sm">→ Next lesson loading...</span>}
          </div>
        </div>
      )}

      {/* ── Top bar ── */}
      <header className="h-12 bg-[#161b22] border-b border-white/10 flex items-center px-3 gap-3 shrink-0 z-30">
        <Link href="/dashboard"
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="w-px h-4 bg-white/15" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-white/50 flex-1 min-w-0">
          <span className="hidden sm:inline text-white/30">{module.title}</span>
          <span className="hidden sm:inline text-white/20">/</span>
          <span className="text-white/70 truncate">{currentLesson.title}</span>
        </div>

        {/* Progress */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width:`${moduleProgress}%` }} />
          </div>
          <span className="text-[10px] text-white/40 font-code">
            {completedIds.size}/{lessons.length}
          </span>
        </div>

        {/* Streak + XP */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {profile?.current_streak > 0 && (
            <div className="flex items-center gap-1 text-coral-400 text-xs font-code">
              <Flame className="w-3.5 h-3.5" />
              {profile.current_streak}
            </div>
          )}
          <div className="flex items-center gap-1 text-teal-400 text-xs font-code">
            <Zap className="w-3.5 h-3.5" />
            {(profile?.total_xp ?? 0).toLocaleString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={toggleBookmark}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/10 transition-all">
            {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setSidebarOpen(v => !v)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10">
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Lesson sidebar (lesson list) ── */}
        <aside className={cn(
          "w-64 bg-[#161b22] border-r border-white/10 flex flex-col overflow-hidden transition-all duration-200 shrink-0",
          "hidden md:flex",
          sidebarOpen && "flex fixed md:relative inset-y-0 left-0 z-40 pt-12 md:pt-0"
        )}>
          {/* Module header */}
          <div className="px-4 py-3.5 border-b border-white/10">
            <div className="text-xs text-teal-400 font-code mb-0.5">{module.icon ?? "📘"} Module</div>
            <div className="font-semibold text-white text-sm leading-tight">{module.title}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-teal-500 transition-all"
                  style={{ width:`${moduleProgress}%` }} />
              </div>
              <span className="text-[10px] font-code text-white/30">{moduleProgress}%</span>
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
            {lessons.map((lesson, i) => {
              const isDone   = completedIds.has(lesson.id)
              const isCurrent = lesson.id === currentLesson.id
              return (
                <Link key={lesson.id}
                  href={`/learn/${module.slug}/${lesson.slug}`}
                  className={cn(
                    "flex items-start gap-2.5 px-3.5 py-2.5 text-xs transition-all group",
                    isCurrent ? "bg-teal-500/10 border-l-2 border-teal-500" : "hover:bg-white/5 border-l-2 border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    isDone   ? "bg-teal-500" :
                    isCurrent ? "bg-teal-500/30 border border-teal-500" :
                    "bg-white/10 border border-white/20"
                  )}>
                    {isDone ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <span className={cn("font-code text-[9px]", isCurrent ? "text-teal-300" : "text-white/30")}>{i+1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("leading-tight font-medium",
                      isCurrent ? "text-teal-300" : isDone ? "text-white/50" : "text-white/70 group-hover:text-white/90"
                    )}>
                      {lesson.title}
                    </div>
                    <div className="text-white/25 font-code mt-0.5 text-[9px]">
                      {lesson.type === "VIDEO" ? "▶ Video" : "📝 Reading"} · {lesson.xp_reward} XP
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── CENTER: Video + content ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Video area */}
          <div className="shrink-0" style={{ maxHeight:"45vh" }}>
            <VideoPlayer
              url={currentLesson.mux_playback_id
                ? `https://stream.mux.com/${currentLesson.mux_playback_id}`
                : currentLesson.video_url ?? ""}
              title={currentLesson.title}
            />
          </div>

          {/* Lesson content */}
          <div className="flex-1 overflow-y-auto bg-[#0d1117] scrollbar-hide">
            <div className="p-4 sm:p-5">

              {/* Lesson header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="font-display font-bold text-white text-lg leading-tight mb-1">
                    {currentLesson.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-code text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                      +{currentLesson.xp_reward} XP
                    </span>
                    <span className="text-[10px] font-code text-white/30">
                      {currentLesson.type === "VIDEO" ? "Video Lesson" : "Reading"}
                    </span>
                  </div>
                </div>

                {/* Mark complete button */}
                <button
                  onClick={markComplete}
                  disabled={completed || marking}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0",
                    completed
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 cursor-default"
                      : "bg-teal-500 hover:bg-teal-400 text-white shadow-teal"
                  )}
                >
                  {completed ? (
                    <><CheckCircle2 className="w-4 h-4" /> Completed</>
                  ) : marking ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4" /> Mark Done</>
                  )}
                </button>
              </div>

              {/* African Data Story context */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 mb-4">
                <div className="text-[10px] font-code text-teal-400 uppercase tracking-widest mb-2">🌍 African Business Context</div>
                <p className="text-white/60 text-sm leading-relaxed">
                  In 2023, Flutterwave&apos;s fraud analytics team used exactly this technique to cross-reference
                  three transaction tables and identify ₦800M in suspicious patterns within 48 hours.
                  This is not a theoretical exercise — this is what data analysts do at African fintechs every day.
                </p>
              </div>

              {/* Lesson content */}
              {currentLesson.content && (
                <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>
              )}

              {/* Lesson nav */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                {prevLesson ? (
                  <Link href={`/learn/${module.slug}/${prevLesson.slug}`}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline truncate max-w-[120px]">{prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                  </Link>
                ) : <div />}

                {nextLesson ? (
                  <Link href={`/learn/${module.slug}/${nextLesson.slug}`}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-teal-400 transition-colors">
                    <span className="hidden sm:inline truncate max-w-[120px]">{nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="text-xs text-teal-400 font-semibold">🎉 Module complete!</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Exercise / Quiz / Wren / Notes ── */}
        <div className="w-full md:w-[420px] lg:w-[480px] bg-[#161b22] border-l border-white/10 flex flex-col shrink-0 hidden md:flex">

          {/* Tab bar */}
          <div className="flex border-b border-white/10 shrink-0">
            {[
              { id:"exercise", icon:Code2,    label:"Exercise" },
              { id:"quiz",     icon:BookOpen, label:"Quiz"     },
              { id:"wren",     icon:Bot,      label:"Wren AI"  },
              { id:"notes",    icon:StickyNote,label:"Notes"   },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-all border-b-2",
                  activeTab === tab.id
                    ? "text-teal-400 border-teal-500 bg-teal-500/5"
                    : "text-white/30 border-transparent hover:text-white/60 hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden flex flex-col">

            {/* ── EXERCISE TAB ── */}
            {activeTab === "exercise" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Instructions */}
                <div className="p-4 border-b border-white/10 bg-[#0d1117]/50">
                  <div className="text-[10px] font-code text-amber-400 uppercase tracking-widest mb-2">Challenge</div>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Using the MTN subscriber dataset, write a SQL query to find the top 5 states
                    by average monthly data usage. Show state name and average_gb rounded to 2 decimal places.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="chip chip-neutral text-[10px]">SQL</span>
                    <span className="chip chip-amber text-[10px]">Intermediate</span>
                  </div>
                </div>

                {/* Code editor */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1117] border-b border-white/10 shrink-0">
                    <span className="text-[10px] font-code text-white/30">solution.sql</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setCode("-- Write your SQL here\n\nSELECT \n  state,\n  ROUND(AVG(monthly_gb), 2) AS average_gb\nFROM mtn_subscribers\nGROUP BY state\nORDER BY average_gb DESC\nLIMIT 5;")}
                        className="text-[10px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <textarea
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full bg-[#0d1117] text-green-300 font-code text-xs p-3 resize-none outline-none leading-relaxed"
                      style={{ minHeight:"180px" }}
                      placeholder="-- Write your SQL or Python here..."
                    />
                  </div>
                </div>

                {/* Output */}
                <div className="border-t border-white/10 shrink-0">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1117]">
                    <span className="text-[10px] font-code text-white/30">Output</span>
                    <button onClick={runCode} disabled={running}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-teal-500 hover:bg-teal-400 text-white px-3 py-1 rounded-lg transition-all disabled:opacity-50">
                      {running ? (
                        <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> Running...</>
                      ) : (
                        <><Play className="w-3 h-3 ml-0.5" /> Run Code</>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 px-3 py-2 font-code text-[11px] text-green-300 min-h-[60px] max-h-[100px] overflow-y-auto">
                    {output || <span className="text-white/20">Click Run to execute your code...</span>}
                  </div>
                </div>

                {/* Hints */}
                <div className="border-t border-white/10 px-3 py-2 bg-[#0d1117]/50 shrink-0">
                  <div className="flex gap-2">
                    {[1,2,3].map(level => (
                      <button key={level}
                        onClick={() => setAiInput(`Give me hint level ${level} for this challenge`)}
                        className="flex items-center gap-1 text-[10px] text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-all"
                        title={`Hint ${level} — costs XP`}
                      >
                        <Lightbulb className="w-3 h-3" />
                        Hint {level}
                      </button>
                    ))}
                    <button onClick={() => setActiveTab("wren")}
                      className="ml-auto flex items-center gap-1 text-[10px] text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 px-2 py-1 rounded-lg transition-all">
                      <Bot className="w-3 h-3" /> Ask Wren
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── QUIZ TAB ── */}
            {activeTab === "quiz" && (
              <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <div className="text-[10px] font-code text-white/30 uppercase tracking-widest mb-4">
                  Lesson Quiz · {DEMO_QUIZ.length} questions
                </div>

                {quizSubmitted ? (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-3">
                      {quizScore >= 2 ? "🎉" : "😅"}
                    </div>
                    <div className="font-display font-bold text-xl text-white mb-1">
                      {quizScore}/{DEMO_QUIZ.length} correct
                    </div>
                    <div className={cn("text-sm mb-4", quizScore >= 2 ? "text-teal-400" : "text-coral-400")}>
                      {quizScore >= 2 ? `Excellent! +${quizScore * 25} XP earned` : "Keep going — try again!"}
                    </div>
                    {DEMO_QUIZ.map(q => (
                      <div key={q.id} className="text-left mb-4 bg-white/5 rounded-xl p-3">
                        <div className="text-xs text-white/60 mb-1">{q.question}</div>
                        <div className={cn("text-xs font-semibold",
                          quizAnswers[q.id] === q.correct ? "text-teal-400" : "text-red-400")}>
                          Your answer: {q.options[quizAnswers[q.id]]} {quizAnswers[q.id] === q.correct ? "✓" : "✗"}
                        </div>
                        {quizAnswers[q.id] !== q.correct && (
                          <div className="text-xs text-white/40 mt-1">Correct: {q.options[q.correct]}</div>
                        )}
                        <div className="text-xs text-white/30 mt-1 italic">{q.explanation}</div>
                      </div>
                    ))}
                    <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}
                      className="text-xs text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 px-4 py-2 rounded-lg transition-all">
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {DEMO_QUIZ.map((q, qi) => (
                      <div key={q.id} className="mb-5">
                        <div className="text-xs text-white/70 font-medium mb-2 leading-relaxed">
                          <span className="text-white/30 font-code mr-1">{qi+1}.</span>
                          {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <button key={oi} onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: oi}))}
                              className={cn(
                                "w-full text-left text-xs px-3 py-2.5 rounded-xl border transition-all",
                                quizAnswers[q.id] === oi
                                  ? "bg-teal-500/15 border-teal-500 text-teal-300"
                                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70"
                              )}>
                              <span className="font-code text-white/20 mr-2">{String.fromCharCode(65+oi)}.</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < DEMO_QUIZ.length}
                      className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white text-sm font-bold py-2.5 rounded-xl transition-all"
                    >
                      Submit Quiz
                    </button>
                    <p className="text-[10px] text-white/25 text-center mt-2">
                      {DEMO_QUIZ.length - Object.keys(quizAnswers).length} questions remaining
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ── WREN AI TAB ── */}
            {activeTab === "wren" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mode selector */}
                <div className="flex gap-1 p-2 border-b border-white/10 overflow-x-auto scrollbar-hide shrink-0">
                  {AI_MODES.map(m => (
                    <button key={m.id} onClick={() => setAiMode(m.id)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all",
                        aiMode === m.id
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                          : "text-white/30 hover:text-white/60 hover:bg-white/5"
                      )}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
                  {aiMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-3xl mb-2">🤖</div>
                      <div className="text-white/40 text-xs font-semibold mb-1">Hi, I&apos;m Wren</div>
                      <div className="text-white/25 text-xs leading-relaxed max-w-[220px] mx-auto">
                        Your AI tutor for this lesson. Ask me anything about {currentLesson.title}.
                      </div>
                      <div className="mt-4 space-y-1.5">
                        {[
                          "Explain this concept with an MTN example",
                          "What job roles use this skill?",
                          "Give me a hint for the exercise",
                        ].map(q => (
                          <button key={q} onClick={() => { setAiInput(q); }}
                            className="block w-full text-left text-[10px] text-teal-400 border border-teal-500/20 hover:bg-teal-500/10 px-2.5 py-1.5 rounded-lg transition-all">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiMessages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                          <Bot className="w-3 h-3" />
                        </div>
                      )}
                      <div className={cn(
                        "text-xs rounded-xl px-3 py-2 max-w-[85%] leading-relaxed",
                        msg.role === "user"
                          ? "bg-teal-500/20 text-teal-100 border border-teal-500/30"
                          : "bg-white/8 text-white/70 border border-white/10"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                        <Bot className="w-3 h-3" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-1">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
                            style={{ animationDelay:`${i*150}ms` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={aiBottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-white/10 p-2 shrink-0">
                  <div className="flex gap-2">
                    <input
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                      placeholder="Ask Wren anything..."
                      className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-teal-500/50 transition-colors"
                    />
                    <button onClick={sendAiMessage} disabled={!aiInput.trim() || aiLoading}
                      className="w-8 h-8 bg-teal-500 hover:bg-teal-400 disabled:opacity-30 rounded-xl flex items-center justify-center transition-all">
                      <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                    </button>
                  </div>
                  <div className="text-[9px] text-white/15 text-center mt-1 font-code">
                    Powered by Claude · Mode: {aiMode}
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTES TAB ── */}
            {activeTab === "notes" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
                  <span className="text-[10px] font-code text-white/30">
                    Notes for: {currentLesson.title}
                  </span>
                  <span className={cn("text-[10px] font-code transition-colors",
                    noteSaving ? "text-amber-400" : "text-white/20")}>
                    {noteSaving ? "Saving..." : "Auto-saved"}
                  </span>
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Take notes here... markdown supported&#10;&#10;## Key concepts&#10;- SQL HAVING clause filters after GROUP BY&#10;- WHERE filters before aggregation"
                  className="flex-1 bg-[#0d1117] text-white/70 font-code text-xs p-4 resize-none outline-none leading-relaxed placeholder:text-white/20"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
