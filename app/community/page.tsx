import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { CommunityPage } from "@/components/academy/community"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Community" }



export default async function CommunityRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes, categoriesRes, postsRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("forum_categories").select("*").order("order"),
    admin.from("forum_posts").select("*, profiles(name, avatar)").order("created_at", { ascending: false }).limit(20),
  ])

  const profile = profileRes.data
  const totalXp = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak  = profile?.current_streak ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak}>
      <CommunityPage categories={categoriesRes.data ?? []} posts={postsRes.data ?? []} userId={user.id} />
    </AppShell>
  )
}
