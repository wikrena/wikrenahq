import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AcademySidebar } from "@/components/academy/sidebar"
import { AcademyTopbar } from "@/components/academy/topbar"

export default async function AcademyLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="min-h-screen bg-neutral-50">
      <AcademySidebar />
      <AcademyTopbar userEmail={user.email ?? ""} />
      <main className="lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
