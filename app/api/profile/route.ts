import { withAuth, ok, E } from "@/lib/api"

export const GET = withAuth(async (_req, { userId, admin }) => {
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  if (error || !data) return E.notFound("Profile")
  return ok(data)
})

export const PATCH = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))

  // Whitelist safe fields — never allow role/id changes via this route
  const allowed = [
    "name", "username", "bio", "avatar", "country", "city",
    "linkedin_url", "github_url", "twitter_url", "industry",
  ]

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (updates.username) {
    const { data: existing } = await admin
      .from("profiles").select("id")
      .eq("username", updates.username).neq("id", userId).single()
    if (existing) return E.conflict("Username already taken")
  }

  const { data, error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select().single()

  if (error) return E.serverError(error.message)
  return ok(data)
})
