import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { OnboardingFlow } from "@/components/auth/onboarding"

export const metadata: Metadata = { title: "Welcome to Wikrena" }

export default async function OnboardingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("onboarding_done, name, role")
    .eq("id", user.id)
    .single()

  const role = (profile?.role ?? "STUDENT").toUpperCase()

  // Non-student roles should never see onboarding — send them to the right place
  if (role === "ADMIN")                        redirect("/admin/dashboard")
  if (role === "INSTRUCTOR")                   redirect("/instructor/dashboard")

  // Already completed onboarding
  if (profile?.onboarding_done) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
      <OnboardingFlow userId={user.id} userName={profile?.name} />
    </div>
  )
}
