"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users, BookOpen, Plus, LogOut, Search,
  BarChart2, ChevronRight, Loader2, Check, X,
  GraduationCap, Star, Flame, Trophy,
  Building2, UserPlus, Send, Eye, Layers,
  TrendingUp, Award, Clock, AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface Student {
  id: string; name: string | null; email: string; avatar: string | null
  total_xp: number; current_streak: number; completions: number; last_activity_at: string | null
}
interface Cohort {
  id: string; name: string; description: string | null; grade: string | null
  year: string | null; created_at: string
  cohort_students: { student_id: string }[]
  cohort_courses:  { course_id: string }[]
}
interface Course { id: string; title: string; slug: string; difficulty: string }
interface School { id: string; name: string; city: string | null; state: string | null; logo: string | null }
interface Props { profile: any; school: School | null; cohorts: Cohort[]; courses: Course[]; userEmail: string }

function timeAgo(iso: string | null) {
  if (!iso) return "Never"
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d === 0) return "Today"; if (d === 1) return "Yesterday"
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric" })
}

function Avatar({ name, email, avatar, size = 36 }: { name: string | null; email: string; avatar: string | null; size?: number }) {
  const initials = (name ?? email)[0].toUpperCase()
  return (
    <div className="rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-black text-white"
      style={{ width: size, height: size, background: "linear-gradient(135deg, #134e4a, #0e7490)", fontSize: size * 0.38 }}>
      {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initials}
    </div>
  )
}

// ── Setup screen (no school yet) ──────────────────────────────────────────────
function SetupScreen({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  const steps = [
    { icon: "🏫", title: "School profile created",   desc: "Our team sets up your school on the platform" },
    { icon: "👩‍🏫", title: "Teacher accounts invited", desc: "Add all teachers via invitation email" },
    { icon: "📚", title: "Classes created",            desc: "Organise students into classes by grade or subject" },
    { icon: "👨‍🎓", title: "Students enrolled",          desc: "Invite students individually or via bulk CSV upload" },
    { icon: "📊", title: "Progress monitoring live",   desc: "Track every student's missions, XP and streaks in real time" },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8" }}>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #2ec4b6, #0d9488)", color: "#fff" }}>W</div>
            <span className="font-black text-sm" style={{ color: "#0a192f" }}>Wikrena Academy</span>
          </div>
          <button onClick={onSignOut} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #0a192f, #0d2540)", boxShadow: "0 8px 32px rgba(10,25,47,0.2)" }}>
            🏫
          </div>
          <h1 className="font-black text-3xl mb-3" style={{ color: "#0a192f", letterSpacing: "-0.5px" }}>
            Welcome to Wikrena for Schools
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto">
            Your school account is being set up. Our team will contact you within 24 hours
            to complete onboarding and help you create your first class.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-5 border-b border-slate-50 last:border-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(46,196,182,0.12), rgba(46,196,182,0.06))", border: "1px solid rgba(46,196,182,0.2)" }}>
                {s.icon}
              </div>
              <div className="flex-1 pt-1">
                <div className="font-bold text-sm mb-0.5" style={{ color: "#0a192f" }}>{s.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{s.desc}</div>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-1"
                style={{ background: "#f0fdf9", color: "#0d9488", border: "1px solid #a7f3d0" }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, #0a192f, #0d2540)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-3xl shrink-0">💬</div>
          <div className="flex-1">
            <div className="font-bold text-white text-sm mb-0.5">Need to get started sooner?</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Email us at <span style={{ color: "#2ec4b6" }}>schools@wikrena.com</span> and we'll set you up within 2 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export function SchoolDashboard({ profile, school, cohorts: init, courses, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const name     = profile?.name ?? userEmail?.split("@")[0] ?? "Teacher"

  const [cohorts,      setCohorts]      = useState(init)
  const [view,         setView]         = useState<"overview" | "cohort">("overview")
  const [activeCohort, setActiveCohort] = useState<Cohort | null>(null)
  const [students,     setStudents]     = useState<Student[]>([])
  const [loading,      setLoading]      = useState(false)
  const [showNew,      setShowNew]      = useState(false)
  const [showInvite,   setShowInvite]   = useState(false)
  const [cName,        setCName]        = useState("")
  const [cGrade,       setCGrade]       = useState("")
  const [iEmail,       setIEmail]       = useState("")
  const [iName,        setIName]        = useState("")
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState("")
  const [msg,          setMsg]          = useState("")
  const [search,       setSearch]       = useState("")

  const totalStudents  = cohorts.reduce((s, c) => s + c.cohort_students.length, 0)
  const totalCourses   = cohorts.reduce((s, c) => s + c.cohort_courses.length, 0)

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  async function openCohort(cohort: Cohort) {
    setActiveCohort(cohort); setView("cohort"); setLoading(true)
    const res  = await fetch(`/api/school/students?cohortId=${cohort.id}`)
    const data = await res.json()
    setStudents(data.students ?? [])
    setLoading(false)
  }

  async function createCohort(e: React.FormEvent) {
    e.preventDefault(); if (!school || !cName.trim()) return
    setSaving(true); setError("")
    const res  = await fetch("/api/school/cohorts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body:   JSON.stringify({ school_id: school.id, name: cName.trim(), grade: cGrade || null }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setCohorts(p => [{ ...data.cohort, cohort_students: [], cohort_courses: [] }, ...p])
    setCName(""); setCGrade(""); setShowNew(false); setSaving(false)
  }

  async function inviteStudent(e: React.FormEvent) {
    e.preventDefault(); if (!activeCohort || !school || !iEmail.trim()) return
    setSaving(true); setError(""); setMsg("")
    const res  = await fetch("/api/school/students", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body:   JSON.stringify({ cohort_id: activeCohort.id, school_id: school.id, email: iEmail.trim(), student_name: iName.trim() || undefined }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setMsg(`Invitation sent to ${iEmail}`)
    setIEmail(""); setIName(""); setShowInvite(false); setSaving(false)
  }

  if (!school) return <SetupScreen name={name} onSignOut={signOut} />

  const filteredStudents = students.filter(s =>
    !search || (s.name ?? s.email).toLowerCase().includes(search.toLowerCase())
  )

  const avgXp       = students.length ? Math.round(students.reduce((s, st) => s + st.total_xp, 0) / students.length) : 0
  const onStreak    = students.filter(s => s.current_streak > 0).length
  const activeWeek  = students.filter(s => s.last_activity_at && Date.now() - new Date(s.last_activity_at).getTime() < 7 * 24 * 60 * 60 * 1000).length

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8" }}>

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Logo + school name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #2ec4b6, #0d9488)", color: "#fff" }}>W</div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-black text-sm" style={{ color: "#0a192f" }}>{school.name}</span>
              {school.city && <span className="text-xs text-slate-400 hidden sm:inline">· {school.city}</span>}
            </div>
          </div>

          {/* Centre: breadcrumb */}
          {view === "cohort" && activeCohort && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <button onClick={() => { setView("overview"); setActiveCohort(null) }}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors">
                Overview
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-xs font-bold truncate" style={{ color: "#0a192f" }}>{activeCohort.name}</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "#f0fdf9", color: "#0d9488", border: "1px solid #a7f3d0" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Active
            </div>
            <button onClick={signOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {view === "overview" ? (
          <>
            {/* ── HERO BANNER ── */}
            <div className="rounded-2xl p-6 mb-6 flex items-center justify-between gap-4 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0a192f 0%, #0d2540 60%, #0a2a1f 100%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(46,196,182,0.1), transparent)", transform: "translate(20%,-20%)" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">👋</span>
                  <h1 className="font-black text-xl text-white" style={{ letterSpacing: "-0.3px" }}>
                    Welcome back, {name.split(" ")[0]}
                  </h1>
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {cohorts.length === 0
                    ? "Create your first class to start enrolling students."
                    : `${cohorts.length} class${cohorts.length !== 1 ? "es" : ""} · ${totalStudents} student${totalStudents !== 1 ? "s" : ""} enrolled`}
                </p>
              </div>
              <button onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shrink-0 transition-all relative z-10"
                style={{ background: "#2ec4b6", color: "#fff" }}>
                <Plus className="w-4 h-4" /> New Class
              </button>
            </div>

            {/* ── STATS ── */}
            {cohorts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: <Layers className="w-5 h-5" />,   label: "Classes",  value: cohorts.length,  color: "#0a192f",  bg: "#f0f4f8" },
                  { icon: <Users className="w-5 h-5" />,    label: "Students", value: totalStudents,   color: "#0d9488",  bg: "#f0fdf9" },
                  { icon: <BookOpen className="w-5 h-5" />, label: "Courses",  value: totalCourses,    color: "#7c3aed",  bg: "#faf5ff" },
                  { icon: <Building2 className="w-5 h-5" />,label: "Location", value: school.city ?? "Active", color: "#d97706", bg: "#fffbeb" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: s.bg, color: s.color }}>
                      {s.icon}
                    </div>
                    <div className="font-black text-2xl mb-0.5" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── NEW CLASS FORM ── */}
            {showNew && (
              <form onSubmit={createCohort}
                className="bg-white rounded-2xl p-5 mb-5 flex items-end gap-3 flex-wrap"
                style={{ border: "2px solid rgba(46,196,182,0.3)", boxShadow: "0 0 0 4px rgba(46,196,182,0.06)" }}>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Class Name</label>
                  <input autoFocus value={cName} onChange={e => setCName(e.target.value)} required
                    placeholder="e.g. Year 9A — Computer Science"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Grade / Year</label>
                  <input value={cGrade} onChange={e => setCGrade(e.target.value)} placeholder="Year 9"
                    className="w-32 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                </div>
                {error && (
                  <p className="w-full flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}
                <div className="flex gap-2">
                  <button type="submit" disabled={saving || !cName.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all"
                    style={{ background: "#2ec4b6" }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Create Class
                  </button>
                  <button type="button" onClick={() => { setShowNew(false); setError("") }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── COHORT CARDS ── */}
            {cohorts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-14 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>🏫</div>
                <div className="font-bold text-slate-700 mb-1">No classes yet</div>
                <p className="text-slate-400 text-sm mb-5">Create your first class to start enrolling students and tracking progress.</p>
                <button onClick={() => setShowNew(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                  style={{ background: "#2ec4b6" }}>
                  <Plus className="w-4 h-4" /> Create First Class
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cohorts.map(cohort => (
                  <div key={cohort.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all hover:-translate-y-0.5"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    {/* Card header */}
                    <div className="p-5 relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #0a192f, #0d2540)" }}>
                      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(46,196,182,0.1), transparent)", transform: "translate(30%,-30%)" }} />
                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <h3 className="font-black text-white text-base leading-tight flex-1 pr-2">{cohort.name}</h3>
                        {cohort.grade && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: "rgba(46,196,182,0.2)", color: "#2ec4b6", border: "1px solid rgba(46,196,182,0.3)" }}>
                            {cohort.grade}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs relative z-10" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {cohort.cohort_students.length} students
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {cohort.cohort_courses.length} courses
                        </span>
                      </div>
                    </div>
                    {/* Card actions */}
                    <div className="p-4 flex gap-2">
                      <button onClick={() => openCohort(cohort)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                        style={{ background: "#2ec4b6" }}>
                        <Eye className="w-3.5 h-3.5" /> View Class
                      </button>
                      <button onClick={() => { setActiveCohort(cohort); setView("cohort"); setStudents([]); setShowInvite(true) }}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ── COHORT VIEW ── */}

            {/* Cohort header */}
            <div className="bg-white rounded-2xl p-5 mb-5 flex items-center gap-4 border border-slate-100"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "linear-gradient(135deg, #0a192f, #0d2540)" }}>
                📚
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-black text-lg" style={{ color: "#0a192f" }}>{activeCohort?.name}</h2>
                  {activeCohort?.grade && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#f0fdf9", color: "#0d9488", border: "1px solid #a7f3d0" }}>
                      {activeCohort.grade}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{students.length} students enrolled</div>
              </div>
              <button onClick={() => setShowInvite(!showInvite)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white shrink-0 transition-all"
                style={{ background: "#2ec4b6" }}>
                <UserPlus className="w-4 h-4" /> Invite Student
              </button>
            </div>

            {/* Cohort stats */}
            {students.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: <Users className="w-4 h-4" />,      label: "Students",    value: students.length,   color: "#0d9488", bg: "#f0fdf9" },
                  { icon: <Star className="w-4 h-4" />,        label: "Avg XP",      value: avgXp,             color: "#d97706", bg: "#fffbeb" },
                  { icon: <Flame className="w-4 h-4" />,       label: "On Streak",   value: onStreak,          color: "#ea580c", bg: "#fff7ed" },
                  { icon: <TrendingUp className="w-4 h-4" />,  label: "Active Week", value: activeWeek,        color: "#7c3aed", bg: "#faf5ff" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.bg, color: s.color }}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="font-black text-xl leading-none" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Success message */}
            {msg && (
              <div className="mb-4 p-3.5 rounded-xl flex items-center gap-2 text-sm font-medium"
                style={{ background: "#f0fdf9", border: "1px solid #a7f3d0", color: "#0f766e" }}>
                <Check className="w-4 h-4 shrink-0" /> {msg}
              </div>
            )}

            {/* Invite form */}
            {showInvite && activeCohort && (
              <form onSubmit={inviteStudent}
                className="bg-white rounded-2xl p-5 mb-5 flex items-end gap-3 flex-wrap"
                style={{ border: "2px solid rgba(46,196,182,0.3)", boxShadow: "0 0 0 4px rgba(46,196,182,0.06)" }}>
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Student Name</label>
                  <input value={iName} onChange={e => setIName(e.target.value)} placeholder="Amara Okonkwo"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                </div>
                <div className="flex-1 min-w-[220px]">
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Email Address</label>
                  <input type="email" value={iEmail} onChange={e => setIEmail(e.target.value)} required
                    placeholder="student@school.edu.ng"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                </div>
                {error && (
                  <p className="w-full flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}
                <div className="flex gap-2">
                  <button type="submit" disabled={saving || !iEmail.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                    style={{ background: "#2ec4b6" }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Invite
                  </button>
                  <button type="button" onClick={() => { setShowInvite(false); setError("") }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Student list */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-14 text-center">
                <div className="text-5xl mb-3">👩‍🎓</div>
                <div className="font-bold text-slate-700 mb-1">No students yet</div>
                <p className="text-slate-400 text-sm mb-5">Invite students to this class to start tracking their progress.</p>
                <button onClick={() => setShowInvite(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ background: "#2ec4b6" }}>
                  <UserPlus className="w-4 h-4" /> Invite First Student
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

                {/* Search */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-xs h-9 rounded-xl px-3.5 bg-slate-50 border border-slate-200">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search students..."
                      className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400" />
                    {search && (
                      <button onClick={() => setSearch("")}>
                        <X className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 ml-auto">{filteredStudents.length} students</span>
                </div>

                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="col-span-4">Student</div>
                  <div className="col-span-2 text-center">XP</div>
                  <div className="col-span-2 text-center">Missions</div>
                  <div className="col-span-2 text-center">Streak</div>
                  <div className="col-span-2 text-center">Last Active</div>
                </div>

                {/* Student rows */}
                {filteredStudents.map((s, i) => (
                  <div key={s.id}
                    className={cn("flex sm:grid sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 items-center border-b border-slate-50 hover:bg-slate-50/70 transition-colors last:border-0",
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                    <div className="sm:col-span-4 flex items-center gap-3 flex-1 min-w-0">
                      <Avatar name={s.name} email={s.email} avatar={s.avatar} size={36} />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate" style={{ color: "#0a192f" }}>
                          {s.name ?? s.email.split("@")[0]}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{s.email}</div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:flex items-center justify-center gap-1 font-bold text-amber-500 text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" /> {s.total_xp}
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:block font-bold text-teal-600 text-sm">{s.completions}</div>
                    <div className="sm:col-span-2 text-center hidden sm:flex items-center justify-center">
                      {s.current_streak > 0
                        ? <span className="font-bold text-orange-500 flex items-center gap-1 text-sm">
                            <Flame className="w-3.5 h-3.5 fill-current" />{s.current_streak}d
                          </span>
                        : <span className="text-slate-200 text-lg">—</span>}
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:block text-xs text-slate-400">{timeAgo(s.last_activity_at)}</div>
                  </div>
                ))}

                {/* Footer totals */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50 border-t border-slate-100 text-xs font-bold">
                  <div className="col-span-4 text-slate-500">{filteredStudents.length} students</div>
                  <div className="col-span-2 text-center text-amber-500">Avg {avgXp} XP</div>
                  <div className="col-span-2 text-center text-teal-600">
                    Avg {students.length ? Math.round(students.reduce((s, st) => s + st.completions, 0) / students.length) : 0}
                  </div>
                  <div className="col-span-2 text-center text-orange-500">{onStreak} on streak</div>
                  <div className="col-span-2 text-center text-purple-500">{activeWeek} this week</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
