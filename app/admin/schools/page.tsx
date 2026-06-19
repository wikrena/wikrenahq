import type { Metadata }  from "next"
import { redirect }       from "next/navigation"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AdminShell }     from "@/components/admin/admin-shell"
import { AdminSchools }   from "@/components/admin/admin-schools"

export const metadata: Metadata = { title: "Schools — Wikrena Admin" }

export default async function AdminSchoolsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, role").eq("id", user.id).single()
  if (!["ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  const { data: schools } = await admin
    .from("profiles")
    .select("id, name, email, is_active, created_at, city, country")
    .eq("role", "SCHOOL")
    .order("created_at", { ascending: false })

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <AdminSchools schools={schools ?? []} />
    </AdminShell>
  )
}
