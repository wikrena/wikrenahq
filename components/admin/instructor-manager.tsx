"use client"

import { useState } from "react"
import {
  UserPlus, Mail, Trash2, Loader2, Check, X,
  Clock, Shield, GraduationCap, Crown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Instructor {
  id: string; name: string | null; email: string; avatar: string | null
  role: string; instructor_bio: string | null; instructor_title: string | null; created_at: string
}
interface Invitation {
  id: string; email: string; name: string; role: string; created_at: string; expires_at: string
}
interface Props {
  instructors: Instructor[]; invitations: Invitation[]; currentUserId: string
}

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string; badge: string }> = {
  ADMIN:      { label:"Admin",      icon: Crown,          color:"text-amber-600",  badge:"bg-amber-100 text-amber-700" },
  INSTRUCTOR: { label:"Instructor", icon: GraduationCap,  color:"text-teal-600",   badge:"bg-teal-100 text-teal-700" },
  TEACHER:    { label:"Teacher",    icon: Shield,          color:"text-purple-600", badge:"bg-purple-100 text-purple-700" },
}

export function InstructorManager({ instructors, invitations: initialInvitations, currentUserId }: Props) {
  const [invitations, setInvitations]   = useState(initialInvitations)
  const [inviteOpen,  setInviteOpen]    = useState(false)
  const [name,        setName]          = useState("")
  const [email,       setEmail]         = useState("")
  const [role,        setRole]          = useState("INSTRUCTOR")
  const [sending,     setSending]       = useState(false)
  const [error,       setError]         = useState("")
  const [success,     setSuccess]       = useState("")

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSending(true); setError(""); setSuccess("")
    try {
      const res  = await fetch("/api/admin/instructors", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(`Invitation sent to ${email}`)
      setName(""); setEmail(""); setRole("INSTRUCTOR")
      setInviteOpen(false)
    } catch { setError("Failed to send invitation") }
    finally { setSending(false) }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-navy-800">Instructors</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            {instructors.length} active · {invitations.length} pending invitation{invitations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
          <UserPlus className="w-4 h-4" /> Invite Instructor
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {/* Invite form */}
      {inviteOpen && (
        <div className="surface-lg p-5 mb-6 border-2 border-teal-200">
          <h3 className="font-semibold text-navy-800 mb-4">Send Invitation</h3>
          <form onSubmit={sendInvite} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required
                  placeholder="e.g. Amara Okonkwo"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="amara@example.com"
                  className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-500 mb-1 block">Role</label>
              <div className="flex gap-2">
                {["INSTRUCTOR","ADMIN","TEACHER"].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                      role === r ? "border-teal-500 bg-teal-50 text-teal-700" : "border-[#E5E9F0] text-neutral-500 hover:border-neutral-300"
                    )}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">⚠️ {error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={sending || !name.trim() || !email.trim()}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Mail className="w-4 h-4" /> Send Invitation</>}
              </button>
              <button type="button" onClick={() => setInviteOpen(false)}
                className="px-4 py-2.5 text-neutral-500 border border-neutral-200 rounded-xl text-sm hover:bg-neutral-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active instructors */}
      <div className="mb-8">
        <h2 className="font-semibold text-sm text-neutral-500 uppercase tracking-wide mb-3">Active Members</h2>
        <div className="space-y-2">
          {instructors.map(instructor => {
            const roleConfig = ROLE_CONFIG[instructor.role] ?? ROLE_CONFIG.INSTRUCTOR
            const RoleIcon   = roleConfig.icon
            const isYou      = instructor.id === currentUserId

            return (
              <div key={instructor.id} className="surface-lg p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0">
                  {instructor.avatar
                    ? <img src={instructor.avatar} alt={instructor.name ?? ""} className="w-full h-full object-cover" />
                    : <span className="font-bold text-teal-700">{(instructor.name ?? "?")[0].toUpperCase()}</span>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy-800 text-sm">{instructor.name ?? "No name"}</span>
                    {isYou && <span className="text-[10px] bg-navy-100 text-navy-600 font-bold px-1.5 py-0.5 rounded-full">YOU</span>}
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", roleConfig.badge)}>
                      <RoleIcon className="w-2.5 h-2.5" /> {roleConfig.label}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">{instructor.email}</div>
                  {instructor.instructor_title && (
                    <div className="text-xs text-neutral-400">{instructor.instructor_title}</div>
                  )}
                </div>
                {/* Joined */}
                <div className="text-xs text-neutral-300 font-code shrink-0">
                  {new Date(instructor.created_at).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-neutral-500 uppercase tracking-wide mb-3">
            Pending Invitations ({invitations.length})
          </h2>
          <div className="space-y-2">
            {invitations.map(inv => (
              <div key={inv.id} className="surface-lg p-4 flex items-center gap-4 opacity-70">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy-800 text-sm">{inv.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">PENDING</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-500 font-bold px-2 py-0.5 rounded-full">{inv.role}</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">{inv.email}</div>
                  <div className="text-xs text-neutral-300 font-code">
                    Expires {new Date(inv.expires_at).toLocaleDateString("en-NG")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
