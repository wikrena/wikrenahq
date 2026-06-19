"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, Zap, Code2 } from "lucide-react"

const MOCK_CHALLENGES = [
  { id:"1", title:"Filter Lagos Sales Records", description:"Write a SQL query to find all sales in Lagos above ₦50,000.", language:"SQL", difficulty:"BEGINNER", xp_reward:50, time_limit:null },
  { id:"2", title:"MTN Churn Prediction", description:"Build a Python function to flag subscribers likely to churn.", language:"PYTHON", difficulty:"INTERMEDIATE", xp_reward:75, time_limit:30 },
  { id:"3", title:"Flutterwave Fraud Detection", description:"Identify fraudulent transactions from payment data using SQL.", language:"SQL", difficulty:"INTERMEDIATE", xp_reward:75, time_limit:20 },
  { id:"4", title:"Calculate Monthly Revenue", description:"Write Python to compute monthly revenue from a list of transactions.", language:"PYTHON", difficulty:"BEGINNER", xp_reward:50, time_limit:null },
  { id:"5", title:"Customer Segmentation Model", description:"Use Python to cluster customers by purchase behaviour.", language:"PYTHON", difficulty:"ADVANCED", xp_reward:100, time_limit:45 },
  { id:"6", title:"Power BI DAX Formula", description:"Write a DAX measure to calculate 3-month rolling average revenue.", language:"SQL", difficulty:"ADVANCED", xp_reward:100, time_limit:null },
]

const DIFF_STYLES: Record<string,string> = {
  BEGINNER:     "bg-teal-50 text-teal-700 border-teal-200",
  INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
  ADVANCED:     "bg-coral-50 text-coral-600 border-coral-200",
}
const LANG_STYLES: Record<string,string> = {
  PYTHON: "bg-blue-50 text-blue-700 border-blue-200",
  SQL:    "bg-purple-50 text-purple-700 border-purple-200",
  R:      "bg-green-50 text-green-700 border-green-200",
}

interface Props { challenges: any[]; passedIds: Set<string>; userId: string }

export function ChallengesPage({ challenges, passedIds, userId }: Props) {
  const [filter, setFilter] = useState("all")
  const display = challenges.length > 0 ? challenges : MOCK_CHALLENGES
  const filtered = display.filter((c: any) => filter === "all" || c.language?.toLowerCase() === filter || c.difficulty?.toLowerCase() === filter)
  const passed   = passedIds.size

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-1">Coding Challenges 💻</h1>
        <p className="text-neutral-500 text-sm">Practice on real African business data. Each challenge earns XP.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:"Completed",  value:passed,             icon:"✅", color:"text-teal-600" },
          { label:"Available",  value:display.length,     icon:"🎯", color:"text-navy-800" },
          { label:"XP from Challenges", value:`${passed * 50}+`, icon:"⚡", color:"text-coral-500" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-4 text-center shadow-card">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={cn("font-display font-black text-2xl mb-0.5", s.color)}>{s.value}</div>
            <div className="text-xs text-neutral-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all","sql","python","beginner","intermediate","advanced"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all",
              filter === f ? "bg-navy-800 text-white border-navy-800" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-navy-800"
            )}>{f}</button>
        ))}
      </div>

      {/* Challenges grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((challenge: any) => {
          const isPassed = passedIds.has(challenge.id)
          return (
            <div key={challenge.id}
              className={cn("bg-white border rounded-2xl p-5 hover:shadow-card-hover transition-all cursor-pointer group", isPassed ? "border-teal-200" : "border-neutral-200")}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2 flex-wrap">
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", DIFF_STYLES[challenge.difficulty ?? "BEGINNER"])}>{challenge.difficulty}</span>
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", LANG_STYLES[challenge.language ?? "PYTHON"])}>{challenge.language}</span>
                </div>
                {isPassed && <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />}
              </div>
              <h3 className="font-display font-bold text-sm text-navy-800 mb-2 group-hover:text-teal-600 transition-colors">{challenge.title}</h3>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{challenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-teal-500" />+{challenge.xp_reward} XP</span>
                  {challenge.time_limit && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{challenge.time_limit}m</span>}
                </div>
                <button className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  isPassed ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-navy-800 text-white hover:bg-navy-700 shadow-brand-sm"
                )}>
                  <Code2 className="w-3 h-3" />
                  {isPassed ? "Solved ✓" : "Start"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
