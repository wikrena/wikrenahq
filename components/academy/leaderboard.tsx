"use client"

import { useState } from "react"
import { Trophy, Flame, Zap, Crown, Medal, Award, TrendingUp, ChevronRight } from "lucide-react"
import { cn, getLevelFromXp, getInitials } from "@/lib/utils"
import Link from "next/link"

interface Props { entries: any[]; currentUserId: string }

const MOCK = [
  { id:"1", profiles:{ id:"1", name:"Chidi Kalu",      avatar:null, total_xp:2840 }, xp:380 },
  { id:"2", profiles:{ id:"2", name:"Ngozi Ibrahim",   avatar:null, total_xp:2290 }, xp:290 },
  { id:"3", profiles:{ id:"3", name:"Adaeze Okonkwo",  avatar:null, total_xp:1840 }, xp:245 },
  { id:"4", profiles:{ id:"4", name:"Emeka Obi",       avatar:null, total_xp:1620 }, xp:210 },
  { id:"5", profiles:{ id:"5", name:"Fatima Aliyu",    avatar:null, total_xp:1380 }, xp:185 },
  { id:"6", profiles:{ id:"6", name:"Kelechi Nwozuzu", avatar:null, total_xp:1240 }, xp:160 },
  { id:"7", profiles:{ id:"7", name:"Bola Adesanya",   avatar:null, total_xp:1100 }, xp:140 },
  { id:"8", profiles:{ id:"8", name:"Yemi Fashola",    avatar:null, total_xp: 980 }, xp:125 },
  { id:"9", profiles:{ id:"9", name:"Seun Okafor",     avatar:null, total_xp: 870 }, xp:110 },
  { id:"10",profiles:{ id:"10",name:"Amara Eze",       avatar:null, total_xp: 760 }, xp: 95 },
]

const AVATAR_COLORS = [
  "bg-teal-500","bg-coral-500","bg-purple-500","bg-amber-500",
  "bg-blue-500","bg-pink-500","bg-indigo-500","bg-green-500",
  "bg-red-500","bg-cyan-500",
]

const PERIODS = [
  { id: "weekly",   label: "This Week" },
  { id: "monthly",  label: "This Month" },
  { id: "all_time", label: "All Time" },
]

const PODIUM_CONFIG = [
  { rank: 2, height: "h-24", bgFrom: "from-neutral-400", bgTo: "to-neutral-500", medal: "🥈", labelColor: "text-neutral-300" },
  { rank: 1, height: "h-32", bgFrom: "from-amber-400",   bgTo: "to-yellow-500",  medal: "🥇", labelColor: "text-amber-300" },
  { rank: 3, height: "h-20", bgFrom: "from-amber-600",   bgTo: "to-amber-700",   medal: "🥉", labelColor: "text-amber-500" },
]

export function LeaderboardPage({ entries, currentUserId }: Props) {
  const [period, setPeriod] = useState("weekly")
  const data = entries.length > 0 ? entries : MOCK
  const top3 = [data[1], data[0], data[2]]
  const rest = data.slice(3)

  const myRank = data.findIndex(e => e.profiles?.id === currentUserId) + 1

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-7 h-7 text-amber-500" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800">Leaderboard</h1>
        </div>
        <p className="text-neutral-500 text-sm">
          Top learners this week. Earn XP to climb the ranks and win bonus badges.
        </p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 p-1 bg-[#F0F4F8] rounded-xl mb-8">
        {PERIODS.map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
              period === p.id
                ? "bg-white text-navy-800 shadow-sm"
                : "text-neutral-500 hover:text-navy-700"
            )}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Your rank callout */}
      {myRank > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-teal-800 text-sm">You're ranked #{myRank} this week</span>
            {myRank > 3 && (
              <p className="text-teal-600 text-xs mt-0.5">
                Earn {data[myRank - 2]?.xp - (data[myRank - 1]?.xp ?? 0) + 1} more XP to climb one place.
              </p>
            )}
          </div>
          <Link href="/challenges" className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1">
            Earn XP <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Podium */}
      <div className="bg-gradient-to-b from-navy-800 to-[#0d2540] rounded-2xl p-6 mb-5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(20%,-20%)" }} />

        <p className="text-center text-white/30 text-[10px] font-mono uppercase tracking-widest mb-6">Top 3 This Week</p>

        <div className="flex items-end justify-center gap-2 sm:gap-4">
          {PODIUM_CONFIG.map((config, i) => {
            const entry   = data[config.rank - 1]
            if (!entry) return <div key={i} className="w-24" />
            const profile = entry.profiles
            const name    = profile?.name ?? "Unknown"
            const xp      = entry.xp ?? profile?.total_xp ?? 0
            const level   = getLevelFromXp(profile?.total_xp ?? 0)
            const avatarBg = AVATAR_COLORS[(config.rank - 1) % AVATAR_COLORS.length]
            const isMe    = profile?.id === currentUserId

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Medal */}
                <span className="text-2xl">{config.medal}</span>

                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg border-2 overflow-hidden",
                  isMe ? "border-teal-400" : "border-transparent",
                  avatarBg
                )}>
                  {profile?.avatar
                    ? <img src={profile.avatar} alt={name} className="w-full h-full object-cover" />
                    : getInitials(name)
                  }
                </div>

                {/* Name */}
                <div className="text-center">
                  <div className={cn("text-xs font-bold text-white truncate max-w-[80px]", isMe && "text-teal-300")}>
                    {name.split(" ")[0]}
                    {isMe && " (you)"}
                  </div>
                  <div className="text-[10px] text-white/40">{level.icon} {level.name}</div>
                </div>

                {/* Podium block */}
                <div className={cn(
                  "w-14 sm:w-20 rounded-t-xl flex items-center justify-center bg-gradient-to-b",
                  config.height, config.bgFrom, config.bgTo
                )}>
                  <div className="text-center">
                    <div className={cn("font-black text-sm", config.labelColor)}>#{config.rank}</div>
                    <div className="text-[10px] text-white/60 font-mono">+{xp}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full rankings */}
      <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#F0F4F8] bg-[#F8F9FA] flex items-center">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-8">#</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex-1">Student</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">XP This Period</span>
        </div>

        {rest.map((entry: any, i: number) => {
          const rank    = i + 4
          const profile = entry.profiles
          const name    = profile?.name ?? "Unknown"
          const xp      = entry.xp ?? profile?.total_xp ?? 0
          const level   = getLevelFromXp(profile?.total_xp ?? 0)
          const avatarBg = AVATAR_COLORS[rank % AVATAR_COLORS.length]
          const isMe    = profile?.id === currentUserId

          return (
            <div key={entry.id}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 border-b border-[#F8F9FA] last:border-0 transition-colors",
                isMe ? "bg-teal-50 border-l-4 border-l-teal-500" : "hover:bg-[#FAFBFC]"
              )}>
              <span className={cn(
                "w-8 text-sm font-bold font-mono shrink-0",
                rank <= 5 ? "text-teal-600" : "text-neutral-400"
              )}>
                {rank}
              </span>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden", avatarBg)}>
                {profile?.avatar
                  ? <img src={profile.avatar} alt={name} className="w-full h-full object-cover" />
                  : getInitials(name)
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn("font-semibold text-sm truncate", isMe ? "text-teal-700" : "text-navy-800")}>
                  {name}{isMe ? " (you)" : ""}
                </div>
                <div className="text-[11px] text-neutral-400">{level.icon} {level.name}</div>
              </div>
              <div className="flex items-center gap-1 font-bold text-sm text-amber-500 shrink-0 font-mono">
                <Zap className="w-3.5 h-3.5" />
                +{xp.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      {/* How to climb */}
      <div className="mt-5 bg-white border border-[#E5E9F0] rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-navy-800 mb-3">How to earn XP</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "📚", label: "Lesson", xp: "+10" },
            { icon: "🎯", label: "Quiz pass", xp: "+25" },
            { icon: "💬", label: "Forum post", xp: "+5" },
            { icon: "🏆", label: "Challenge", xp: "+50" },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-[#F8F9FA] rounded-xl">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs text-neutral-500 font-medium">{item.label}</div>
              <div className="text-sm font-black text-teal-600 font-mono">{item.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
