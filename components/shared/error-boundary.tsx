"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorBoundaryProps {
  error:  Error & { digest?: string }
  reset:  () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log to error tracking service in production
    if (process.env.NODE_ENV === "production") {
      console.error("App error:", error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred. Please try again or contact support if it persists."
          }
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E9F0] hover:bg-[#F0F4F8] text-navy-700 rounded-xl font-semibold text-sm transition-all"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
