import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import { PeerReviewPage } from "@/components/academy/peer-review"

export const metadata: Metadata = { title: "Peer Review — Wikrena Community" }

export default async function PeerReviewRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const [profileRes, xpRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
  ])

  const profile = profileRes.data
  const totalXp = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name}
      totalXp={totalXp}
      streak={profile?.current_streak ?? 0}
      userRole={profile?.role ?? "STUDENT"}
    >
      <PeerReviewPage userId={user.id} />
    </AppShell>
  )
}
