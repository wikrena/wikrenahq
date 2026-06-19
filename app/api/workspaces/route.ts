import { withAuth, ok, E } from "@/lib/api"

export const GET = withAuth(async (req, { userId, admin }) => {
  const { data, error } = await admin
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { title, language, content, is_public } = body
  if (!title?.trim()) return E.badRequest("title required")

  const { data, error } = await admin
    .from("workspaces")
    .insert({
      user_id:   userId,
      title:     title.trim(),
      language:  language ?? "python",
      content:   content ?? "",
      is_public: is_public ?? false,
    })
    .select().single()
  if (error) return E.serverError(error.message)
  return ok(data, 201)
})

export const PATCH = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { id, title, content, language, is_public } = body
  if (!id) return E.badRequest("id required")

  const { data, error } = await admin
    .from("workspaces")
    .update({ title, content, language, is_public, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId) // ensure ownership
    .select().single()
  if (error) return E.serverError(error.message)
  return ok(data)
})

export const DELETE = withAuth(async (req, { userId, admin }) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return E.badRequest("id required")

  const { error } = await admin
    .from("workspaces")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
  if (error) return E.serverError(error.message)
  return ok({ deleted: true })
})
