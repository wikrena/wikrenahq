/**
 * GET /api/admin/courses-list
 * Returns a lightweight list of all courses for dropdowns.
 * Used by the invite modal and other admin UI.
 */
import { withAdmin, ok, E } from "@/lib/api"

export const GET = withAdmin(async (_req, { admin }) => {
  const { data, error } = await admin
    .from("courses")
    .select("id, title, is_published")
    .order("title", { ascending: true })

  if (error) return E.serverError(error.message)
  return ok(data ?? [])
})
