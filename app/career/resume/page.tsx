import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"

export const metadata: Metadata = { title: "Resume Review — Wikrena Academy" }

export default async function Page() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single()
  const { data: xpData } = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name}
      totalXp={totalXp}
      streak={profile?.current_streak ?? 0}
      userRole={profile?.role ?? "STUDENT"}
    >
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="text-6xl mb-5">📄</div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-3">Resume Review</h1>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">Upload your CV and get AI-powered feedback tailored for data roles at African companies.</p>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2.5 rounded-xl text-sm font-semibold">
          🚧 Coming Soon
        </div>
        <div className="mt-6">
          <a href="/career" className="text-sm text-teal-600 hover:underline font-medium">← Back to Career Hub</a>
        </div>
      </div>
    </AppShell>
  )
}
