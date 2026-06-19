import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { message, sessionId, mode = "explain", lessonTitle, userCode, systemOverride } = body

  if (!message?.trim()) return NextResponse.json({ error: "No message" }, { status: 400 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reply: "Wren AI is not configured yet. Add your ANTHROPIC_API_KEY to .env to enable Wren.",
      sessionId: null,
    })
  }

  const admin = getAdminClient()

  // Get or create session
  let activeSessionId = sessionId
  if (!activeSessionId) {
    const { data: session } = await admin
      .from("ai_chat_sessions")
      .insert({ user_id: user.id, mode, title: message.slice(0, 50), created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select("id")
      .single()
    activeSessionId = session?.id
  }

  // Load conversation history
  const { data: history } = await admin
    .from("ai_chat_messages")
    .select("role, content")
    .eq("session_id", activeSessionId)
    .order("created_at")
    .limit(20)

  // Get profile for personalisation
  const { data: profile } = await admin
    .from("profiles")
    .select("name, total_xp, current_streak")
    .eq("id", user.id)
    .single()

  const systemPrompt = systemOverride ?? `You are Wren, the AI learning tutor for Wikrena Academy — Africa's leading data and AI learning platform.

Personality: Warm, encouraging, knowledgeable, and Africa-aware. Always use African business examples — MTN, Flutterwave, Jumia, Access Bank, Paystack, OPay, Konga, NHIS.

Student: ${profile?.name ?? "Student"} · ${profile?.total_xp ?? 0} XP · ${profile?.current_streak ?? 0}-day streak
${lessonTitle ? `Current lesson: ${lessonTitle}` : ""}
${userCode ? `Their code:\n\`\`\`\n${userCode}\n\`\`\`` : ""}

Mode: ${mode.toUpperCase()}
${mode === "explain" ? "Explain clearly with African context. Break complex ideas into simple steps." : ""}
${mode === "hint"    ? "Give progressive hints only — NEVER the full answer. Guide them step by step." : ""}
${mode === "debug"   ? "Explain WHY the error occurred. Teach debugging skills, don't just fix it." : ""}
${mode === "quiz"    ? "Ask ONE question at a time. Give encouraging feedback on their answer." : ""}
${mode === "career"  ? "Connect these skills to real data jobs at African companies. Be specific about salaries and roles in Nigeria, Kenya, and Ghana." : ""}

Keep responses concise — max 3 paragraphs unless code requires more. Never make the student feel stupid.`

  const messages: Anthropic.MessageParam[] = [
    ...(history ?? []).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: message },
  ]

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response  = await anthropic.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system:     systemPrompt,
      messages,
    })

    const reply = response.content[0].type === "text" ? response.content[0].text : ""

    // Save messages and update session
    const now = new Date().toISOString()
    await admin.from("ai_chat_messages").insert([
      { session_id: activeSessionId, role: "user",      content: message, created_at: now },
      { session_id: activeSessionId, role: "assistant", content: reply,   created_at: now },
    ])
    await admin.from("ai_chat_sessions").update({ updated_at: now }).eq("id", activeSessionId)

    return NextResponse.json({ reply, sessionId: activeSessionId })

  } catch (err: any) {
    console.error("[ai/chat] error:", err.message)
    return NextResponse.json({
      reply: "Sorry, I'm having trouble right now. Please try again in a moment.",
      sessionId: activeSessionId,
    })
  }
}
