import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = { title: "Set New Password — Wikrena Academy" }

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  )
}
