import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // ── Supabase auth ─────────────────────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          // ← IMPORTANT: request.cookies.set only accepts 2 arguments (name, value)
          // Next.js RequestCookies does NOT support the 3rd "options" parameter
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          // Create fresh response with updated request
          response = NextResponse.next({ request })

          // Response cookies DO support full options
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = [
    "/dashboard", "/paths", "/learn", "/challenges", "/leaderboard",
    "/community", "/africa-lab", "/workspace", "/career", "/profile",
    "/settings", "/ai-tutor", "/admin", "/parent", "/school", "/onboarding",
    "/placed",
  ]

  const isProtected = protectedPaths.some(
    p => pathname === p || pathname.startsWith(p + "/")
  )

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname)
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}