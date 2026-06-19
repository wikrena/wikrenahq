import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Bricolage_Grotesque, Work_Sans } from "next/font/google"
import "@/styles/globals.css"
import { validateEnv } from "@/lib/env"

// Validate all required environment variables at startup
// This throws a clear error immediately rather than silent failures later
if (process.env.NODE_ENV !== "test") {
  try { validateEnv() } catch (e) {
    console.error((e as Error).message)
  }
}
import { Toaster } from "@/components/ui/toaster"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400","500","600","700","800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400","500"],
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400","500","600","700","800"],
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  display: "swap",
  weight: ["400","500","600"],
})

export const metadata: Metadata = {
  title: {
    default: "Wikrena Academy — Africa's Data & AI Learning Platform",
    template: "%s | Wikrena Academy",
  },
  description: "Cohort-based, Africa-specific data and AI education. Master data analytics, engineering, science and AI — and get placed.",
  keywords: ["data analytics","data science","machine learning","Africa","Nigeria","SQL","Python"],
  authors: [{ name: "Wikrena Limited" }],
  creator: "Wikrena Limited",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a192f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${workSans.variable}`}>
      <body className="min-h-screen bg-[#F6F8FA] text-navy-800 antialiased font-body">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
