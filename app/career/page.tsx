import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import { CareerHub } from "@/components/academy/career-hub"

export const metadata: Metadata = { title: "Career Hub — Wikrena Academy" }

export default async function CareerRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const [profileRes, xpRes, jobsRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("job_listings").select("*").eq("is_active", true)
      .order("is_featured", { ascending: false }).limit(20),
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
      <CareerHub jobs={jobsRes.data ?? []} userId={user.id} />
    </AppShell>
  )
}
