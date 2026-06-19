import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import { DashboardHome } from "@/components/academy/dashboard-home"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  // Step 1: verify user is logged in via Supabase Auth
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Step 2: read profile with admin client — guaranteed fresh, bypasses RLS
  const admin = getAdminClient()
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Step 3: profile must exist — created by /api/auth/register before email verification.
  // If missing it means something went wrong during registration.
  // Create it now as a safety net using metadata, then route correctly.
  if (profileError || !profile) {
    const metaRaw     = (user.user_metadata?.role ?? "student").toLowerCase().trim()
    const derivedRole =
      metaRaw === "parent"     ? "PARENT"     :
      metaRaw === "school"     ? "SCHOOL"     :
      metaRaw === "teacher"    ? "TEACHER"    :
      metaRaw === "instructor" ? "INSTRUCTOR" :
      metaRaw === "admin"      ? "ADMIN"      :
      "STUDENT"

    // Insert rather than upsert to avoid overwriting if race condition
    try {
      await admin.from("profiles").insert({
        id:              user.id,
        email:           user.email ?? "",
        name:            user.user_metadata?.name ?? null,
        role:            derivedRole,
        onboarding_done: false,
        total_xp:        0,
        current_streak:  0,
        updated_at:      new Date().toISOString(),
      })
    } catch { /* ignore duplicate — profile may have just been created */ }

    if (derivedRole === "ADMIN")                               redirect("/admin/dashboard")
    if (derivedRole === "INSTRUCTOR")                          redirect("/instructor/dashboard")
    if (derivedRole === "SCHOOL" || derivedRole === "TEACHER") redirect("/school/dashboard")
    if (derivedRole === "PARENT")                              redirect("/dashboard")
    redirect("/onboarding")
  }

  // Step 4: role-based routing — each role has its own dashboard
  const role = (profile.role ?? "STUDENT").toUpperCase()
  if (role === "PARENT")                           redirect("/parent/dashboard")
  if (role === "SCHOOL" || role === "TEACHER")     redirect("/school/dashboard")
  if (role === "ADMIN")                            redirect("/admin/dashboard")

  // Step 5: onboarding gate — must complete onboarding before seeing dashboard
  if (!profile.onboarding_done) redirect("/onboarding")

  // Step 6: fetch dashboard data — all in parallel
  const [enrollmentsRes, xpRes, badgesRes] = await Promise.all([
    admin
      .from("course_enrollments")
      .select("*, courses(*)")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("enrolled_at", { ascending: false })
      .limit(5),
    admin
      .from("xp_transactions")
      .select("amount")
      .eq("user_id", user.id),
    admin
      .from("user_badges")
      .select("*, badges(*)")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
      .limit(6),
  ])

  const enrollments = enrollmentsRes.data ?? []
  const totalXp     = xpRes.data?.reduce((s, t) => s + (t.amount ?? 0), 0) ?? 0
  const badges      = badgesRes.data ?? []

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile.name ?? undefined}
      totalXp={totalXp}
      streak={profile.current_streak ?? 0}
      userRole={profile.role ?? "STUDENT"}
    >
      <DashboardHome
        profile={profile}
        enrollments={enrollments}
        totalXp={totalXp}
        badges={badges}
        userEmail={user.email ?? ""}
      />
    </AppShell>
  )
}
