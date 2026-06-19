import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json().catch(() => ({}))
    if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })

    const admin = getAdminClient()

    const { data: invitation } = await admin
      .from("instructor_invitations").select("*")
      .eq("token", token).eq("accepted", false)
      .gte("expires_at", new Date().toISOString()).single()

    if (!invitation) return NextResponse.json({ error: "Invitation not found or expired" }, { status: 404 })

    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email: invitation.email, password, email_confirm: true,
      user_metadata: { name: invitation.name, role: invitation.role.toLowerCase() },
    })

    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

    await admin.from("profiles").insert({
      id: authUser.user.id, email: invitation.email, name: invitation.name,
      role: invitation.role, onboarding_done: true, total_xp: 0, current_streak: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    })

    await admin.from("instructor_invitations").update({ accepted: true }).eq("id", invitation.id)
    return NextResponse.json({ success: true, email: invitation.email })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
