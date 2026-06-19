import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import Link from "next/link"
import { Code2, ClipboardCheck, FlaskConical, Database, ArrowRight, CheckCircle2, Lock } from "lucide-react"

export const metadata: Metadata = { title: "Practice — Wikrena Academy" }

export default async function PracticePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const [profileRes, xpRes, submissionsRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("challenge_submissions").select("challenge_id").eq("user_id", user.id).eq("passed", true),
  ])

  const profile    = profileRes.data
  const totalXp    = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const passedCount = submissionsRes.data?.length ?? 0

  const SECTIONS = [
    {
      icon:        Code2,
      emoji:       "💻",
      title:       "Coding Challenges",
      description: "Practice SQL and Python on real African business data. Each challenge earns XP and sharpens your skills for job interviews.",
      href:        "/challenges",
      stat:        `${passedCount} completed`,
      color:       "border-teal-200 hover:border-teal-400",
      iconBg:      "bg-teal-50",
      iconColor:   "text-teal-600",
      cta:         "Go to Challenges",
      available:   true,
    },
    {
      icon:        FlaskConical,
      emoji:       "🔬",
      title:       "Workspace",
      description: "Your personal coding environment. Write Python, SQL or R, run it instantly, and save your notebooks. Works like a mini VS Code in the browser.",
      href:        "/workspace",
      stat:        "Python · SQL · R",
      color:       "border-blue-200 hover:border-blue-400",
      iconBg:      "bg-blue-50",
      iconColor:   "text-blue-600",
      cta:         "Open Workspace",
      available:   true,
    },
    {
      icon:        Database,
      emoji:       "🌍",
      title:       "Africa Data Lab",
      description: "Explore real African datasets — Lagos traffic patterns, MTN subscriber data, Jumia sales records. Download and use them in your projects.",
      href:        "/africa-lab",
      stat:        "Real African data",
      color:       "border-amber-200 hover:border-amber-400",
      iconBg:      "bg-amber-50",
      iconColor:   "text-amber-600",
      cta:         "Explore Datasets",
      available:   true,
    },
    {
      icon:        ClipboardCheck,
      emoji:       "🎯",
      title:       "Skill Assessments",
      description: "Formal assessments that test your knowledge across a track. Pass an assessment to earn a verified skill badge and skip ahead in your learning path.",
      href:        "/practice/assessments",
      stat:        "Coming Soon",
      color:       "border-neutral-200",
      iconBg:      "bg-neutral-50",
      iconColor:   "text-neutral-400",
      cta:         "Coming Soon",
      available:   false,
    },
  ]

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name}
      totalXp={totalXp}
      streak={profile?.current_streak ?? 0}
      userRole={profile?.role ?? "STUDENT"}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl text-navy-800 mb-1">Practice</h1>
          <p className="text-neutral-500 text-sm">
            Sharpen your skills through challenges, hands-on coding, and real African datasets.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Challenges Passed", value: passedCount,        icon: "✅" },
            { label: "Total XP Earned",   value: `${totalXp} XP`,   icon: "⚡" },
            { label: "Day Streak",        value: `${profile?.current_streak ?? 0}🔥`, icon: "" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E5E9F0] rounded-2xl p-4 text-center">
              <div className="font-display font-black text-2xl text-navy-800">{s.value}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Practice sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(section => (
            <div key={section.title}
              className={`bg-white border-2 rounded-2xl p-6 transition-all ${section.color} ${section.available ? "hover:shadow-sm" : "opacity-70"}`}>

              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${section.iconBg} flex items-center justify-center`}>
                  <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  section.available
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                }`}>
                  {section.stat}
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-navy-800 mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                {section.description}
              </p>

              {section.available ? (
                <Link href={section.href}
                  className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-800 transition-colors">
                  {section.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-400">
                  <Lock className="w-4 h-4" /> Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-6 bg-navy-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="text-2xl shrink-0">💡</div>
          <div>
            <div className="font-semibold text-white text-sm mb-1">
              Practice tip
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The fastest way to get job-ready is to solve at least one challenge per day in the Workspace,
              then submit it for Peer Review. Real practice beats watching tutorials every time.
            </p>
          </div>
        </div>

      </div>
    </AppShell>
  )
}
