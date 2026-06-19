import type { Metadata }  from "next"
import { redirect }       from "next/navigation"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AdminShell }     from "@/components/admin/admin-shell"
import { AdminSettings }  from "@/components/admin/admin-settings"

export const metadata: Metadata = { title: "Settings — Wikrena Admin" }

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, role, email").eq("id", user.id).single()
  if (!["ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <AdminSettings profile={profile} />
    </AdminShell>
  )
}
