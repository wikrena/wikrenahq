import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const LANG_IDS: Record<string, number> = { python:71, sql:82, r:80, javascript:63 }

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { code, language } = await req.json()
  if (!code || !language) return NextResponse.json({ error: "Missing code or language" }, { status: 400 })

  const languageId = LANG_IDS[language.toLowerCase()]
  if (!languageId) return NextResponse.json({ error: "Unsupported language" }, { status: 400 })

  if (!process.env.JUDGE0_API_KEY) {
    return NextResponse.json({ stdout: "Code runner not configured. Add JUDGE0_API_KEY to .env to enable code execution.", stderr: "", passed: false })
  }

  try {
    const judge0Url = process.env.JUDGE0_API_URL ?? "https://judge0-ce.p.rapidapi.com"
    const res = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!, "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com" },
      body: JSON.stringify({ language_id: languageId, source_code: code, stdin: "" }),
    })
    const data = await res.json()
    return NextResponse.json({ stdout: data.stdout ?? "", stderr: data.stderr ?? "", compile_output: data.compile_output ?? "", passed: data.status?.id === 3, time: data.time })
  } catch {
    return NextResponse.json({ error: "Code runner unavailable" }, { status: 503 })
  }
}
