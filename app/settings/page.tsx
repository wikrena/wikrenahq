import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { SettingsPage } from "@/components/academy/settings"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Settings" }



export default async function SettingsRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes] = await Promise.all([
    admin.from("profiles").select("*").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
  ])

  const profile  = profileRes.data
  const totalXp  = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak   = profile?.current_streak ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak}>
      <SettingsPage profile={profile} userEmail={user.email ?? ""} userId={user.id} />
    </AppShell>
  )
}
