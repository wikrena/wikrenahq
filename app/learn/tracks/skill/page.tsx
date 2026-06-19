import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { SkillTracksPage } from "@/components/academy/tracks"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Skill Tracks" }



export default async function SkillTracks() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, current_streak").eq("id", user.id).single()
  const { data: xpData } = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const { data: enrollments } = await admin.from("course_enrollments").select("path_id, progress_percent").eq("user_id", user.id)

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={profile?.current_streak ?? 0}>
      <SkillTracksPage enrollments={enrollments ?? []} userId={user.id} />
    </AppShell>
  )
}
