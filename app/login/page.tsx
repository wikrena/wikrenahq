import type { Metadata } from "next"
import { Suspense } from "react"                    // ← added
import { LoginForm } from "@/components/auth/login-form"
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo"
import Link from "next/link"

export const metadata: Metadata = { title: "Sign In — Wikrena Academy" }

const PROOF_POINTS = [
  { icon: "🌍", text: "Real datasets from MTN, Flutterwave, Paystack and Access Bank" },
  { icon: "🤖", text: "Wren AI tutor powered by Claude — explains with African context" },
  { icon: "🎯", text: "90-day placement promise — we stay with you until you land" },
  { icon: "👥", text: "Max 30 students per cohort — real attention, not just a number" },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] bg-[#0a192f] flex-col relative overflow-hidden shrink-0">

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(25%,-25%)" }} />
          <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #ff6b3d, transparent)", transform: "translate(-25%,25%)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative flex flex-col h-full p-12 xl:p-16">

          {/* Real logo — white version on dark bg */}
          <WikrenaLogo variant="light-bg" href="/" height={30} />

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center py-16">
            <h2 className="font-display font-black text-white leading-[1.05] tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}>
              Africa&apos;s data future<br />starts with you.
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-10 max-w-xs">
              Learn with real African data. Land a role at a company that matters.
            </p>
            <div className="space-y-4">
              {PROOF_POINTS.map(p => (
                <div key={p.text} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
                  <span className="text-white/60 text-sm leading-relaxed">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
            <p className="text-white/75 text-sm italic leading-relaxed mb-4">
              &ldquo;Eight weeks in, I was writing queries on real transaction data and presenting dashboards to my team.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-[#0a192f] text-xs font-black shrink-0">AO</div>
              <div>
                <div className="text-white text-xs font-semibold">Adaeze Okonkwo</div>
                <div className="text-white/35 text-[11px]">Operations Analyst · Access Bank</div>
              </div>
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
          <div className="w-full max-w-[400px]">
            {/* ← This is the fix */}
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-teal-500 rounded-full animate-spin mb-3"></div>
                Loading login form...
              </div>
            }>
              <LoginForm />
            </Suspense>
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