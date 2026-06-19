"use client"

import { useRouter } from "next/navigation"
import { Building2, MapPin, Calendar, CheckCircle, Ban } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props { schools: any[] }

export function AdminSchools({ schools }: Props) {
  const router = useRouter()

  async function toggleActive(id: string, isActive: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !isActive }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-0.5">Schools</h1>
        <p className="text-neutral-500 text-sm">{schools.length} registered school accounts</p>
      </div>

      {schools.length === 0 ? (
        <div className="bg-white border border-neutral-100 rounded-xl p-12 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">No schools registered yet</p>
          <p className="text-neutral-300 text-xs mt-1">Schools register via the main registration flow</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {schools.map(school => (
            <div key={school.id} className={cn(
              "bg-white border border-neutral-100 rounded-xl p-5 shadow-sm flex items-center gap-4",
              !school.is_active && "opacity-60"
            )}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-navy-800 truncate">{school.name ?? "Unnamed School"}</div>
                <div className="text-xs text-neutral-400 truncate">{school.email}</div>
                <div className="flex items-center gap-3 mt-1">
                  {(school.city || school.country) && (
                    <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                      <MapPin className="w-3 h-3" />
                      {[school.city, school.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(school.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-1 rounded-lg",
                  school.is_active ? "bg-teal-50 text-teal-700" : "bg-neutral-100 text-neutral-500"
                )}>
                  {school.is_active ? "Active" : "Suspended"}
                </span>
                <button
                  onClick={() => toggleActive(school.id, school.is_active)}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all",
                    school.is_active
                      ? "text-red-500 border-red-200 hover:bg-red-50"
                      : "text-teal-600 border-teal-200 hover:bg-teal-50"
                  )}
                >
                  {school.is_active ? "Suspend" : "Restore"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
