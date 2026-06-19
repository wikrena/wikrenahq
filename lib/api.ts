/**
 * Wikrena Academy — API Route Helpers
 *
 * Standardised wrappers for all API routes.
 * Every route should use withAdmin() or withAuth() instead of
 * writing auth checks and try/catch blocks manually.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient }   from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import type { UserRole }  from "@/types"

// ── Response helpers ──────────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export const E = {
  unauthorized:    () => err("Not authenticated", 401),
  forbidden:       () => err("Access denied", 403),
  notFound:        (what = "Resource") => err(`${what} not found`, 404),
  badRequest:      (msg: string) => err(msg, 400),
  serverError:     (msg = "Internal server error") => err(msg, 500),
  conflict:        (msg: string) => err(msg, 409),
}

// ── Auth context ──────────────────────────────────────────────────────────────

export interface AuthContext {
  userId:   string
  email:    string
  role:     UserRole
  admin:    ReturnType<typeof getAdminClient>
}

// ── Route wrappers ────────────────────────────────────────────────────────────

type RouteHandler = (
  req:     NextRequest,
  ctx:     AuthContext,
  params?: Record<string, string>
) => Promise<NextResponse>

/**
 * withAuth — wraps a route with authentication.
 * Any logged-in user can access.
 */
export function withAuth(handler: RouteHandler) {
  return async (req: NextRequest, { params }: { params?: Record<string, string> } = {}) => {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return E.unauthorized()

      const admin = getAdminClient()
      const { data: profile } = await admin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const ctx: AuthContext = {
        userId: user.id,
        email:  user.email ?? "",
        role:   (profile?.role ?? "STUDENT") as UserRole,
        admin,
      }

      return await handler(req, ctx, params)
    } catch (e: any) {
      console.error("[API Error]", e?.message)
      return E.serverError(e?.message ?? "Unexpected error")
    }
  }
}

/**
 * withAdmin — wraps a route requiring ADMIN or TEACHER role.
 */
export function withAdmin(handler: RouteHandler) {
  return withAuth(async (req, ctx, params) => {
    if (!["ADMIN", "TEACHER"].includes(ctx.role)) return E.forbidden()
    return handler(req, ctx, params)
  })
}

/**
 * withInstructor — wraps a route requiring ADMIN, TEACHER or INSTRUCTOR role.
 */
export function withInstructor(handler: RouteHandler) {
  return withAuth(async (req, ctx, params) => {
    if (!["ADMIN", "TEACHER", "INSTRUCTOR"].includes(ctx.role)) return E.forbidden()
    return handler(req, ctx, params)
  })
}

/**
 * withRole — wraps a route requiring a specific set of roles.
 */
export function withRole(roles: UserRole[], handler: RouteHandler) {
  return withAuth(async (req, ctx, params) => {
    if (!roles.includes(ctx.role)) return E.forbidden()
    return handler(req, ctx, params)
  })
}

// ── Slug helper ───────────────────────────────────────────────────────────────

export function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ── Pagination helper ─────────────────────────────────────────────────────────

export function getPagination(req: NextRequest, defaultLimit = 20) {
  const url   = new URL(req.url)
  const page  = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"))
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") ?? String(defaultLimit)))
  const from  = (page - 1) * limit
  const to    = from + limit - 1
  return { page, limit, from, to }
}
