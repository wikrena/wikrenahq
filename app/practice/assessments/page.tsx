import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"

export const metadata: Metadata = { title: "Assessments — Wikrena Academy" }

export default async function AssessmentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, current_streak, total_xp").eq("id", user.id).single()
  const { data: xpData }  = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={profile?.current_streak ?? 0}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-3">Assessments</h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          Skill assessments are being built. They will let you test your knowledge and skip ahead in tracks you already know.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/challenges" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
            Try Challenges Instead →
          </a>
        </div>
      </div>
    </AppShell>
  )
}
