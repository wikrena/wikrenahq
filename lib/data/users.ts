/**
 * lib/data/users.ts
 * All user/profile queries. Single source of truth.
 */

import { getAdminClient } from "@/lib/supabase/admin"
import type { Profile, UserRole } from "@/types"

const db = () => getAdminClient()

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await db()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()
  if (error) { console.error("[getProfileById]", error.message); return null }
  return data as Profile
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  const { data, error } = await db()
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single()
  if (error) return null
  return data as Profile
}

export async function getAllProfiles(opts: {
  role?:   UserRole
  limit?:  number
  offset?: number
} = {}): Promise<Profile[]> {
  let q = db()
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  if (opts.role)   q = q.eq("role", opts.role)
  if (opts.limit)  q = q.limit(opts.limit)
  if (opts.offset) q = q.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1)
  const { data, error } = await q
  if (error) { console.error("[getAllProfiles]", error.message); return [] }
  return (data ?? []) as Profile[]
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await db()
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) { console.error("[updateProfile]", error.message); return null }
  return data as Profile
}

export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  const { error } = await db()
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) { console.error("[updateUserRole]", error.message); return false }
  return true
}

export async function getInstructors(): Promise<Profile[]> {
  const { data, error } = await db()
    .from("profiles")
    .select("*")
    .in("role", ["INSTRUCTOR", "ADMIN", "TEACHER"])
    .eq("is_active", true)
    .order("name")
  if (error) { console.error("[getInstructors]", error.message); return [] }
  return (data ?? []) as Profile[]
}

export async function countUsersByRole(): Promise<Record<UserRole, number>> {
  const { data, error } = await db()
    .from("profiles")
    .select("role")
  if (error) return {} as any
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.role] = (counts[row.role] ?? 0) + 1
  }
  return counts as Record<UserRole, number>
}

export async function searchProfiles(query: string, limit = 20): Promise<Profile[]> {
  const { data, error } = await db()
    .from("profiles")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`)
    .limit(limit)
  if (error) { console.error("[searchProfiles]", error.message); return [] }
  return (data ?? []) as Profile[]
}
