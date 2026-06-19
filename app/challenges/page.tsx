import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { ChallengesPage } from "@/components/academy/challenges"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Challenges" }



export default async function ChallengesRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes, challengesRes, submissionsRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("coding_challenges").select("*").order("difficulty"),
    admin.from("challenge_submissions").select("challenge_id").eq("user_id", user.id).eq("passed", true),
  ])

  const profile  = profileRes.data
  const totalXp  = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak   = profile?.current_streak ?? 0
  const passedIds = new Set(submissionsRes.data?.map((s: any) => s.challenge_id) ?? [])

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak}>
      <ChallengesPage challenges={challengesRes.data ?? []} passedIds={passedIds} userId={user.id} />
    </AppShell>
  )
}
