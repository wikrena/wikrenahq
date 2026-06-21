import type { Metadata }     from "next"
import { redirect }          from "next/navigation"
import { createClient }      from "@/lib/supabase/server"
import { getAdminClient }    from "@/lib/supabase/admin"
import { AdminShell }        from "@/components/admin/admin-shell"
import { InstructorManager } from "@/components/admin/instructor-manager"

export const metadata: Metadata = { title: "Instructors — Wikrena Admin" }

export default async function AdminInstructorsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles").select("name, role").eq("id", user.id).single()
  if (!["ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  const { data: instructors } = await admin
    .from("profiles")
    .select("id, name, email, avatar, role, instructor_bio, instructor_title, created_at")
    .eq("role", "INSTRUCTOR")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <InstructorManager
        instructors={instructors ?? []}
        invitations={[]}
        currentUserId={user.id}
      />
    </AdminShell>
  )
}
