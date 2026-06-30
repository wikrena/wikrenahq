import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = { title: "Create Account — Wikrena Academy" }

const PROOF_POINTS = [
  { icon: "🌍", text: "Real datasets from MTN, Flutterwave, Paystack and Access Bank" },
  { icon: "🤖", text: "Wren AI tutor powered by Claude, with African context built in"  },
  { icon: "🎯", text: "90-day placement promise. We stay with you until you land."       },
  { icon: "👥", text: "Max 30 students per cohort. Real attention, not just a number."  },
]

const ALUMNI = [
  { initials: "AO", name: "Adaeze Okonkwo",  role: "Data Analyst · Access Bank",  color: "bg-teal-500"   },
  { initials: "CE", name: "Chidera Emeka",    role: "SQL Developer · Flutterwave", color: "bg-coral-500"  },
  { initials: "FS", name: "Fatima Suleiman",  role: "BI Analyst · MTN Nigeria",    color: "bg-purple-500" },
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] bg-[#0a192f] flex-col relative overflow-hidden shrink-0">

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(20%,-20%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #ff6b3d, transparent)", transform: "translate(-20%,20%)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative flex flex-col h-full p-12 xl:p-16">

          {/* Real logo — white version on dark bg */}
          <WikrenaLogo variant="light-bg" href="/" height={30} />

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/25 text-teal-300 text-[11px] font-mono px-3 py-1.5 rounded-full mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
              Africa&apos;s #1 Data &amp; AI Platform
            </div>

            <h2 className="font-display font-black text-white leading-[1.05] tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}>
              Your data career<br />
              starts <span className="text-teal-400">right here.</span>
            </h2>

            <p className="text-white/55 text-base leading-relaxed mb-10 max-w-xs">
              Learn with real African data. Land a role at a company that matters.
            </p>

            <div className="space-y-4 mb-0">
              {PROOF_POINTS.map(p => (
                <div key={p.text} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
                  <span className="text-white/60 text-sm leading-relaxed">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alumni strip */}
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">
              Recent placements
            </p>
            <div className="space-y-3">
              {ALUMNI.map(a => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {a.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold leading-tight truncate">{a.name}</div>
                    <div className="text-white/35 text-[11px] truncate">{a.role}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex flex-col bg-white min-h-screen">

        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <WikrenaLogo variant="dark-bg" href="/" height={26} />
        </div>

        {/* Back to home — desktop only */}
        <div className="hidden lg:flex px-10 pt-8">
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            ← Back to home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-[420px]">

            <div className="mb-8">
              <h1 className="font-display font-black text-2xl text-navy-800 mb-1.5">
                Create your account
              </h1>
              <p className="text-neutral-500 text-sm">
                Already have one?{" "}
                <Link href="/login" className="text-teal-600 font-semibold hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>

            <RegisterForm />

          </div>
        </div>

        <div className="px-6 py-5 text-center">
          <p className="text-[11px] text-neutral-300">
            © 2026 Wikrena Academy · Africa&apos;s Data &amp; AI Platform
          </p>
        </div>
      </div>
    </div>
  )
}
