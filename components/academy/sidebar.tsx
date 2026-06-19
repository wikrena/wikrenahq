"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, BookOpen, Code2, Trophy,
  Users, Briefcase, Bot, User, Settings,
  Database, Zap, Flame, X, Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",  group: "learn" },
  { icon: BookOpen,        label: "My Paths",    href: "/paths",      group: "learn" },
  { icon: Code2,           label: "Challenges",  href: "/challenges", group: "learn" },
  { icon: Database,        label: "Africa Lab",  href: "/africa-lab", group: "learn" },
  { icon: Trophy,          label: "Leaderboard", href: "/leaderboard",group: "community" },
  { icon: Users,           label: "Community",   href: "/community",  group: "community" },
  { icon: Bot,             label: "Wren AI",     href: "/ai-tutor",   group: "tools", highlight: true },
  { icon: Code2,           label: "Workspace",   href: "/workspace",  group: "tools" },
  { icon: Briefcase,       label: "Career",      href: "/career",     group: "tools" },
]

const bottomItems = [
  { icon: User,     label: "Profile",  href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const groups = [
  { id: "learn",     label: "Learn" },
  { id: "community", label: "Community" },
  { id: "tools",     label: "Tools" },
]

export function AcademySidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white">

      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-100 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-navy-800 flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-shadow">
            <span className="text-white font-display font-black text-sm">W</span>
          </div>
          <div>
            <span className="font-display font-bold text-navy-800 text-base">Wikrena</span>
            <span className="font-display font-bold text-teal-500 text-base"> Academy</span>
          </div>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* XP Strip */}
      <div className="mx-3.5 mt-4 mb-2 p-3.5 bg-gradient-to-r from-navy-800 to-navy-700 rounded-2xl shadow-brand-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-teal-400" />
            </div>
            <span className="text-xs font-semibold text-white">Analyst</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-coral-500/20 flex items-center justify-center">
              <Flame className="w-3 h-3 text-coral-400" />
            </div>
            <span className="text-xs font-semibold text-coral-300">12-day streak</span>
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: "62%", background: "linear-gradient(90deg, #2ec4b6, #178d82)" }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] font-mono text-white/40">1,840 XP</span>
          <span className="text-[10px] font-mono text-white/40">3,000 XP → Expert</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group.id)
          return (
            <div key={group.id} className="mb-1">
              <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                {group.label}
              </div>
              {items.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                      active
                        ? "bg-teal-50 text-teal-700 font-semibold"
                        : item.highlight
                        ? "text-coral-500 hover:bg-coral-50 hover:text-coral-600"
                        : "text-neutral-600 hover:text-navy-800 hover:bg-neutral-100"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active ? "text-teal-600" : item.highlight ? "text-coral-400" : "text-neutral-400 group-hover:text-current"
                    )} />
                    <span className="flex-1">{item.label}</span>
                    {item.highlight && (
                      <span className="text-[9px] font-mono bg-coral-100 text-coral-600 px-1.5 py-0.5 rounded-full font-bold">AI</span>
                    )}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-500 rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}

        <div className="mt-2 pt-2 border-t border-neutral-100 space-y-0.5">
          {bottomItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  active ? "bg-teal-50 text-teal-700 font-semibold" : "text-neutral-600 hover:text-navy-800 hover:bg-neutral-100"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active ? "text-teal-600" : "text-neutral-400 group-hover:text-current"
                )} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-40 border-r border-neutral-100 shadow-[1px_0_0_0_rgb(0,0,0,0.04)]">
        <NavContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-30 w-9 h-9 bg-white border border-neutral-200 rounded-xl flex items-center justify-center shadow-brand-sm hover:bg-neutral-50 hover:border-neutral-300 transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4 text-neutral-600" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-navy-800/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 border-r border-neutral-100 shadow-brand-xl">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
