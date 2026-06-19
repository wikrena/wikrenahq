import { withAdmin, ok, E } from "@/lib/api"
import { getAllProfiles, updateUserRole, searchProfiles } from "@/lib/data/users"
import type { UserRole } from "@/types"

export const GET = withAdmin(async (req, { admin }) => {
  const { searchParams } = new URL(req.url)
  const role   = searchParams.get("role") as UserRole | null
  const search = searchParams.get("search")
  const limit  = parseInt(searchParams.get("limit") ?? "50")
  const offset = parseInt(searchParams.get("offset") ?? "0")

  if (search) {
    const profiles = await searchProfiles(search, limit)
    return ok(profiles)
  }

  const profiles = await getAllProfiles({ role: role ?? undefined, limit, offset })
  return ok(profiles)
})

export const PATCH = withAdmin(async (req, { admin }) => {
  const body = await req.json().catch(() => ({}))
  const { id, role, is_active } = body
  if (!id) return E.badRequest("User ID required")

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (role)       updates.role      = role
  if (is_active !== undefined) updates.is_active = is_active

  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select().single()

  if (error) return E.serverError(error.message)
  return ok(data)
})
