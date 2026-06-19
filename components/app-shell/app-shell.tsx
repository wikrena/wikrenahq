"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppTopNav }  from "./app-topnav"
import { AppSidebar } from "./app-sidebar"
import { getLevelFromXp, getNextLevel, getLevelProgress } from "@/lib/utils"

interface Props {
  children:   React.ReactNode
  userEmail:  string
  userName?:  string
  totalXp:    number
  streak:     number
  userRole?:  string
}

function getActiveSection(pathname: string): string {
  if (pathname.startsWith("/practice") || pathname.startsWith("/challenges") || pathname.startsWith("/workspace")) return "practice"
  if (pathname.startsWith("/career")   || pathname.startsWith("/placed"))                                          return "career"
  if (pathname.startsWith("/community")|| pathname.startsWith("/leaderboard"))                                     return "community"
  if (pathname.startsWith("/africa-lab"))                                                                          return "africa-lab"
  return "learn"
}

export function AppShell({ children, userEmail, userName, totalXp, streak, userRole }: Props) {
  const pathname      = usePathname()
  const activeSection = getActiveSection(pathname)
  const level         = getLevelFromXp(totalXp)
  const nextLevel     = getNextLevel(totalXp)
  const progressPct   = getLevelProgress(totalXp)

  // Sidebar open state — lifted here so TopNav hamburger can control it
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <AppTopNav
        userEmail={userEmail}
        userName={userName}
        totalXp={totalXp}
        streak={streak}
        levelName={level.name}
        levelIcon={level.icon}
        progressPct={progressPct}
        onMenuClick={() => setSidebarOpen(v => !v)}
      />

      <AppSidebar
        activeSection={activeSection}
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — shifts right on md+ to make room for sidebar */}
      <main className="md:ml-60 pt-14 min-h-screen pb-20 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav activeSection={activeSection} />
    </div>
  )
}

// ── BOTTOM NAV (mobile only) ─────────────────────────────────────────────────
const BOTTOM_NAV = [
  { id: "learn",      label: "Learn",     icon: "🏠",  href: "/dashboard"  },
  { id: "practice",   label: "Practice",  icon: "💻",  href: "/challenges"  },
  { id: "career",     label: "Career",    icon: "💼",  href: "/career"      },
  { id: "community",  label: "Community", icon: "👥",  href: "/community"   },
  { id: "africa-lab", label: "Lab",       icon: "🌍",  href: "/africa-lab"  },
]

function BottomNav({ activeSection }: { activeSection: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-[#E5E9F0] safe-area-pb">
      <div className="flex items-stretch h-14">
        {BOTTOM_NAV.map(item => {
          const active = activeSection === item.id
          return (
            <a key={item.id} href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all">
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal-500 rounded-b-full" />
              )}
              <span className="text-base leading-none">{item.icon}</span>
              <span className={`text-[9px] font-bold leading-none ${active ? "text-teal-600" : "text-neutral-400"}`}>
                {item.label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
