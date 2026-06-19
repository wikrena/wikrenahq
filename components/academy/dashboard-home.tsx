"use client"

import Link from "next/link"
import {
  Play, ArrowRight, Flame, Zap, BookOpen,
  Code2, Database, Target, ChevronRight,
  TrendingUp, Award, Clock, Sparkles,
  BarChart2, Layers, Star, Bot
} from "lucide-react"
import { getLevelFromXp, getNextLevel, getLevelProgress, cn } from "@/lib/utils"

interface Props {
  profile:     any
  enrollments: any[]
  totalXp:     number
  badges:      any[]
  userEmail:   string
}

const QUICK_ACTIONS = [
  { icon: Target,   label: "Practice",   sub: "Coding challenges",  href: "/challenges",  bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-700",   dot: "#2ec4b6" },
  { icon: Database, label: "Africa Lab", sub: "Real datasets",      href: "/africa-lab",  bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  dot: "#f59e0b" },
  { icon: Code2,    label: "Workspace",  sub: "Your code editor",   href: "/workspace",   bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "#8b5cf6" },
  { icon: Award,    label: "Leaderboard",sub: "This week's rank",   href: "/leaderboard", bg: "bg-coral-50",  border: "border-coral-200",  text: "text-coral-600",  dot: "#ff6b3d" },
]

export function DashboardHome({ profile, enrollments, totalXp, badges, userEmail }: Props) {
  const level       = getLevelFromXp(totalXp)
  const nextLevel   = getNextLevel(totalXp)
  const progressPct = getLevelProgress(totalXp)
  const streak      = profile?.current_streak ?? 0

  const firstName = profile?.name?.split(" ")[0] ?? null
  const hour      = new Date().getHours()
  const greeting  = hour < 5 ? "You're up late" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const activeEnrollment = enrollments[0] ?? null
  const activePath       = activeEnrollment?.courses ?? null
  const activePct        = Math.round(activeEnrollment?.progress_percent ?? 0)

  const readinessScore = Math.min(100, Math.round(
    (enrollments.length > 0 ? 20 : 0) +
    (totalXp > 0 ? Math.min(30, Math.round(totalXp / 50)) : 0) +
    (badges.length > 0 ? Math.min(20, badges.length * 4) : 0) +
    (streak > 0 ? Math.min(20, streak * 2) : 0) +
    (activePct > 0 ? Math.min(10, Math.round(activePct / 10)) : 0)
  ))

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── HERO CARD ──────────────────────────────────────────────────────── */}
      <div className="bg-navy-800 rounded-2xl overflow-hidden relative">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(30%,-30%)" }} />

        <div className="relative p-5 sm:p-7">
          {/* Greeting row */}
          <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
            <div>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">{greeting}</p>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
                {firstName ? `${firstName} 👋` : "Welcome back 👋"}
              </h1>
              {!firstName && (
                <Link href="/settings" className="text-teal-400 text-xs hover:underline mt-1 inline-block">
                  Add your name →
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-500/25">
                  <Flame className="w-4 h-4 text-orange-400" fill="currentColor" />
                  <span className="text-sm font-black text-orange-300 font-mono">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/15 border border-teal-500/25">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-sm font-black text-teal-300 font-mono">{totalXp.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Level progress bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-white/60 text-xs font-medium">{level.icon} {level.name}</span>
              <span className="text-white/40 text-xs font-mono">{progressPct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#2ec4b6,#ff6b3d)" }} />
            </div>
            {nextLevel && (
              <p className="text-white/30 text-[10px] font-mono mt-1">
                {(nextLevel.minXp - totalXp).toLocaleString()} XP to {nextLevel.name}
              </p>
            )}
          </div>

          {/* Active course */}
          {activePath ? (
            <div className="bg-white/[0.07] border border-white/10 rounded-xl p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-xl shrink-0">
                {activePath.icon ?? "📊"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 font-mono mb-0.5">CONTINUE LEARNING</p>
                <p className="font-bold text-white text-sm truncate">{activePath.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${activePct}%` }} />
                  </div>
                  <span className="text-white/40 text-[10px] font-mono">{activePct}%</span>
                </div>
              </div>
              <Link href={`/courses/${activePath.slug}`}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20 shrink-0 w-full sm:w-auto justify-center">
                <Play className="w-4 h-4" fill="white" />
                Continue
              </Link>
            </div>
          ) : (
            <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold text-white text-sm mb-1">Start your data journey</p>
                <p className="text-white/40 text-xs">Enrol in a Career Track and earn your first XP today.</p>
              </div>
              <Link href="/learn/tracks/career"
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all w-full sm:w-auto justify-center">
                Browse Tracks <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── STATS GRID ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Career Readiness", value: `${readinessScore}%`, sub: readinessScore < 40 ? "Just starting" : readinessScore < 70 ? "Building momentum" : "Job-ready", icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50", href: "/profile" },
          { label: "Level",            value: level.name,            sub: nextLevel ? `${(nextLevel.minXp - totalXp).toLocaleString()} XP left` : "Max level!", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", href: "/profile" },
          { label: "Day Streak",       value: `${streak}`,           sub: streak > 0 ? "Keep it going!" : "Start today",  icon: Flame, color: "text-orange-600", bg: "bg-orange-50", href: "/dashboard" },
          { label: "Courses",          value: `${enrollments.length}`,sub: enrollments.length > 0 ? "Enrolled" : "None yet", icon: Layers, color: "text-purple-600", bg: "bg-purple-50", href: "/learn/library" },
        ].map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white border border-[#E5E9F0] rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition-all group">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <div className={cn("font-display font-black text-xl sm:text-2xl mb-0.5 leading-none", s.color)}>{s.value}</div>
            <div className="text-xs font-semibold text-neutral-500">{s.label}</div>
            <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display font-bold text-base text-navy-800 mb-3">Jump back in</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.href} href={a.href}
              className={cn("bg-white border-2 rounded-2xl p-4 hover:shadow-md transition-all group flex flex-col gap-3", a.border)}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", a.bg)}>
                <a.icon className={cn("w-5 h-5", a.text)} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-navy-800 group-hover:text-teal-700 transition-colors">{a.label}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{a.sub}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── ENROLLED PATHS ─────────────────────────────────────────────────── */}
      {enrollments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-navy-800">My Learning Paths</h2>
            <Link href="/learn/library" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden divide-y divide-[#F8F9FA]">
            {enrollments.map((e: any) => {
              const path = e.courses
              const pct  = Math.round(e.progress_percent ?? 0)
              if (!path) return null
              return (
                <div key={e.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-[#FAFBFC] transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-navy-800 flex items-center justify-center text-lg shrink-0">
                    {path.icon ?? "📊"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-navy-800 truncate group-hover:text-teal-700 transition-colors">
                      {path.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#2ec4b6,#178d82)" }} />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">{pct}%</span>
                    </div>
                  </div>
                  <Link href={`/paths/${path.slug}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-500 hover:bg-teal-400 px-3 sm:px-4 py-2 rounded-lg transition-all shrink-0">
                    Continue
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── BADGES ─────────────────────────────────────────────────────────── */}
      {badges.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base text-navy-800">Recent Badges</h2>
            <Link href="/profile" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1">
              All badges <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 flex-wrap">
            {badges.slice(0, 8).map((ub: any) => (
              <div key={ub.id} title={ub.badges?.description}
                className="flex flex-col items-center gap-1.5 group cursor-default">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#E5E9F0] flex items-center justify-center text-xl sm:text-2xl group-hover:border-teal-300 group-hover:scale-105 transition-all shadow-sm">
                  {ub.badges?.icon ?? "🏅"}
                </div>
                <span className="text-[9px] font-semibold text-neutral-400 text-center max-w-[48px] leading-tight">
                  {ub.badges?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WREN AI PROMO ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-navy-800 to-[#0d2540] rounded-2xl p-5 sm:p-6">
        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white text-base mb-1">Ask Wren anything</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Your AI tutor powered by Claude — explains with real African business examples. Available 24/7.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <Link href="/ai-tutor"
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 sm:flex-none justify-center">
              <Bot className="w-4 h-4" /> Open Wren
            </Link>
            <Link href="/courses"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-1 sm:flex-none justify-center">
              Browse Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
