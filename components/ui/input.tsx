import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5",
        "text-sm text-navy-800 placeholder:text-neutral-400",
        "transition-all duration-150",
        "focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-navy-700 mb-1.5", className)}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Input, Label }
