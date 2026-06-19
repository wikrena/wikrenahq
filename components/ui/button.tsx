import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:      "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-brand-sm hover:shadow-brand-md",
        teal:         "bg-teal-500 text-navy-900 hover:bg-teal-400 active:bg-teal-600 font-bold shadow-brand-sm hover:shadow-teal-glow",
        coral:        "bg-coral-500 text-white hover:bg-coral-400 active:bg-coral-600 font-bold shadow-brand-sm",
        outline:      "border-2 border-navy-800 text-navy-800 bg-transparent hover:bg-navy-800 hover:text-white",
        "outline-teal":"border-2 border-teal-500 text-teal-600 bg-transparent hover:bg-teal-500 hover:text-white",
        ghost:        "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-navy-800",
        "ghost-teal": "bg-transparent text-teal-600 hover:bg-teal-50 hover:text-teal-700",
        destructive:  "bg-red-600 text-white hover:bg-red-500",
        secondary:    "bg-neutral-100 text-navy-800 hover:bg-neutral-200",
        link:         "text-teal-600 underline-offset-4 hover:underline p-0 h-auto shadow-none",
        default:      "bg-navy-800 text-white hover:bg-navy-700 shadow-brand-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-3.5 text-xs rounded-lg",
        lg:      "h-12 px-7 text-base rounded-2xl",
        xl:      "h-14 px-9 text-lg rounded-2xl",
        icon:    "h-10 w-10",
        "icon-sm":"h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
