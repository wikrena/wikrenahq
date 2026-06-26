import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light-bg" | "dark-bg" | "icon-only"
  href?: string
  className?: string
  height?: number
}

export function WikrenaLogo({ variant = "light-bg", href = "/dashboard", className, height = 32 }: LogoProps) {
  // "dark-bg" = this logo is placed ON a dark background → needs the white-wordmark version
  // "light-bg" = this logo is placed ON a light background → needs the navy-wordmark version
  const src = variant === "dark-bg"
    ? "/logo-dark-bg.svg"    // white wordmark, for dark backgrounds
    : variant === "icon-only"
    ? "/favicon.png"
    : "/logo-light-bg.svg"   // navy wordmark, for light backgrounds

  // Preserve aspect ratio based on known SVG dimensions
  const aspectRatios = {
    "light-bg":  3264 / 1011,  // ~3.23
    "dark-bg":   3264 / 1116,  // ~2.92
    "icon-only": 1,            // square
  }

  const width = Math.round(height * aspectRatios[variant])

  const img = (
    <Image
      src={src}
      alt="Wikrena Academy"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  )

  if (!href) return img

  return (
    <Link href={href} className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
      {img}
    </Link>
  )
}

// Icon only — square logo mark
export function WikrenaIcon({ size = 28, href, className }: { size?: number; href?: string; className?: string }) {
  const img = (
    <Image
      src="/favicon.png"
      alt="W"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority
    />
  )

  if (!href) return <div style={{ width: size, height: size }}>{img}</div>

  return (
    <Link href={href} className="flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
      <div style={{ width: size, height: size }}>{img}</div>
    </Link>
  )
}
