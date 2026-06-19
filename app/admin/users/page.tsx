import type { Metadata }  from "next"
import { redirect }       from "next/navigation"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AdminShell }     from "@/components/admin/admin-shell"
import { AdminUsers }     from "@/components/admin/admin-users"

export const metadata: Metadata = { title: "Users — Wikrena Admin" }

export default async function AdminUsersPage({ searchParams }: {
  searchParams: { role?: string; search?: string; page?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, role").eq("id", user.id).single()
  if (!["ADMIN", "TEACHER"].includes(profile?.role ?? "")) redirect("/dashboard")

  const page   = parseInt(searchParams.page ?? "1")
  const limit  = 20
  const offset = (page - 1) * limit
  const role   = searchParams.role
  const search = searchParams.search

  let q = admin.from("profiles")
    .select("id, name, email, role, total_xp, current_streak, is_active, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (role)   q = q.eq("role", role)
  if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`)

  const { data: users, count } = await q

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <AdminUsers
        users={users ?? []}
        total={count ?? 0}
        page={page}
        limit={limit}
        currentRole={role}
        search={search}
      />
    </AdminShell>
  )
}
