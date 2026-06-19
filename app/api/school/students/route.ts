import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

async function requireSchool() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = getAdminClient()
  const { data: p } = await admin.from("profiles").select("role, school_id, name").eq("id", user.id).single()
  if (!["SCHOOL","TEACHER","ADMIN"].includes(p?.role ?? "")) return null
  return { user, profile: p }
}

// GET — students in a cohort with their progress
export async function GET(req: NextRequest) {
  try {
    const auth = await requireSchool()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const cohortId = new URL(req.url).searchParams.get("cohortId")
    if (!cohortId) return NextResponse.json({ error: "Missing cohortId" }, { status: 400 })
    const admin = getAdminClient()

    const { data: members } = await admin
      .from("cohort_students").select("student_id, enrolled_at").eq("cohort_id", cohortId)

    if (!members?.length) return NextResponse.json({ students: [] })

    const studentIds = members.map(m => m.student_id)
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, name, email, avatar, total_xp, current_streak, last_activity_at")
      .in("id", studentIds)

    // Get lesson completion counts
    const completionCounts = await Promise.all(
      studentIds.map(async sid => {
        const { data } = await admin.from("lesson_completions").select("id").eq("user_id", sid)
        return { id: sid, count: data?.length ?? 0 }
      })
    )

    const countMap = Object.fromEntries(completionCounts.map(c => [c.id, c.count]))

    const students = (profiles ?? []).map(p => ({
      ...p,
      completions: countMap[p.id] ?? 0,
      enrolledAt: members.find(m => m.student_id === p.id)?.enrolled_at,
    }))

    return NextResponse.json({ students })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

// POST — invite student to cohort
export async function POST(req: NextRequest) {
  try {
    const auth = await requireSchool()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { cohort_id, school_id, email, student_name } = await req.json().catch(() => ({}))
    if (!cohort_id || !school_id || !email?.trim()) {
      return NextResponse.json({ error: "cohort_id, school_id and email required" }, { status: 400 })
    }

    const admin = getAdminClient()

    // Get cohort + school name
    const [{ data: cohort }, { data: school }] = await Promise.all([
      admin.from("cohorts").select("name").eq("id", cohort_id).single(),
      admin.from("schools").select("name").eq("id", school_id).single(),
    ])

    const token = crypto.randomBytes(32).toString("hex")

    await admin.from("school_invitations").insert({
      cohort_id, school_id, email: email.trim().toLowerCase(), token,
    })

    await sendEmail.schoolInvitation({
      email:       email.trim().toLowerCase(),
      studentName: student_name ?? email.split("@")[0],
      schoolName:  school?.name ?? "Your School",
      cohortName:  cohort?.name ?? "Your Class",
      token,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
