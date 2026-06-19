import type { Metadata }  from "next"
import { redirect }       from "next/navigation"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AdminShell }     from "@/components/admin/admin-shell"

export const metadata: Metadata = { title: "Payments — Wikrena Admin" }

export default async function AdminPaymentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, role").eq("id", user.id).single()
  if (!["ADMIN"].includes(profile?.role ?? "")) redirect("/dashboard")

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <h1 className="font-display font-black text-2xl text-navy-800 mb-0.5">Payments</h1>
          <p className="text-neutral-500 text-sm">Transaction history and revenue</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">💳</div>
          <p className="font-semibold text-navy-800 mb-1">Payment analytics coming soon</p>
          <p className="text-sm text-neutral-400">Paystack webhooks are active. Transaction history will appear here once payments are processed.</p>
        </div>
      </div>
    </AdminShell>
  )
}
