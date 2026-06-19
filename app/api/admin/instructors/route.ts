import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = getAdminClient()
  const { data: p } = await admin.from("profiles").select("role, name").eq("id", user.id).single()
  if (p?.role !== "ADMIN") return null
  return { user, name: p.name ?? "Admin" }
}

// GET — list all instructors
export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = getAdminClient()
    const { data: instructors } = await admin
      .from("profiles")
      .select("id, name, email, avatar, instructor_bio, instructor_title, created_at")
      .in("role", ["INSTRUCTOR", "ADMIN", "TEACHER"])
      .order("created_at")

    const { data: invitations } = await admin
      .from("instructor_invitations")
      .select("*")
      .eq("accepted", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    return NextResponse.json({ instructors: instructors ?? [], invitations: invitations ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — invite a new instructor
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, email, role = "INSTRUCTOR" } = await req.json().catch(() => ({}))
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const admin = getAdminClient()

    // Check if already a member
    const { data: existing } = await admin
      .from("profiles")
      .select("id, role")
      .eq("email", email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: "This person already has an account" }, { status: 400 })
    }

    // Generate secure invitation token
    const token = crypto.randomBytes(32).toString("hex")

    await admin.from("instructor_invitations").insert({
      email:      email.trim().toLowerCase(),
      name:       name.trim(),
      token,
      invited_by: auth.user.id,
      role,
    })

    // Send invitation email
    await sendEmail.instructorInvite({
      name:        name.trim(),
      email:       email.trim().toLowerCase(),
      inviterName: auth.name,
      role,
      token,
    })

    return NextResponse.json({ success: true, message: `Invitation sent to ${email}` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE — remove instructor access
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { userId } = await req.json().catch(() => ({}))
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const admin = getAdminClient()
    await admin.from("profiles").update({ role: "STUDENT" }).eq("id", userId)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
