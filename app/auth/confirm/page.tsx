/**
 * /auth/confirm
 *
 * Client-side handler for Supabase email verification.
 * Supabase delivers the token as a URL hash (#access_token=...)
 * which cannot be read server-side. This page reads it client-side,
 * exchanges it for a session, then redirects to the correct dashboard.
 */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "error">("verifying")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    async function handleConfirm() {
      const supabase = createClient()

      // Parse hash fragment from URL
      const hash   = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)

      const accessToken  = params.get("access_token")
      const refreshToken = params.get("refresh_token")
      const type         = params.get("type")
      const errorParam   = params.get("error")
      const errorDesc    = params.get("error_description")

      // Also check query params for token_hash flow
      const searchParams = new URLSearchParams(window.location.search)
      const tokenHash    = searchParams.get("token_hash")
      const tokenType    = searchParams.get("type")

      if (errorParam) {
        setErrorMsg(errorDesc ?? errorParam)
        setStatus("error")
        return
      }

      try {
        let userId: string | undefined

        if (tokenHash && tokenType) {
          // token_hash flow — server can also handle this but handle here as fallback
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: tokenType as any,
          })
          if (error) throw error
          userId = data.user?.id

        } else if (accessToken && refreshToken) {
          // Hash fragment flow — set session directly
          const { data, error } = await supabase.auth.setSession({
            access_token:  accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          userId = data.user?.id
        } else {
          throw new Error("No verification token found in URL")
        }

        if (!userId) throw new Error("Could not establish session")

        // Read role from DB and route correctly
        const res  = await fetch("/api/auth/role")
        const data = await res.json()

        const role = (data.role ?? "STUDENT").toUpperCase()

        if (role === "ADMIN")                               router.replace("/admin/dashboard")
        else if (role === "INSTRUCTOR")                     router.replace("/instructor/dashboard")
        else if (role === "SCHOOL" || role === "TEACHER")   router.replace("/school/dashboard")
        else if (role === "PARENT")                         router.replace("/dashboard")
        else if (data.onboardingDone)                       router.replace("/dashboard")
        else                                                router.replace("/onboarding")

      } catch (err: any) {
        console.error("[auth/confirm]", err.message)
        setErrorMsg(err.message ?? "Verification failed")
        setStatus("error")
      }
    }

    handleConfirm()
  }, [router])

  if (status === "error") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F8", fontFamily: "system-ui" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 420, width: "100%", textAlign: "center", border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0a192f", marginBottom: 8 }}>Verification failed</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>{errorMsg}</p>
        <a href="/login" style={{ display: "inline-block", background: "#2ec4b6", color: "#fff", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          Back to Sign In
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F8", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "3px solid #2ec4b6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
        <p style={{ fontSize: 15, color: "#64748b", fontWeight: 600 }}>Confirming your email...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
