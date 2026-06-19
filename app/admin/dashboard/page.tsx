import type { Metadata }    from "next"
import { redirect }         from "next/navigation"
import { createClient }     from "@/lib/supabase/server"
import { getAdminClient }   from "@/lib/supabase/admin"
import { AdminShell }       from "@/components/admin/admin-shell"
import { AdminDashboard }   from "@/components/admin/admin-dashboard"

export const metadata: Metadata = { title: "Admin Dashboard — Wikrena Academy" }

export default async function AdminDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from("profiles").select("name, role").eq("id", user.id).single()

  if (!["ADMIN", "TEACHER"].includes(profile?.role ?? "")) redirect("/dashboard")

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    usersRes, recentUsersRes, enrollRes, xpRes,
    coursesRes, instructorsRes, schoolsRes,
    weeklyUsersRes, weeklyEnrollRes,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("profiles").select("id, name, email, role, total_xp, created_at")
      .eq("is_active", true).order("created_at", { ascending: false }).limit(8),
    admin.from("course_enrollments").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("xp_transactions").select("amount"),
    admin.from("courses").select("id, title, chapters(id)").eq("is_published", true).order("order"),
    admin.from("profiles").select("id, name, email, role").in("role", ["INSTRUCTOR", "TEACHER"]).eq("is_active", true),
    admin.from("profiles").select("id, name, email").eq("role", "SCHOOL").eq("is_active", true),
    admin.from("profiles").select("created_at").gte("created_at", sevenDaysAgo).eq("is_active", true),
    admin.from("course_enrollments").select("id", { count: "exact", head: true }).gte("enrolled_at", sevenDaysAgo),
  ])

  // Build 7-day registration chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
    const dayStr = d.toDateString()
    const count  = (weeklyUsersRes.data ?? []).filter(u =>
      new Date(u.created_at).toDateString() === dayStr
    ).length
    return { day: days[d.getDay()], count }
  })

  // Enrollment count per course
  const { data: enrollCounts } = await admin
    .from("course_enrollments").select("course_id")
  const countMap: Record<string, number> = {}
  for (const e of enrollCounts ?? []) {
    countMap[e.course_id] = (countMap[e.course_id] ?? 0) + 1
  }
  const coursesWithCounts = (coursesRes.data ?? []).map(c => ({
    ...c,
    enrollment_count: countMap[c.id] ?? 0,
  })).sort((a, b) => b.enrollment_count - a.enrollment_count)

  // Instructor course counts
  const { data: instructorCourses } = await admin
    .from("courses").select("instructor_id")
  const instCountMap: Record<string, number> = {}
  for (const c of instructorCourses ?? []) {
    if (c.instructor_id) instCountMap[c.instructor_id] = (instCountMap[c.instructor_id] ?? 0) + 1
  }
  const instructorsWithCounts = (instructorsRes.data ?? []).map(i => ({
    ...i,
    course_count: instCountMap[i.id] ?? 0,
  }))

  const totalXp = (xpRes.data ?? []).reduce((s, t) => s + (t.amount ?? 0), 0)

  return (
    <AdminShell adminName={profile?.name ?? undefined} adminEmail={user.email ?? ""}>
      <AdminDashboard
        adminName={profile?.name ?? user.email ?? "Admin"}
        adminEmail={user.email ?? ""}
        stats={{
          totalUsers:        usersRes.count  ?? 0,
          activeEnrollments: enrollRes.count ?? 0,
          totalXp,
          weeklyNewUsers:    weeklyUsersRes.data?.length ?? 0,
          weeklyEnrollments: weeklyEnrollRes.count ?? 0,
        }}
        recentUsers={recentUsersRes.data ?? []}
        topCourses={coursesWithCounts}
        instructors={instructorsWithCounts}
        schools={schoolsRes.data ?? []}
        registrationChart={chartData}
        passRate={74}
      />
    </AdminShell>
  )
}
