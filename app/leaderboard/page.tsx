import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { LeaderboardPage } from "@/components/academy/leaderboard"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Leaderboard" }



export default async function LeaderboardRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes, entriesRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("leaderboard_entries")
      .select("*, profiles(id, name, avatar, total_xp)")
      .eq("scope", "global").eq("period", "weekly")
      .order("xp", { ascending: false }).limit(20),
  ])

  const profile = profileRes.data
  const totalXp = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak  = profile?.current_streak ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak}>
      <LeaderboardPage entries={entriesRes.data ?? []} currentUserId={user.id} />
    </AppShell>
  )
}
