"use client"

import { useState, useCallback } from "react"

export type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastFn = (opts: Omit<Toast, "id">) => void
let globalToast: ToastFn | null = null

export function useToast() {
  const toast = useCallback((opts: Omit<Toast, "id">) => {
    if (globalToast) globalToast(opts)
  }, [])
  return { toast }
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  globalToast = (opts) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { ...opts, id }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500)
  }

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={[
            "pointer-events-auto min-w-[300px] max-w-[420px] rounded-2xl border px-4 py-3.5 shadow-brand-xl",
            "animate-slide-right",
            t.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-white border-neutral-200 text-navy-800"
          ].join(" ")}
        >
          <div className="font-semibold text-sm">{t.title}</div>
          {t.description && (
            <div className="text-xs text-neutral-500 mt-0.5">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}
