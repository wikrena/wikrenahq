"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, LogOut, User, Settings, ChevronDown, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export function AcademyTopbar({ userEmail }: { userEmail: string }) {
  const [userMenu, setUserMenu]   = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router   = useRouter()
  const supabase = createClient()
  const userRef  = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { setUserMenu(false); setNotifOpen(false); setSearchOpen(false) }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials = userEmail
    ? userEmail.split("@")[0].slice(0, 2).toUpperCase()
    : "WA"

  const notifications = [
    { icon: "🏅", title: "Badge Unlocked!", desc: "You earned the Week Warrior badge", time: "2m ago", unread: true },
    { icon: "🔥", title: "Streak at risk!", desc: "Complete a lesson to keep your 12-day streak", time: "1h ago", unread: true },
    { icon: "💬", title: "New reply in forum", desc: "Someone replied to your SQL post", time: "3h ago", unread: false },
  ]
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/95 backdrop-blur-sm border-b border-neutral-100 z-30 flex items-center px-4 sm:px-6 gap-3 shadow-[0_1px_0_0_rgb(0,0,0,0.06)]">

      {/* Mobile menu spacer */}
      <div className="w-10 lg:hidden shrink-0" />

      {/* Search */}
      <div ref={searchRef} className="flex-1 max-w-sm relative">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-white border-2 border-teal-400 rounded-xl px-3 py-2 shadow-teal-glow/30 ring-4 ring-teal-50">
            <Search className="w-4 h-4 text-teal-500 shrink-0" />
            <input
              autoFocus
              placeholder="Search courses, lessons, topics..."
              className="flex-1 text-sm text-navy-800 placeholder:text-neutral-400 outline-none bg-transparent"
            />
            <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:border-teal-300 hover:bg-white hover:text-navy-800 transition-all group text-left"
          >
            <Search className="w-4 h-4 group-hover:text-teal-500 transition-colors shrink-0" />
            <span className="hidden sm:inline">Search anything...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="ml-auto text-[10px] font-mono bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded hidden sm:inline group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:text-teal-600 transition-colors">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setUserMenu(false) }}
            className={cn(
              "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              notifOpen
                ? "bg-teal-50 text-teal-600 border border-teal-200"
                : "text-neutral-500 hover:text-navy-800 hover:bg-neutral-100 border border-transparent"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-brand-xl overflow-hidden z-50 animate-fade-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <div>
                  <span className="font-semibold text-sm text-navy-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-2 text-[10px] font-mono bg-coral-100 text-coral-600 px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                  )}
                </div>
                <button className="text-xs text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i}
                    className={cn(
                      "flex gap-3 px-4 py-3.5 hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-50 last:border-0",
                      n.unread && "bg-teal-50/30"
                    )}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-800 flex items-center gap-2">
                        {n.title}
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{n.desc}</div>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono mt-0.5">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-neutral-100 bg-neutral-50/50">
                <button className="text-xs text-center w-full text-neutral-500 hover:text-teal-600 transition-colors font-medium">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-neutral-200 mx-1" />

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserMenu(v => !v); setNotifOpen(false) }}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all border",
              userMenu
                ? "bg-neutral-100 border-neutral-200"
                : "hover:bg-neutral-50 border-transparent hover:border-neutral-200"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-xs font-bold shadow-brand-sm shrink-0">
              {initials}
            </div>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-neutral-400 hidden sm:block transition-transform duration-200",
              userMenu && "rotate-180"
            )} />
          </button>

          {userMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-200 rounded-2xl shadow-brand-xl overflow-hidden z-50 animate-fade-up">
              {/* User info */}
              <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-navy-800 truncate">{userEmail?.split("@")[0]}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{userEmail}</div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="p-1.5">
                {[
                  { href: "/profile",  icon: User,     label: "My Profile" },
                  { href: "/settings", icon: Settings,  label: "Settings" },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-600 hover:text-navy-800 hover:bg-neutral-100 rounded-xl transition-all group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-neutral-100 my-1.5" />

                <button onClick={signOut}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all w-full group"
                >
                  <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
