"use client"

import { useState, useRef } from "react"
import { Loader2, Camera, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Props { profile: any; userEmail: string; userId: string }

export function SettingsPage({ profile, userEmail, userId }: Props) {
  const [name,      setName]      = useState(profile?.name     ?? "")
  const [username,  setUsername]  = useState(profile?.username ?? "")
  const [bio,       setBio]       = useState(profile?.bio      ?? "")
  const [avatar,    setAvatar]    = useState<string|null>(profile?.avatar ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [saveError, setSaveError] = useState("")
  const fileRef    = useRef<HTMLInputElement>(null)
  const { toast }  = useToast()
  const supabase   = createClient()
  const initials   = (name || userEmail || "WA").slice(0, 2).toUpperCase()

  // ── Avatar upload ─────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)) {
      toast({ title:"Invalid file", description:"Please upload JPG, PNG or WebP.", variant:"destructive" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title:"File too large", description:"Maximum 5MB.", variant:"destructive" })
      return
    }

    setUploading(true)
    try {
      const ext      = file.name.split(".").pop() ?? "jpg"
      const filePath = `${userId}/avatar.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadErr) throw new Error(uploadErr.message)

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      const avatarUrl = `${publicUrl}?v=${Date.now()}`

      // Save via API
      const res = await fetch("/api/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ avatar: avatarUrl }),
      })

      if (!res.ok) throw new Error("Failed to save avatar URL")

      setAvatar(avatarUrl)
      toast({ title: "Photo updated ✓" })
    } catch (err: any) {
      const msg = err?.message ?? "Upload failed"
      if (msg.includes("bucket") || msg.includes("not found")) {
        toast({ title:"Bucket missing", description:"Create an 'avatars' bucket in Supabase Storage and set it to public.", variant:"destructive" })
      } else {
        toast({ title:"Upload failed", description: msg, variant:"destructive" })
      }
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function removeAvatar() {
    await fetch("/api/profile", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ avatar: null }),
    })
    setAvatar(null)
    toast({ title: "Photo removed" })
  }

  // ── Save profile ─────────────────────────────────────────────────────────
  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setSaveError("")

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")

    const res = await fetch("/api/profile", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:     name.trim()    || null,
        username: cleanUsername  || null,
        bio:      bio.trim()     || null,
      }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setSaveError(data.error ?? "Failed to save. Please try again.")
      return
    }

    setSaved(true)
    toast({ title: "Profile saved ✓" })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">Settings</h1>
        <p className="text-neutral-500 text-sm">Manage your account and preferences.</p>
      </div>

      {/* ── Profile Picture ── */}
      <div className="surface-lg p-6">
        <h2 className="font-display font-bold text-base text-navy-800 mb-5">Profile Picture</h2>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E5E9F0] bg-navy-800 flex items-center justify-center">
              {avatar ? (
                <Image src={avatar} alt="Avatar" width={80} height={80}
                  className="w-full h-full object-cover" unoptimized />
              ) : (
                <span className="text-white font-display font-bold text-2xl">{initials}</span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center hover:bg-teal-400 transition-colors shadow-surface">
              {uploading
                ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                : <Camera className="w-3.5 h-3.5 text-white" />
              }
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy-800 mb-1">
              {uploading ? "Uploading..." : "Profile photo"}
            </p>
            <p className="text-xs text-neutral-400 mb-3">JPG, PNG or WebP · Max 5MB</p>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                {uploading ? "Uploading..." : "Change photo"}
              </button>
              {avatar && (
                <button onClick={removeAvatar}
                  className="text-xs font-semibold text-neutral-500 border border-[#E5E9F0] hover:border-red-200 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      {/* ── Profile Info ── */}
      <div className="surface-lg p-6">
        <h2 className="font-display font-bold text-base text-navy-800 mb-5">Profile Information</h2>

        <form onSubmit={save} className="space-y-4">
          {saveError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {saveError}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Email address</label>
            <input type="email" value={userEmail} disabled
              className="flex w-full rounded-xl border border-[#E5E9F0] bg-[#F6F8FA] px-4 py-2.5 text-sm text-neutral-400 cursor-not-allowed" />
            <p className="text-xs text-neutral-400 mt-1">Email cannot be changed here.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Adaeze Okonkwo"
              className="flex w-full rounded-xl border border-[#E5E9F0] bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all" />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm select-none">@</span>
              <input value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}
                placeholder="adaeze"
                className="flex w-full rounded-xl border border-[#E5E9F0] bg-white pl-8 pr-4 py-2.5 text-sm placeholder:text-neutral-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all" />
            </div>
            <p className="text-xs text-neutral-400 mt-1">Letters, numbers and underscores only.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell the community a little about yourself..."
              rows={3} maxLength={200}
              className="flex w-full rounded-xl border border-[#E5E9F0] bg-white px-4 py-3 text-sm placeholder:text-neutral-400 resize-none outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all" />
            <p className="text-xs text-right text-neutral-400 mt-1">{bio.length}/200</p>
          </div>

          <button type="submit" disabled={saving}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all min-w-[140px]",
              saved ? "bg-green-500 text-white" : "bg-teal-500 hover:bg-teal-400 text-white disabled:opacity-50"
            )}>
            {saving  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> :
             saved   ? <><Check className="w-4 h-4" /> Saved!</> :
             "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── Danger Zone ── */}
      <div className="surface-lg p-6 border border-red-100">
        <h2 className="font-display font-bold text-base text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-neutral-500 mb-4">Permanent actions that cannot be undone.</p>
        <button onClick={() => toast({ title:"Contact support", description:"Email hello@wikrena.com to delete your account.", variant:"destructive" })}
          className="text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-medium">
          Delete Account
        </button>
      </div>
    </div>
  )
}
