"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Shield, Mail, Key } from "lucide-react"

interface Props { profile: any }

export function AdminSettings({ profile }: Props) {
  const router = useRouter()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole,  setInviteRole]  = useState("INSTRUCTOR")
  const [inviteName,  setInviteName]  = useState("")
  const [loading,     setLoading]     = useState(false)
  const [msg,         setMsg]         = useState<{ type: "success"|"error"; text: string } | null>(null)

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setLoading(true)
    setMsg(null)
    try {
      const res  = await fetch("/api/invite", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: inviteEmail.trim(), role: inviteRole, name: inviteName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ type: "error", text: data.error ?? "Failed" })
      } else {
        setMsg({ type: "success", text: `Invitation sent to ${inviteEmail}` })
        setInviteEmail(""); setInviteName("")
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-0.5">Settings</h1>
        <p className="text-neutral-500 text-sm">Platform configuration and admin tools</p>
      </div>

      {/* Invite User */}
      <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
            <Mail className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="font-bold text-navy-800">Invite a User</h2>
            <p className="text-xs text-neutral-400">Send a role-specific invitation email</p>
          </div>
        </div>

        {msg && (
          <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${
            msg.type === "success" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={sendInvite} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Amara Nwosu"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Email <span className="text-red-400">*</span></label>
              <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@example.com"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">Role <span className="text-red-400">*</span></label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20">
              <option value="INSTRUCTOR">Instructor — can create and publish courses</option>
              <option value="ADMIN">Admin — full platform access</option>
            </select>
          </div>
          <button type="submit" disabled={loading || !inviteEmail.trim()}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all">
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>

      {/* Admin Info */}
      <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-navy-800">Your Admin Account</h2>
            <p className="text-xs text-neutral-400">Current session information</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-xs text-neutral-500">Name</span>
            <span className="text-xs font-semibold text-navy-800">{profile?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-xs text-neutral-500">Email</span>
            <span className="text-xs font-semibold text-navy-800">{profile?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-xs text-neutral-500">Role</span>
            <span className="text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-lg">
              {profile?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
