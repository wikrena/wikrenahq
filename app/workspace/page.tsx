import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/app-shell/app-shell"
import { WorkspacePage } from "@/components/academy/workspace"
import { getAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Workspace" }



export default async function WorkspaceRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()

  const [profileRes, xpRes, workspacesRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("workspaces").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ])

  const profile = profileRes.data
  const totalXp = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const streak  = profile?.current_streak ?? 0

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={streak} userRole={profile?.role ?? "STUDENT"}>
      <WorkspacePage workspaces={workspacesRes.data ?? []} userId={user.id} />
    </AppShell>
  )
}
