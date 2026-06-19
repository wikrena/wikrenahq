"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Flame, Zap, Trophy, BookOpen, Target,
  TrendingUp, Calendar, Award, ChevronRight, Star
} from "lucide-react"
import { getLevelFromXp, getNextLevel, getLevelProgress, cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface Props {
  profile:     any
  totalXp:     number
  xpHistory:   { amount: number; created_at: string; reason: string }[]
  enrollments: any[]
  completions: { id: string; completed_at: string; xp_earned: number }[]
  badges:      any[]
}

const RARITY_CONFIG: Record<string, { border: string; bg: string; label: string }> = {
  COMMON:    { border: "border-neutral-200",  bg: "bg-neutral-50",  label: "Common" },
  RARE:      { border: "border-blue-300",     bg: "bg-blue-50",     label: "Rare" },
  EPIC:      { border: "border-purple-400",   bg: "bg-purple-50",   label: "Epic" },
  LEGENDARY: { border: "border-amber-400",    bg: "bg-amber-50",    label: "Legendary" },
}

export function ProgressPage({ profile, totalXp, xpHistory, enrollments, completions, badges }: Props) {
  const [activeTab, setActiveTab] = useState<"overview"|"xp"|"badges">("overview")

  const level       = getLevelFromXp(totalXp)
  const nextLevel   = getNextLevel(totalXp)
  const progressPct = getLevelProgress(totalXp)
  const streak      = profile?.current_streak ?? 0

  // Build last 14 days activity
  const activityData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    const dateStr = date.toISOString().split("T")[0]
    const dayCompletions = completions.filter(c =>
      c.completed_at?.startsWith(dateStr)
    )
    const xpEarned = dayCompletions.reduce((s, c) => s + (c.xp_earned ?? 0), 0)
    return {
      day:     date.toLocaleDateString("en-NG", { weekday: "short" }),
      date:    dateStr,
      lessons: dayCompletions.length,
      xp:      xpEarned,
      isToday: i === 13,
    }
  })

  const thisWeekXp     = xpHistory
    .filter(x => new Date(x.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((s, x) => s + x.amount, 0)

  const totalLessons   = completions.length
  const activeDays     = activityData.filter(d => d.lessons > 0).length

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "xp",       label: "XP History" },
    { id: "badges",   label: `Badges (${badges.length})` },
  ] as const

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">My Progress</h1>
        <p className="text-neutral-500 text-sm">Everything you have learned and earned on Wikrena Academy.</p>
      </div>

      {/* Level card */}
      <div className="bg-navy-800 rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(25%,-25%)" }} />
        <div className="relative flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">Current Level</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{level.icon}</span>
              <span className="font-display font-black text-2xl text-white">{level.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 px-3 py-2 rounded-xl text-sm font-bold">
              <Flame className="w-4 h-4" fill="currentColor" /> {streak} day streak
            </div>
            <div className="flex items-center gap-1.5 bg-teal-500/20 border border-teal-500/30 text-teal-300 px-3 py-2 rounded-xl text-sm font-bold">
              <Zap className="w-4 h-4" /> {totalXp.toLocaleString()} XP
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-white/50">Progress to {nextLevel?.name ?? "Max"}</span>
            <span className="text-teal-400 font-bold">{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #2ec4b6, #178d82)" }} />
          </div>
          {nextLevel && (
            <p className="text-white/30 text-[10px] font-mono mt-1.5">
              {(nextLevel.minXp - totalXp).toLocaleString()} XP to {nextLevel.name}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Lessons Done",   value: totalLessons,            icon: BookOpen,  color: "text-teal-600",   bg: "bg-teal-50" },
          { label: "This Week XP",   value: `+${thisWeekXp}`,        icon: TrendingUp,color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Days",    value: `${activeDays}/14`,      icon: Calendar,  color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Badges Earned",  value: badges.length,           icon: Trophy,    color: "text-coral-600",  bg: "bg-orange-50" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5E9F0] rounded-2xl p-4">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-2", s.bg)}>
              <s.icon className={cn("w-4.5 h-4.5", s.color)} />
            </div>
            <div className={cn("font-display font-black text-2xl", s.color)}>{s.value}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F0F4F8] rounded-xl mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === t.id ? "bg-white text-navy-800 shadow-sm" : "text-neutral-500 hover:text-navy-700"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="space-y-5">

          {/* 14-day activity chart */}
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
            <h3 className="font-semibold text-navy-800 text-sm mb-4">14-Day Activity</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0a192f", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }}
                    formatter={(v: any, name: string) => [
                      name === "xp" ? `+${v} XP` : `${v} lessons`, ""
                    ]}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Bar dataKey="xp" radius={[4, 4, 0, 0]} maxBarSize={24}>
                    {activityData.map((d, i) => (
                      <Cell key={i} fill={d.xp > 0 ? (d.isToday ? "#2ec4b6" : "#5eead4") : "#f1f5f9"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrolled paths */}
          {enrollments.length > 0 && (
            <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0F4F8]">
                <h3 className="font-semibold text-navy-800 text-sm">Enrolled Paths</h3>
              </div>
              {enrollments.map((e: any) => {
                const path = e.learning_paths
                if (!path) return null
                const pct = Math.round(e.progress_percent ?? 0)
                return (
                  <div key={e.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F8F9FA] last:border-0 hover:bg-[#FAFBFC] transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-xl shrink-0">
                      {path.icon ?? "📊"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-navy-800 truncate">{path.title}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-28 h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#2ec4b6,#178d82)" }} />
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono">{pct}%</span>
                      </div>
                    </div>
                    <Link href={`/paths/${path.slug}`}
                      className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

          {enrollments.length === 0 && (
            <div className="bg-white border-2 border-dashed border-[#E5E9F0] rounded-2xl p-10 text-center">
              <Target className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm mb-4">You have not enrolled in a Career Track yet.</p>
              <Link href="/learn/tracks/career"
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                Browse Career Tracks →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* XP History tab */}
      {activeTab === "xp" && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
          {xpHistory.length === 0 ? (
            <div className="p-10 text-center text-neutral-400 text-sm">No XP earned yet. Complete a lesson to get started.</div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-[#F0F4F8] bg-[#F8F9FA] flex items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex-1">Activity</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">XP</span>
              </div>
              {xpHistory.slice(0, 20).map((x, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F8F9FA] last:border-0 hover:bg-[#FAFBFC] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy-800 capitalize">
                      {x.reason?.replace(/_/g, " ") ?? "Activity"}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {new Date(x.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span className="font-bold text-sm text-teal-600 font-mono shrink-0">+{x.amount}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Badges tab */}
      {activeTab === "badges" && (
        badges.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E5E9F0] rounded-2xl p-10 text-center">
            <Trophy className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm mb-4">Complete lessons and challenges to earn your first badge.</p>
            <Link href="/challenges"
              className="inline-flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
              Go to Challenges →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {badges.map((ub: any) => {
              const rarity = ub.badges?.rarity ?? "COMMON"
              const config = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.COMMON
              return (
                <div key={ub.id}
                  title={`${ub.badges?.name}: ${ub.badges?.description}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 cursor-default transition-all hover:scale-105",
                    config.border, config.bg
                  )}>
                  <span className="text-2xl">{ub.badges?.icon ?? "🏅"}</span>
                  <span className="text-[9px] font-semibold text-center leading-tight text-neutral-500 max-w-full">
                    {ub.badges?.name}
                  </span>
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded-full",
                    rarity === "LEGENDARY" ? "bg-amber-200 text-amber-800" :
                    rarity === "EPIC"      ? "bg-purple-200 text-purple-800" :
                    rarity === "RARE"      ? "bg-blue-200 text-blue-800" :
                    "bg-neutral-200 text-neutral-600"
                  )}>
                    {config.label}
                  </span>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
