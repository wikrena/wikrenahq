"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap, Flame, Trophy, BookOpen, Github,
  Linkedin, Twitter, Edit2, Share2, Check,
  ChevronRight, MapPin, Calendar, Award,
  BarChart2, Target, Code2, Star
} from "lucide-react"
import { getLevelFromXp, getNextLevel, getLevelProgress, getInitials, cn } from "@/lib/utils"

interface Props {
  profile:     any
  badges:      any[]
  totalXp:     number
  enrollments: any[]
  userEmail:   string
}

const RARITY_CONFIG: Record<string, { border: string; bg: string; label: string; labelColor: string }> = {
  COMMON:    { border: "border-neutral-200",  bg: "bg-white",        label: "Common",    labelColor: "text-neutral-400"  },
  RARE:      { border: "border-blue-300",     bg: "bg-blue-50",      label: "Rare",      labelColor: "text-blue-500"     },
  EPIC:      { border: "border-purple-400",   bg: "bg-purple-50",    label: "Epic",      labelColor: "text-purple-600"   },
  LEGENDARY: { border: "border-amber-400",    bg: "bg-amber-50",     label: "Legendary", labelColor: "text-amber-600"    },
}

export function ProfilePage({ profile, badges, totalXp, enrollments, userEmail }: Props) {
  const [copied,   setCopied]   = useState(false)
  const [activeTab, setActiveTab] = useState<"overview"|"badges"|"paths">("overview")

  const level       = getLevelFromXp(totalXp)
  const nextLevel   = getNextLevel(totalXp)
  const progressPct = getLevelProgress(totalXp)
  const streak      = profile?.current_streak ?? 0
  const name        = profile?.name ?? userEmail?.split("@")[0] ?? "Learner"
  const firstName   = name.split(" ")[0]
  const joinDate    = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
    : null

  function copyProfileLink() {
    navigator.clipboard.writeText(`${window.location.origin}/profile`).catch(() => null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const STATS = [
    { label: "Total XP",      value: totalXp.toLocaleString(), icon: Zap,      color: "text-teal-500",   bg: "bg-teal-500/10",   border: "border-teal-500/20" },
    { label: "Day Streak",    value: streak,                   icon: Flame,    color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Enrolled",      value: enrollments.length,       icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Badges",        value: badges.length,            icon: Trophy,   color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20"  },
  ]

  const TABS = [
    { id: "overview" as const, label: "Overview",      icon: BarChart2 },
    { id: "paths"    as const, label: "Learning Paths",icon: Target    },
    { id: "badges"   as const, label: `Badges (${badges.length})`, icon: Award },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-5">

        {/* Cover */}
        <div className="h-32 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a192f 0%, #0d2540 50%, #0a192f 100%)" }}>
          <div className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2ec4b6 0%, transparent 55%), radial-gradient(circle at 80% 50%, #ff6b3d 0%, transparent 55%)" }} />
          {/* Share + Edit in cover top-right — always visible on dark */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button onClick={copyProfileLink}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl transition-all backdrop-blur-sm">
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Share2 className="w-3.5 h-3.5" /> Share</>}
            </button>
            <Link href="/settings"
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-500 hover:bg-teal-400 px-3 py-1.5 rounded-xl transition-all">
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* White card */}
        <div className="bg-white border border-[#E5E9F0] border-t-0 rounded-b-3xl px-6 pb-6">

          {/* Avatar — pulled up, sits half in cover half in card */}
          <div className="flex items-end justify-between mb-4" style={{ marginTop: "-40px" }}>
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-black text-3xl border-4 border-white shadow-xl overflow-hidden">
                {profile?.avatar
                  ? <img src={profile.avatar} alt={name} className="w-full h-full object-cover" />
                  : getInitials(name)
                }
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#0a192f] border-2 border-white rounded-lg px-1.5 py-0.5">
                <span className="text-[10px] font-bold text-teal-400 font-mono leading-none">{level.icon}</span>
              </div>
            </div>
            {/* Spacer — keeps layout balanced */}
            <div />
          </div>

          {/* Name + meta — fully on white, always readable */}
          <div className="mb-4">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <h1 className="font-display font-black text-2xl text-navy-800 leading-tight">{name}</h1>
              <span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full shrink-0">
                {level.icon} {level.name}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {profile?.city && (
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3" /> {profile.city}
                  {profile?.country && `, ${profile.country}`}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar className="w-3 h-3" /> Joined {joinDate}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile?.bio ? (
            <p className="text-sm text-neutral-600 leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>
          ) : (
            <Link href="/settings?tab=profile"
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-teal-600 mb-4 transition-colors border border-dashed border-neutral-200 hover:border-teal-300 px-3 py-1.5 rounded-xl">
              + Add a bio to tell people about yourself
            </Link>
          )}

          {/* Social links */}
          {(profile?.github_url || profile?.linkedin_url || profile?.twitter_url) && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-navy-800 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl transition-all">
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-navy-800 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl transition-all">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-navy-800 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl transition-all">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </a>
              )}
            </div>
          )}

          {/* XP progress */}
          <div className="bg-[#F6F8FA] border border-[#E5E9F0] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <span className="font-semibold text-sm text-navy-800">{level.name}</span>
              </div>
              <span className="font-bold text-sm text-teal-600 font-mono">{totalXp.toLocaleString()} XP total</span>
            </div>
            <div className="h-2.5 bg-[#E5E9F0] rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #2ec4b6, #ff6b3d)" }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-neutral-400 font-mono">
                {nextLevel ? `${(nextLevel.minXp - totalXp).toLocaleString()} XP to ${nextLevel.name}` : "Maximum level reached 🏆"}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {STATS.map(s => (
          <div key={s.label}
            className={cn("bg-white border-2 rounded-2xl p-4 text-center transition-all hover:shadow-sm", s.border)}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <div className={cn("font-display font-black text-2xl leading-tight", s.color)}>{s.value}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── TABS ──────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-[#F0F4F8] rounded-xl mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === t.id ? "bg-white text-navy-800 shadow-sm" : "text-neutral-500 hover:text-navy-700"
            )}>
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:block">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Code2,     label: "Go to Practice",   sub: "Challenges and workspace",    href: "/practice",      color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-200" },
              { icon: Trophy,    label: "View All Badges",  sub: "Your achievement collection", href: "#badges",        color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200" },
              { icon: Star,      label: "Career Hub",       sub: "Jobs and portfolio",          href: "/career",        color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
              { icon: BarChart2, label: "Full Progress",    sub: "XP history and activity",     href: "/learn/progress",color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"  },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={cn(
                  "flex items-center gap-3 p-4 bg-white border-2 rounded-2xl hover:shadow-sm transition-all group",
                  item.border
                )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-navy-800">{item.label}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{item.sub}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── LEARNING PATHS TAB ────────────────────────────────────── */}
      {activeTab === "paths" && (
        <div>
          {enrollments.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#E5E9F0] rounded-2xl p-12 text-center">
              <BookOpen className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm mb-4">No learning paths yet.</p>
              <Link href="/learn/tracks/career"
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                Browse Career Tracks →
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
              {enrollments.map((e: any, i: number) => {
                const path = e.learning_paths
                if (!path) return null
                const pct = Math.round(e.progress_percent ?? 0)
                return (
                  <div key={e.id}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 hover:bg-[#FAFBFC] transition-colors group",
                      i > 0 && "border-t border-[#F0F4F8]"
                    )}>
                    <div className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center text-xl shrink-0">
                      {path.icon ?? "📊"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-navy-800 mb-1.5">{path.title}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#2ec4b6,#ff6b3d)" }} />
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono shrink-0">{pct}%</span>
                      </div>
                    </div>
                    <Link href={`/paths/${path.slug}`}
                      className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BADGES TAB ────────────────────────────────────────────── */}
      {activeTab === "badges" && (
        <div>
          {badges.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#E5E9F0] rounded-2xl p-12 text-center">
              <Trophy className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm mb-4">Complete lessons and challenges to earn your first badge.</p>
              <Link href="/challenges"
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                Go to Challenges →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {badges.map((ub: any) => {
                const rarity = ub.badges?.rarity ?? "COMMON"
                const config = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.COMMON
                return (
                  <div key={ub.id}
                    title={`${ub.badges?.name}: ${ub.badges?.description ?? ""}`}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-default transition-all hover:scale-105 hover:shadow-md",
                      config.border, config.bg
                    )}>
                    <span className="text-3xl">{ub.badges?.icon ?? "🏅"}</span>
                    <div className="text-center">
                      <div className="text-[11px] font-semibold text-navy-800 leading-tight mb-1">{ub.badges?.name}</div>
                      <span className={cn("text-[9px] font-bold uppercase tracking-wide", config.labelColor)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
