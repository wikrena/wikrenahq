"use client"

import Link from "next/link"
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  Users, BookOpen, Zap, TrendingUp,
  GraduationCap, ArrowRight, Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  adminName:    string
  adminEmail:   string
  stats: {
    totalUsers:        number
    activeEnrollments: number
    totalXp:           number
    weeklyNewUsers:    number
    weeklyEnrollments: number
  }
  recentUsers:       any[]
  topCourses:        any[]
  instructors:       any[]
  registrationChart: { day: string; count: number }[]
  passRate: number
}

const ROLE_STYLES: Record<string, string> = {
  STUDENT:    "bg-teal-50 text-teal-700 border-teal-200",
  INSTRUCTOR: "bg-purple-50 text-purple-700 border-purple-200",
  ADMIN:      "bg-red-50 text-red-700 border-red-200",
}

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 2)   return "Just now"
  if (mins < 60)  return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days  = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

export function AdminDashboard({
  adminName, adminEmail, stats,
  recentUsers, topCourses, instructors,
  registrationChart, passRate
}: Props) {
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const firstName = adminName?.split(" ")[0] ?? "Admin"

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ── WELCOME HERO ── */}
      <div className="bg-[#0a192f] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #ff6b3d, transparent)", transform: "translate(-50%,50%)" }} />

        <div className="relative flex items-start justify-between flex-wrap gap-5">
          <div>
            <p className="text-teal-400 text-xs font-mono uppercase tracking-widest mb-1">{greeting}</p>
            <h1 className="font-display font-black text-white text-2xl mb-1">{firstName} 👋</h1>
            <p className="text-white/40 text-sm">Here is your platform overview</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "Users",       value: stats.totalUsers.toLocaleString() },
              { label: "Courses",     value: topCourses.length },
              { label: "Enrollments", value: stats.activeEnrollments },
            ].map(s => (
              <div key={s.label} className="text-center bg-white/[0.07] border border-white/10 rounded-xl px-5 py-3">
                <div className="font-black text-white text-2xl leading-none">{s.value}</div>
                <div className="text-white/30 text-[10px] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon:  Users,
            color: "text-teal-600",
            bg:    "bg-teal-50",
            trend: `+${stats.weeklyNewUsers} this week`,
            trendColor: "text-teal-600",
          },
          {
            label: "Active Enrollments",
            value: stats.activeEnrollments.toLocaleString(),
            icon:  BookOpen,
            color: "text-blue-600",
            bg:    "bg-blue-50",
            trend: `+${stats.weeklyEnrollments} this week`,
            trendColor: "text-blue-600",
          },
          {
            label: "Total XP Earned",
            value: stats.totalXp.toLocaleString(),
            icon:  Zap,
            color: "text-amber-600",
            bg:    "bg-amber-50",
            trend: "Platform-wide",
            trendColor: "text-amber-600",
          },
        ].map(s => (
          <div key={s.label} className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <div className="font-display font-black text-2xl text-navy-800 mb-0.5">{s.value}</div>
            <div className="text-xs text-neutral-400 mb-1">{s.label}</div>
            <div className={cn("text-[10px] font-semibold flex items-center gap-1", s.trendColor)}>
              <TrendingUp className="w-3 h-3" /> {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── MIDDLE ROW — Chart + Pass Rate ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Registration Chart */}
        <div className="lg:col-span-1 bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-800 text-sm">Registrations — 7 days</h3>
            <Link href="/admin/analytics" className="text-xs text-teal-600 font-semibold hover:underline">
              Full analytics →
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={registrationChart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0a192f", border: "none", borderRadius: 8, fontSize: 11, color: "#fff" }}
                formatter={(v: any) => [`${v} users`, ""]}
                cursor={{ fill: "rgba(46,196,182,0.08)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {registrationChart.map((d, i) => (
                  <Cell key={i}
                    fill={i === registrationChart.length - 1 ? "#2ec4b6" : "rgba(46,196,182,0.35)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-neutral-400">
              {registrationChart.reduce((s, d) => s + d.count, 0)} new users this week
            </span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-bold text-navy-800 text-sm mb-4 self-start">Average pass rate</h3>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#2ec4b6" strokeWidth="12"
              strokeDasharray={`${passRate * 2.51} ${251 - passRate * 2.51}`}
              strokeDashoffset="63" strokeLinecap="round" />
            <text x="50" y="47" textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: "#0a192f" }}>
              {passRate}%
            </text>
            <text x="50" y="62" textAnchor="middle" style={{ fontSize: 10, fill: "#94a3b8" }}>
              pass rate
            </text>
          </svg>
          <div className="flex gap-4 mt-3">
            {[
              { label: "Python", color: "#2ec4b6" },
              { label: "SQL",    color: "#3b82f6" },
              { label: "Other",  color: "#e2e8f0" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW — Courses + Instructors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Popular Courses */}
        <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-800 text-sm">Popular courses</h3>
            <Link href="/admin/content" className="text-xs text-teal-600 font-semibold hover:underline">
              All courses →
            </Link>
          </div>
          {topCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
              <p className="text-xs text-neutral-400 mb-3">No courses published yet</p>
              <Link href="/admin/content" className="text-xs font-semibold text-teal-600 hover:underline">
                + Create your first course
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {topCourses.slice(0, 5).map((course: any) => (
                <Link
                  key={course.id}
                  href={`/admin/content/${course.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {course.title?.[0] ?? "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy-800 truncate">{course.title}</div>
                    <div className="text-[10px] text-neutral-400">
                      {course.chapters?.length ?? 0} chapters
                    </div>
                  </div>
                  <div className="text-xs font-bold text-teal-600 shrink-0">
                    {course.enrollment_count ?? 0} enrolled
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Instructors */}
        <div className="bg-white border border-neutral-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-800 text-sm">Instructors</h3>
            <Link href="/admin/instructors" className="text-xs text-teal-600 font-semibold hover:underline">
              Manage →
            </Link>
          </div>
          <div className="space-y-1">
            {instructors.slice(0, 4).map((inst: any, i: number) => {
              const initials = inst.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() ?? "??"
              const colors   = ["from-teal-400 to-teal-600", "from-purple-400 to-purple-600", "from-rose-400 to-rose-600", "from-blue-400 to-blue-600"]
              return (
                <div key={inst.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0", colors[i % 4])}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy-800 truncate">{inst.name ?? inst.email}</div>
                    <div className="text-[10px] text-neutral-400">{inst.role}</div>
                  </div>
                  <div className="text-[10px] text-neutral-400 shrink-0">
                    {inst.course_count ?? 0} courses
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => {}}
              className="w-full flex items-center gap-3 p-2 rounded-xl border border-dashed border-neutral-200 hover:border-teal-400 hover:bg-teal-50/50 transition-colors group mt-2"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-50 group-hover:bg-teal-50 border border-neutral-200 group-hover:border-teal-300 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-teal-500" />
              </div>
              <span className="text-xs font-semibold text-neutral-400 group-hover:text-teal-600 transition-colors">
                Invite new instructor
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RECENT USERS TABLE ── */}
      <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h3 className="font-bold text-navy-800 text-sm">Recent registrations</h3>
          <Link href="/admin/users" className="text-xs text-teal-600 font-semibold hover:underline">
            View all users →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {["Name", "Email", "Role", "Joined", "XP"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-neutral-400">
                    No users yet
                  </td>
                </tr>
              ) : (
                recentUsers.slice(0, 8).map((user: any) => (
                  <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-sm font-semibold text-navy-800 truncate max-w-[120px]">
                          {user.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-500 truncate max-w-[180px]">
                      {user.email}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-lg border",
                        ROLE_STYLES[user.role] ?? "bg-neutral-50 text-neutral-600 border-neutral-200"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-400">
                      {timeAgo(user.created_at)}
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-amber-600">
                      {(user.total_xp ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
