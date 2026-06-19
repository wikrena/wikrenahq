import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"

export default async function ProjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, current_streak").eq("id", user.id).single()
  const { data: xpData }  = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={profile?.current_streak ?? 0}>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">🗂️</div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-3">Projects</h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          Guided projects are being added. Each project will tie together skills from your track and produce a real portfolio piece.
        </p>
        <a href="/africa-lab" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
          Try Africa Data Lab Instead →
        </a>
      </div>
    </AppShell>
  )
}
