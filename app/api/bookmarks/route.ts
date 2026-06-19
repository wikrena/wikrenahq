import { NextRequest } from "next/server"
import { withAuth, ok, E } from "@/lib/api"

export const GET = withAuth(async (req, { userId, admin }) => {
  const { data, error } = await admin
    .from("bookmarks")
    .select("*, lessons(id, title, slug, chapters(title, slug, courses(title, slug)))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { lesson_id } = body
  if (!lesson_id) return E.badRequest("lesson_id required")

  const { data, error } = await admin
    .from("bookmarks")
    .upsert({ user_id: userId, lesson_id }, { onConflict: "user_id,lesson_id" })
    .select().single()
  if (error) return E.serverError(error.message)
  return ok(data, 201)
})

export const DELETE = withAuth(async (req, { userId, admin }) => {
  const { searchParams } = new URL(req.url)
  const lesson_id = searchParams.get("lesson_id")
  if (!lesson_id) return E.badRequest("lesson_id required")

  const { error } = await admin
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lesson_id)
  if (error) return E.serverError(error.message)
  return ok({ deleted: true })
})
