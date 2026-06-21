"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [done, setDone]         = useState(false)
  const { toast } = useToast()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast({ title:"Password too short", description:"At least 8 characters required.", variant:"destructive" })
      return
    }
    setLoading(true)

    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password, role: "student" }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Registration failed", description: data.error ?? "Something went wrong.", variant: "destructive" })
        setLoading(false)
        return
      }

      // If email confirmation is disabled, redirect immediately
      if (data.immediate && data.redirect) {
        window.location.href = data.redirect
        return
      }

      // Email confirmation required — show check your email screen
      setDone(true)
    } catch (err: any) {
      toast({ title: "Registration failed", description: "Network error. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGLoading(true)
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    })
  }

  // ── Email sent screen ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center text-center w-full">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto"
          style={{ background: "rgba(46,196,182,0.08)", border: "2px solid rgba(46,196,182,0.2)" }}>
          🎓
        </div>

        {/* Heading */}
        <h2 className="font-display font-black text-2xl text-navy-800 mb-2 leading-tight">
          Check your email
        </h2>

        {/* Email */}
        <p className="text-neutral-500 text-sm mb-1 leading-relaxed">
          We sent a confirmation link to
        </p>
        <p className="font-bold mb-4 text-sm text-teal-600">{email}</p>

        {/* What happens next */}
        <div className="w-full rounded-2xl p-4 mb-6 text-left"
          style={{ background: "rgba(46,196,182,0.08)", border: "1px solid rgba(46,196,182,0.2)" }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-teal-600">
            What happens next
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            After confirming, you&apos;ll choose your learning track and start your first mission.
          </p>
        </div>

        {/* Tips */}
        <div className="w-full rounded-xl p-4 mb-6 text-left bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
            Can't find the email?
          </div>
          <ul className="space-y-1.5">
            {[
              "Check your spam or junk folder",
              "Make sure you entered the right email address",
              "The link expires in 24 hours",
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-xs text-neutral-500">
                <span className="text-teal-500 font-black shrink-0 mt-0.5">→</span> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link href="/login" className="w-full">
          <button className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 bg-teal-500">
            Back to Sign In
          </button>
        </Link>

        <p className="text-[11px] text-neutral-300 mt-4">
          © {new Date().getFullYear()} Wikrena Academy
        </p>
      </div>
    )
  }

  // ── Registration details ───────────────────────────────────────────────────
  return (
    <div>
      <h1 className="font-display font-black text-xl text-navy-800 mb-1">
        Create your account
      </h1>
      <p className="text-neutral-500 text-sm mb-7">
        Start your data career journey today.
      </p>

      {/* Google */}
      <button onClick={handleGoogle} disabled={gLoading}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border-2 border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-sm font-medium text-navy-700 transition-all disabled:opacity-50 mb-5 shadow-brand-sm"
      >
        {gLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </button>

      <div className="divider-text mb-5">or sign up with email</div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPw ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="text-teal-600 hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
        </p>
        <Button type="submit" disabled={loading} variant="teal" className="w-full h-11 font-bold">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account →"}
        </Button>
      </form>
    </div>
  )
}
