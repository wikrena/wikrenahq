/**
 * Profile data access layer.
 * All profile DB operations go through here.
 */
import { getAdminClient } from "@/lib/supabase/admin"
import type { Profile } from "@/types"

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await getAdminClient()
    .from("profiles").select("*").eq("id", id).single()
  if (error) return null
  return data as Profile
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, "name"|"username"|"bio"|"avatar"|"industry"|"onboarding_done">>
): Promise<{ error: string | null }> {
  const { error } = await getAdminClient()
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
  return { error: error?.message ?? null }
}

export async function createProfile(profile: {
  id: string; email: string; name: string | null; role: string; onboarding_done: boolean
}): Promise<{ error: string | null }> {
  const { error } = await getAdminClient()
    .from("profiles")
    .insert({ ...profile, total_xp: 0, current_streak: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  return { error: error?.message ?? null }
}
