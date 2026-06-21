"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ChevronLeft, ChevronRight, Shield, Ban, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const ROLES = ["All", "STUDENT", "INSTRUCTOR", "ADMIN"]

const ROLE_STYLES: Record<string, string> = {
  STUDENT:    "bg-teal-50 text-teal-700 border-teal-200",
  INSTRUCTOR: "bg-purple-50 text-purple-700 border-purple-200",
  ADMIN:      "bg-red-50 text-red-700 border-red-200",
}

interface Props {
  users:       any[]
  total:       number
  page:        number
  limit:       number
  currentRole?: string
  search?:     string
}

export function AdminUsers({ users, total, page, limit, currentRole, search }: Props) {
  const router  = useRouter()
  const [query, setQuery]         = useState(search ?? "")
  const [updating, setUpdating]   = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  function applyFilter(role?: string, q?: string) {
    const params = new URLSearchParams()
    if (role && role !== "All") params.set("role", role)
    if (q?.trim()) params.set("search", q.trim())
    params.set("page", "1")
    router.push(`/admin/users?${params.toString()}`)
  }

  async function changeRole(userId: string, newRole: string) {
    setUpdating(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: userId, role: newRole }),
      })
      if (res.ok) router.refresh()
    } finally {
      setUpdating(null)
    }
  }

  async function toggleActive(userId: string, isActive: boolean) {
    setUpdating(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: userId, is_active: !isActive }),
      })
      if (res.ok) router.refresh()
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-0.5">Users</h1>
        <p className="text-neutral-500 text-sm">{total.toLocaleString()} total registered users</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs h-9 bg-neutral-50 border border-neutral-200 rounded-lg px-3">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilter(currentRole, query)}
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent text-xs text-navy-800 placeholder:text-neutral-400 outline-none"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => applyFilter(r === "All" ? undefined : r, query)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                (r === "All" && !currentRole) || currentRole === r
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["User", "Role", "XP", "Streak", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-neutral-400">
                    No users found
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} className={cn(
                  "border-b border-neutral-50 hover:bg-neutral-50 transition-colors",
                  !u.is_active && "opacity-50"
                )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-navy-800 truncate max-w-[140px]">
                          {u.name ?? "—"}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={e => changeRole(u.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none",
                        ROLE_STYLES[u.role] ?? "bg-neutral-50 text-neutral-600 border-neutral-200"
                      )}
                    >
                      {["STUDENT","INSTRUCTOR","ADMIN"].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-600">
                    {(u.total_xp ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600">
                    {u.current_streak > 0 ? `🔥 ${u.current_streak}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-lg",
                      u.is_active ? "bg-teal-50 text-teal-700" : "bg-neutral-100 text-neutral-500"
                    )}>
                      {u.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={updating === u.id}
                      onClick={() => toggleActive(u.id, u.is_active)}
                      className={cn(
                        "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all",
                        u.is_active
                          ? "text-red-500 border-red-200 hover:bg-red-50"
                          : "text-teal-600 border-teal-200 hover:bg-teal-50"
                      )}
                    >
                      {updating === u.id ? "..." : u.is_active ? "Suspend" : "Restore"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-400">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => router.push(`/admin/users?page=${page - 1}${currentRole ? `&role=${currentRole}` : ""}`)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => router.push(`/admin/users?page=${page + 1}${currentRole ? `&role=${currentRole}` : ""}`)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
