import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Singleton — one client per server process
let _adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase admin credentials. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env"
    )
  }

  _adminClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession:   false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-application-name": "wikrena-server",
      },
    },
  })

  return _adminClient
}
