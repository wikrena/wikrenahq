"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Search, Bell, LogOut, User, Settings,
  BookOpen, Code2, Briefcase, Users, Database,
  X, Flame, Zap, ChevronRight, GraduationCap,
  Star, BarChart2, CheckCheck
} from "lucide-react"
import { WikrenaLogo } from "./wikrena-logo"
import { createClient } from "@/lib/supabase/client"
import { getLevelFromXp } from "@/lib/utils"
import { cn } from "@/lib/utils"

export const NAV_SECTIONS = [
  { id: "learn",      label: "Learn",      href: "/dashboard", icon: BookOpen  },
  { id: "practice",   label: "Practice",   href: "/practice",  icon: Code2     },
  { id: "career",     label: "Career",     href: "/career",    icon: Briefcase },
  { id: "community",  label: "Community",  href: "/community", icon: Users     },
  { id: "africa-lab", label: "Africa Lab", href: "/africa-lab",icon: Database  },
]

interface Notif {
  icon:   string
  title:  string
  desc:   string
  time:   string
  unread: boolean
  href?:  string
}

interface Props {
  userEmail:    string
  userName?:    string
  totalXp:      number
  streak:       number
  levelName:    string
  levelIcon:    string
  progressPct:  number
  onMenuClick?: () => void
}

export function AppTopNav({
  userEmail, userName, totalXp, streak,
  levelName, levelIcon, progressPct, onMenuClick,
}: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const [userOpen,  setUserOpen]  = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [query,     setQuery]     = useState("")
  const [notifs,    setNotifs]    = useState<Notif[]>([])
  const [allRead,   setAllRead]   = useState(false)

  const userRef   = useRef<HTMLDivElement>(null)
  const notifRef  = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // ── Close dropdowns on outside click ─────────────────────────────────────
  useEffect(() => {
    function handle(e: MouseEvent) {
      const target = e.target as Node
      if (userRef.current   && !userRef.current.contains(target))   setUserOpen(false)
      if (notifRef.current  && !notifRef.current.contains(target))  setNotifOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  // ── Keyboard: Escape closes, ⌘K opens search ─────────────────────────────
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserOpen(false)
        setNotifOpen(false)
        setSearching(false)
        setQuery("")
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearching(true)
      }
    }
    document.addEventListener("keydown", handle)
    return () => document.removeEventListener("keydown", handle)
  }, [])

  // ── Auto-focus search input ───────────────────────────────────────────────
  useEffect(() => {
    if (searching) searchRef.current?.focus()
  }, [searching])

  // ── Load real notifications ───────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [badgesRes, profileRes] = await Promise.all([
          supabase
            .from("user_badges")
            .select("earned_at, badges(name, icon)")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false })
            .limit(3),
          supabase
            .from("profiles")
            .select("current_streak, last_activity_at")
            .eq("id", user.id)
            .single(),
        ])

        const items: Notif[] = []

        // Badge notifications
        for (const ub of badgesRes.data ?? []) {
          const badge = (ub as any).badges
          if (!badge) continue
          const diffMs  = Date.now() - new Date(ub.earned_at).getTime()
          const diffH   = Math.floor(diffMs / 3_600_000)
          const timeStr = diffH < 1 ? "just now" : diffH < 24 ? `${diffH}h ago` : `${Math.floor(diffH / 24)}d ago`
          items.push({
            icon:   badge.icon ?? "🏅",
            title:  "Badge Unlocked!",
            desc:   `You earned the ${badge.name} badge`,
            time:   timeStr,
            unread: diffMs < 48 * 3_600_000,
            href:   "/profile",
          })
        }

        // Streak-at-risk notification
        const prof = profileRes.data
        if (prof?.current_streak > 0 && prof?.last_activity_at) {
          const daysSince = (Date.now() - new Date(prof.last_activity_at).getTime()) / 86_400_000
          if (daysSince >= 0.8 && daysSince < 2) {
            items.unshift({
              icon:   "🔥",
              title:  "Streak at risk!",
              desc:   `Do a lesson today to keep your ${prof.current_streak}-day streak alive`,
              time:   "now",
              unread: true,
              href:   "/courses",
            })
          }
        }

        // Fallback welcome notification
        if (items.length === 0) {
          items.push({
            icon:   "👋",
            title:  "Welcome to Wikrena!",
            desc:   "Start a course to earn XP and unlock your first badge.",
            time:   "now",
            unread: true,
            href:   "/courses",
          })
        }

        setNotifs(items)
      } catch { /* non-critical */ }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function markRead() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
    setAllRead(true)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const displayName = userName || userEmail?.split("@")[0] || "You"
  const initials    = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
  const level       = getLevelFromXp(totalXp)
  const unreadCount = allRead ? 0 : notifs.filter(n => n.unread).length

  function isActive(s: typeof NAV_SECTIONS[number]) {
    if (s.id === "learn")
      return pathname === "/dashboard" || pathname.startsWith("/learn") ||
             pathname.startsWith("/courses") || pathname.startsWith("/paths")
    return pathname.startsWith(s.href)
  }

  // ── Shared dropdown wrapper — fixed on mobile, absolute on desktop ────────
  // We render TWO instances of each panel:
  //   1. Mobile: fixed, inset-x-3, top-[58px], visible only below md
  //   2. Desktop: absolute right-0, visible only md+
  // This avoids any clipping issues entirely.

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          HEADER BAR
          Layout on mobile:  [hamburger + logo]  ··· [search · bell · avatar]
          Layout on desktop: [logo | nav links]  ··· [search · streak · xp · bell · avatar]
          ════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a192f] shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center h-full">

          {/* ── Left: logo area ─────────────────────────────────────────── */}

          {/* Desktop logo (inside sidebar-width column) */}
          <div className="hidden md:flex w-60 shrink-0 items-center px-5 border-r border-white/[0.07] h-full">
            <WikrenaLogo variant="light-bg" href="/dashboard" height={26} />
          </div>

          {/* Mobile: hamburger + logo — strictly sized, never grows */}
          <div className="flex md:hidden items-center gap-2 pl-3 pr-2 h-full shrink-0">
            <button
              onClick={onMenuClick}
              aria-label="Open menu"
              className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0">
              <span className="w-[17px] h-[1.5px] bg-current rounded-full" />
              <span className="w-[12px] h-[1.5px] bg-current rounded-full self-start" />
              <span className="w-[17px] h-[1.5px] bg-current rounded-full" />
            </button>
            <div className="shrink-0">
              <WikrenaLogo variant="light-bg" href="/dashboard" height={19} />
            </div>
          </div>

          {/* ── Centre: desktop nav links ────────────────────────────────── */}
          <nav className="hidden md:flex items-center h-full px-3 gap-0.5 flex-1">
            {NAV_SECTIONS.map(s => {
              const active = isActive(s)
              return (
                <Link key={s.id} href={s.href}
                  className={cn(
                    "flex items-center gap-1.5 h-full px-4 text-[13px] font-medium transition-all border-b-2",
                    active
                      ? "text-white border-teal-400"
                      : "text-white/50 border-transparent hover:text-white/80 hover:border-white/20"
                  )}>
                  <s.icon className="w-3.5 h-3.5 shrink-0" />
                  {s.label}
                </Link>
              )
            })}
          </nav>

          {/* ── Right: controls ──────────────────────────────────────────── */}
          {/*
            CRITICAL MOBILE RULE:
            This flex row must NEVER overflow.
            - Search: icon-only on mobile (w-8). When active, it expands as a
              fixed overlay so it doesn't push anything.
            - Streak + XP: hidden until lg
            - Bell: always shown (w-8)
            - Avatar: always shown, name text hidden on xs
          */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto pr-2 sm:pr-3">

            {/* Search */}
            {searching ? (
              /* Active search — overlays the nav on mobile as fixed */
              <>
                {/* Mobile: full-width fixed overlay below header */}
                <div className="fixed inset-x-0 top-14 z-50 md:hidden px-3 pt-2 pb-3 bg-[#0a192f] border-b border-white/[0.07] shadow-xl">
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5">
                    <Search className="w-4 h-4 text-teal-400 shrink-0" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search courses, topics..."
                      className="flex-1 text-sm text-white placeholder:text-white/30 outline-none bg-transparent"
                    />
                    <button onClick={() => { setSearching(false); setQuery("") }}
                      className="text-white/40 hover:text-white transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Desktop: inline expanded input */}
                <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 w-56 lg:w-64">
                  <Search className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search courses, topics..."
                    className="flex-1 text-sm text-white placeholder:text-white/30 outline-none bg-transparent min-w-0"
                  />
                  <button onClick={() => { setSearching(false); setQuery("") }}
                    className="text-white/30 hover:text-white/70 transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Mobile: still show the search icon as "active" indicator */}
                <button
                  onClick={() => { setSearching(false); setQuery("") }}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-teal-400 bg-white/10 transition-all shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Desktop: full pill */}
                <button onClick={() => setSearching(true)}
                  className="hidden md:flex items-center gap-2 text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all w-36 lg:w-44">
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs flex-1 text-left">Search...</span>
                  <kbd className="text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/30 hidden lg:block">⌘K</kbd>
                </button>
                {/* Mobile: icon only */}
                <button onClick={() => setSearching(true)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0">
                  <Search className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Streak pill — lg+ only */}
            {streak > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/15 border border-orange-500/25 rounded-xl ml-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" fill="currentColor" />
                <span className="text-xs font-bold text-orange-300 font-mono">{streak}</span>
              </div>
            )}

            {/* XP + Level — lg+ only */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl ml-0.5">
              <span className="text-sm leading-none">{level.icon}</span>
              <div>
                <div className="text-[10px] text-white/40 font-mono leading-none mb-1">{level.name}</div>
                <div className="w-14 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#2ec4b6,#ff6b3d)" }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-teal-400 ml-0.5">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-bold font-mono">{totalXp.toLocaleString()}</span>
              </div>
            </div>

            {/* ── Bell + notification dropdown ───────────────────────────── */}
            <div ref={notifRef} className="relative shrink-0">
              <button
                onClick={() => { setNotifOpen(v => !v); setUserOpen(false) }}
                className={cn(
                  "relative w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                  notifOpen ? "bg-white/15 text-white" : "text-white/50 hover:text-white hover:bg-white/10"
                )}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full ring-[1.5px] ring-[#0a192f]" />
                )}
              </button>

              {notifOpen && (
                <>
                  {/* MOBILE panel — fixed, full-width, guaranteed not to clip */}
                  <div className="md:hidden fixed inset-x-3 top-[58px] z-[70] bg-[#0d2140] border border-white/10 rounded-2xl shadow-2xl">
                    <div className="max-h-[70vh] overflow-y-auto rounded-2xl">
                      <NotifPanel notifs={notifs} onMarkRead={markRead} onClose={() => setNotifOpen(false)} />
                    </div>
                  </div>
                  {/* DESKTOP panel — standard absolute dropdown */}
                  <div className="hidden md:block absolute right-0 top-[calc(100%+8px)] w-80 z-[70] bg-[#0d2140] border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                    <NotifPanel notifs={notifs} onMarkRead={markRead} onClose={() => setNotifOpen(false)} />
                  </div>
                </>
              )}
            </div>

            {/* ── Avatar + user dropdown ─────────────────────────────────── */}
            <div ref={userRef} className="relative shrink-0">
              <button
                onClick={() => { setUserOpen(v => !v); setNotifOpen(false) }}
                className={cn(
                  "flex items-center gap-1.5 pl-1.5 pr-1.5 sm:pr-2.5 py-1.5 rounded-xl transition-all",
                  userOpen ? "bg-white/15" : "hover:bg-white/10"
                )}>
                {/* Avatar */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-[#0a192f] text-xs font-black shrink-0 select-none">
                  {initials}
                </div>
                {/* Name + level text — only on sm+ */}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[68px]">
                    {displayName.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-white/30 font-mono leading-tight">
                    {level.icon} {level.name}
                  </div>
                </div>
              </button>

              {userOpen && (
                <>
                  {/* MOBILE panel — fixed, full-width */}
                  <div className="md:hidden fixed inset-x-3 top-[58px] z-[70] bg-[#0d2140] border border-white/10 rounded-2xl shadow-2xl">
                    <div className="max-h-[85vh] overflow-y-auto rounded-2xl">
                      <UserPanel
                        displayName={displayName}
                        userEmail={userEmail}
                        initials={initials}
                        level={level}
                        totalXp={totalXp}
                        progressPct={progressPct}
                        onClose={() => setUserOpen(false)}
                        onSignOut={signOut}
                      />
                    </div>
                  </div>
                  {/* DESKTOP panel */}
                  <div className="hidden md:block absolute right-0 top-[calc(100%+8px)] w-64 z-[70] bg-[#0d2140] border border-white/10 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
                    <UserPanel
                      displayName={displayName}
                      userEmail={userEmail}
                      initials={initials}
                      level={level}
                      totalXp={totalXp}
                      progressPct={progressPct}
                      onClose={() => setUserOpen(false)}
                      onSignOut={signOut}
                    />
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  )
}

// ── NOTIFICATION PANEL ────────────────────────────────────────────────────────
function NotifPanel({ notifs, onMarkRead, onClose }: {
  notifs:     Notif[]
  onMarkRead: () => void
  onClose:    () => void
}) {
  const unread = notifs.filter(n => n.unread).length

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] sticky top-0 bg-[#0d2140] z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">Notifications</span>
          {unread > 0 && (
            <span className="text-[10px] font-black bg-teal-500 text-white px-1.5 py-0.5 rounded-full leading-none">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={onMarkRead}
            className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Items */}
      {notifs.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-sm text-white/40">No notifications yet</p>
          <p className="text-xs text-white/25 mt-1">Complete a lesson to see activity here</p>
        </div>
      ) : (
        <div>
          {notifs.map((n, i) => (
            <a key={i} href={n.href ?? "#"} onClick={onClose}
              className={cn(
                "flex gap-3 px-4 py-3.5 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.06] transition-colors",
                n.unread && "bg-teal-500/[0.05]"
              )}>
              <span className="text-xl shrink-0 leading-none mt-0.5">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-white leading-tight">{n.title}</span>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />}
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{n.desc}</p>
              </div>
              <span className="text-[10px] text-white/25 font-mono shrink-0 mt-0.5 whitespace-nowrap">{n.time}</span>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.07] sticky bottom-0 bg-[#0d2140]">
        <Link href="/learn/progress" onClick={onClose}
          className="text-xs text-white/35 hover:text-white/60 transition-colors text-center block">
          View all activity →
        </Link>
      </div>
    </>
  )
}

// ── USER PANEL ────────────────────────────────────────────────────────────────
function UserPanel({ displayName, userEmail, initials, level, totalXp, progressPct, onClose, onSignOut }: {
  displayName: string
  userEmail:   string
  initials:    string
  level:       { name: string; icon: string; minXp: number }
  totalXp:     number
  progressPct: number
  onClose:     () => void
  onSignOut:   () => void
}) {
  return (
    <>
      {/* Profile header */}
      <div className="px-4 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-[#0a192f] font-black shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-white truncate">{displayName}</div>
            <div className="text-xs text-white/35 truncate">{userEmail}</div>
          </div>
        </div>
        {/* XP progress */}
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{level.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/45 font-mono">{level.name}</span>
              <span className="text-[10px] text-teal-400 font-mono font-bold">{totalXp.toLocaleString()} XP</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#2ec4b6,#ff6b3d)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="p-1.5">
        {[
          { href: "/profile",          icon: User,          label: "My Profile",       sub: "View your public page"    },
          { href: "/learn/progress",   icon: BarChart2,     label: "My Progress",      sub: "XP, badges, completions"  },
          { href: "/career/portfolio", icon: GraduationCap, label: "My Portfolio",     sub: "Projects you have built"  },
          { href: "/settings",         icon: Settings,      label: "Account Settings", sub: null                       },
        ].map(item => (
          <Link key={item.href} href={item.href} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/55 hover:text-white hover:bg-white/[0.07] transition-all group">
            <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors">
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold leading-tight">{item.label}</div>
              {item.sub && <div className="text-[10px] text-white/25 mt-0.5">{item.sub}</div>}
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
          </Link>
        ))}

        <div className="h-px bg-white/[0.06] my-1.5 mx-1" />

        <button onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group">
          <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center shrink-0 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">Sign out</span>
        </button>
      </div>

      <div className="px-4 py-3 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/20 font-mono text-center">
          Wikrena Academy · Africa&apos;s Data Platform
        </p>
      </div>
    </>
  )
}
