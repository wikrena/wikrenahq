import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

async function requireSchool() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = getAdminClient()
  const { data: p } = await admin.from("profiles").select("role, school_id, name").eq("id", user.id).single()
  if (!["SCHOOL","TEACHER","ADMIN"].includes(p?.role ?? "")) return null
  return { user, profile: p }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireSchool()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const admin = getAdminClient()
    const schoolId = new URL(req.url).searchParams.get("schoolId")
    const q = admin.from("cohorts")
      .select("*, cohort_students(student_id), cohort_courses(course_id)")
      .order("created_at", { ascending: false })
    if (schoolId) q.eq("school_id", schoolId)
    const { data, error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ cohorts: data ?? [] })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireSchool()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { school_id, name, description, grade, year } = await req.json().catch(() => ({}))
    if (!school_id || !name?.trim()) return NextResponse.json({ error: "school_id and name required" }, { status: 400 })
    const admin = getAdminClient()
    const { data, error } = await admin.from("cohorts").insert({
      school_id, name: name.trim(), description: description ?? null,
      grade: grade ?? null, year: year ?? new Date().getFullYear().toString(),
      teacher_id: auth.user.id,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ cohort: data })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
