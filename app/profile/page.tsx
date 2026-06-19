import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { ProfilePage } from "@/components/academy/profile"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Profile" }



export default async function ProfileRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, badgesRes, xpRes, enrollmentsRes] = await Promise.all([
    admin.from("profiles").select("*").eq("id", user.id).single(),
    admin.from("user_badges").select("*, badges(*)").eq("user_id", user.id).order("earned_at", { ascending: false }),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("course_enrollments").select("*, courses(title, slug)").eq("user_id", user.id),
  ])

  const profile  = profileRes.data
  const totalXp  = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak   = profile?.current_streak ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak}>
      <ProfilePage
        profile={profile}
        badges={badgesRes.data ?? []}
        totalXp={totalXp}
        enrollments={enrollmentsRes.data ?? []}
        userEmail={user.email ?? ""}
      />
    </AppShell>
  )
}
