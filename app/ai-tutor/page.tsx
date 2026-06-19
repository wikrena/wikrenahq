import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { WrenAiTutor } from "@/components/academy/ai-tutor"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Ai Tutor" }



export default async function AiTutorPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const { data: profile } = await admin.from("profiles").select("name, current_streak, total_xp").eq("id", user.id).single()
  const { data: xpData } = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak = profile?.current_streak ?? 0
  
  const { data: sessions } = await admin
    .from("ai_chat_sessions").select("id, title, mode, created_at")
    .eq("user_id", user.id).order("updated_at", { ascending: false }).limit(10)

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name ?? undefined}
      totalXp={totalXp}
      streak={streak}
    >
      <WrenAiTutor userId={user.id} sessions={sessions ?? []} />
    </AppShell>
  )
}
