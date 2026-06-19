import { withAuth, ok, E } from "@/lib/api"

export const GET = withAuth(async (req, { userId, admin }) => {
  const { searchParams } = new URL(req.url)
  const lesson_id = searchParams.get("lesson_id")

  let q = admin.from("notes").select("*").eq("user_id", userId)
  if (lesson_id) q = q.eq("lesson_id", lesson_id)

  const { data, error } = await q.order("updated_at", { ascending: false })
  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { lesson_id, content } = body
  if (!lesson_id || !content?.trim()) return E.badRequest("lesson_id and content required")

  const { data, error } = await admin
    .from("notes")
    .upsert({
      user_id:    userId,
      lesson_id,
      content:    content.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" })
    .select().single()
  if (error) return E.serverError(error.message)
  return ok(data)
})

export const DELETE = withAuth(async (req, { userId, admin }) => {
  const { searchParams } = new URL(req.url)
  const lesson_id = searchParams.get("lesson_id")
  if (!lesson_id) return E.badRequest("lesson_id required")

  const { error } = await admin
    .from("notes").delete()
    .eq("user_id", userId).eq("lesson_id", lesson_id)
  if (error) return E.serverError(error.message)
  return ok({ deleted: true })
})
