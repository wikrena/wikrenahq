import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import { ProgressPage } from "@/components/academy/progress"

export const metadata: Metadata = { title: "My Progress — Wikrena Academy" }

export default async function ProgressRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes, enrollmentsRes, completionsRes, badgesRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role, total_xp, created_at").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount, created_at, reason").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
    admin.from("course_enrollments").select("*, learning_paths(title, icon, slug)").eq("user_id", user.id),
    admin.from("lesson_completions").select("id, completed_at, xp_earned").eq("user_id", user.id),
    admin.from("user_badges").select("*, badges(name, icon, description, rarity)").eq("user_id", user.id).order("earned_at", { ascending: false }),
  ])

  const profile    = profileRes.data
  const totalXp    = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak     = profile?.current_streak ?? 0

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name}
      totalXp={totalXp}
      streak={streak}
      userRole={profile?.role ?? "STUDENT"}
    >
      <ProgressPage
        profile={profile}
        totalXp={totalXp}
        xpHistory={xpRes.data ?? []}
        enrollments={enrollmentsRes.data ?? []}
        completions={completionsRes.data ?? []}
        badges={badgesRes.data ?? []}
      />
    </AppShell>
  )
}
