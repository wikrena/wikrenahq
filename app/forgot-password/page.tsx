import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = { title: "Reset Password — Wikrena Academy" }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  )
}
