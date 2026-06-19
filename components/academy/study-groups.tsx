"use client"

import { useState } from "react"
import { Users, Plus, Search, Lock, Globe, Calendar, MessageCircle, ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const STUDY_GROUPS = [
  {
    id: "1", name: "SQL Warriors Nigeria", emoji: "🗄️",
    description: "Daily SQL challenges and query optimization tips using Nigerian business datasets. We review each other's queries every weekend.",
    members: 24, maxMembers: 30, track: "Data Analytics", level: "Beginner",
    isPrivate: false, meetingDay: "Saturdays", xpBonus: 50,
    tags: ["SQL", "Beginner-friendly", "Active"],
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "2", name: "Python Data Crew", emoji: "🐍",
    description: "We build Python projects with real African data every two weeks. Current project: MTN subscriber churn analysis with pandas and scikit-learn.",
    members: 18, maxMembers: 25, track: "Data Science", level: "Intermediate",
    isPrivate: false, meetingDay: "Wednesdays", xpBonus: 75,
    tags: ["Python", "Projects", "Data Science"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "3", name: "Lagos Data Analysts", emoji: "📊",
    description: "For data analysts in Lagos and remote Nigerians. We share job postings, portfolio reviews, and industry insights from the Lagos data scene.",
    members: 31, maxMembers: 50, track: "Career", level: "All Levels",
    isPrivate: false, meetingDay: "Monthly", xpBonus: 25,
    tags: ["Career", "Networking", "Lagos"],
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "4", name: "ML Engineers Africa", emoji: "🤖",
    description: "Advanced machine learning study group. We implement papers, share Kaggle strategies, and work on African AI use cases together.",
    members: 12, maxMembers: 20, track: "Machine Learning", level: "Advanced",
    isPrivate: true, meetingDay: "Fridays", xpBonus: 100,
    tags: ["ML", "Advanced", "AI"],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "5", name: "Power BI Builders", emoji: "📈",
    description: "Build beautiful Power BI dashboards together. Weekly dashboard challenge: someone shares a dataset, everyone builds a report, we vote on the best.",
    members: 22, maxMembers: 30, track: "Data Analytics", level: "Beginner",
    isPrivate: false, meetingDay: "Thursdays", xpBonus: 50,
    tags: ["Power BI", "Visualisation", "Challenges"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "6", name: "Data Engineering Guild", emoji: "⚙️",
    description: "dbt, Airflow, pipelines, and data infrastructure. We build real ETL systems using African fintech datasets.",
    members: 9, maxMembers: 20, track: "Data Engineering", level: "Intermediate",
    isPrivate: false, meetingDay: "Tuesdays", xpBonus: 75,
    tags: ["dbt", "Airflow", "Engineering"],
    color: "from-slate-500 to-slate-600",
  },
]

interface Props { userId: string }

export function StudyGroupsPage({ userId }: Props) {
  const [search,   setSearch]   = useState("")
  const [filter,   setFilter]   = useState("all")
  const [joining,  setJoining]  = useState<string | null>(null)
  const [joined,   setJoined]   = useState<Set<string>>(new Set())

  const filters = ["all", "beginner", "intermediate", "advanced", "open"]

  const displayed = STUDY_GROUPS.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()) ||
      g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchFilter =
      filter === "all"          ? true :
      filter === "open"         ? !g.isPrivate :
      filter === g.level.toLowerCase() ? true :
      g.level.toLowerCase().includes(filter)
    return matchSearch && matchFilter
  })

  async function joinGroup(groupId: string) {
    setJoining(groupId)
    await new Promise(r => setTimeout(r, 800)) // simulate API
    setJoined(prev => new Set([...prev, groupId]))
    setJoining(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-navy-800 mb-1">Study Groups</h1>
          <p className="text-neutral-500 text-sm">
            Learn alongside peers on the same track. Groups earn bonus XP together.
          </p>
        </div>
        <button className="flex items-center gap-2 border-2 border-dashed border-teal-300 hover:border-teal-500 text-teal-600 hover:text-teal-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-navy-800 to-[#0d2540] rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "👥", title: "Join a group",       desc: "Find people on your track and level" },
            { icon: "📅", title: "Meet regularly",     desc: "Weekly or fortnightly group sessions" },
            { icon: "⚡", title: "Earn bonus XP",      desc: "Groups earn 25-100 extra XP per session" },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search groups, topics, or tags..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E9F0] rounded-xl text-sm outline-none focus:border-teal-500 bg-white transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all border",
                filter === f ? "bg-navy-800 text-white border-navy-800" : "bg-white text-neutral-500 border-[#E5E9F0] hover:border-neutral-300"
              )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map(group => {
          const isFull   = group.members >= group.maxMembers
          const isJoined = joined.has(group.id)
          const isJoining = joining === group.id

          return (
            <div key={group.id} className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden hover:shadow-sm transition-all">

              {/* Card header */}
              <div className={cn("bg-gradient-to-r p-4", group.color)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{group.emoji}</span>
                    <div>
                      <div className="font-display font-bold text-white text-base leading-tight">{group.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/70 text-[10px] font-semibold">{group.track}</span>
                        <span className="text-white/40 text-[10px]">·</span>
                        <span className="text-white/70 text-[10px]">{group.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {group.isPrivate
                      ? <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full"><Lock className="w-2.5 h-2.5" /> Private</span>
                      : <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full"><Globe className="w-2.5 h-2.5" /> Open</span>
                    }
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{group.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {group.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold bg-[#F0F4F8] text-neutral-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {group.members}/{group.maxMembers} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {group.meetingDay}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    +{group.xpBonus} XP/session
                  </span>
                </div>

                {/* Members bar */}
                <div className="h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${(group.members / group.maxMembers) * 100}%` }} />
                </div>

                {/* Join button */}
                <button
                  onClick={() => !isJoined && !isFull && joinGroup(group.id)}
                  disabled={isFull || isJoining}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold transition-all",
                    isJoined
                      ? "bg-teal-50 border border-teal-200 text-teal-700"
                      : isFull
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : group.isPrivate
                      ? "bg-navy-50 border border-navy-200 text-navy-700 hover:bg-navy-100"
                      : "bg-teal-500 hover:bg-teal-400 text-white"
                  )}>
                  {isJoining ? "Joining..." :
                   isJoined  ? "✓ Joined" :
                   isFull    ? "Group Full" :
                   group.isPrivate ? "Request to Join" :
                   "Join Group"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {displayed.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">No groups match your search.</p>
        </div>
      )}
    </div>
  )
}
