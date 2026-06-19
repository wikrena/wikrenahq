import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
    const { pathId } = await req.json()
    if (!pathId) return NextResponse.json({ error: "Missing pathId" }, { status: 400 })
  
    const admin = getAdminClient()
  
    // Verify the path is actually complete
    const { data: enrollment } = await admin
      .from("course_enrollments")
      .select("*, learning_paths(title)")
      .eq("user_id", user.id)
      .eq("course_id", pathId)
      .gte("progress_percent", 100)
      .single()
  
    if (!enrollment) {
      return NextResponse.json({ error: "You haven't completed this path yet." }, { status: 400 })
    }
  
    const { data: profile } = await admin
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single()
  
    const certId = `WK-${Date.now().toString(36).toUpperCase()}`
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://academy.wikrena.com"
  
    const certificate = {
      id:          certId,
      user_id:     user.id,
      user_name:   profile?.name ?? user.email,
      path_title:  (enrollment.learning_paths as any)?.title ?? "Data Analytics",
      issued_at:   new Date().toISOString(),
      verify_url:  `${appUrl}/certificates/${certId}`,
    }
  
    return NextResponse.json({ certificate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Unexpected error" }, { status: 500 })
  }
}