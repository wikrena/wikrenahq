import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import { PathsCatalog } from "@/components/academy/paths-catalog"

export const metadata: Metadata = { title: "Paths" }

export default async function PathsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const { data: profile } = await admin.from("profiles").select("name, current_streak, total_xp").eq("id", user.id).single()
  const { data: xpData } = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak = profile?.current_streak ?? 0
  
  const [pathsRes, enrollmentsRes] = await Promise.all([
    admin.from("learning_paths").select("*").eq("is_published", true).order("order"),
    admin.from("course_enrollments").select("course_id, progress_percent").eq("user_id", user.id).eq("is_active", true),
  ])

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name ?? undefined}
      totalXp={totalXp}
      streak={streak}
    >
      <PathsCatalog paths={pathsRes?.data ?? []} enrollments={enrollmentsRes?.data ?? []} userId={user.id} />
    </AppShell>
  )
}
