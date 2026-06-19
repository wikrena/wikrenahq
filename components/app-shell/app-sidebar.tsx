"use client"

import { useState } from "react"
import { WikrenaLogo } from "./wikrena-logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Library, TrendingUp, ChevronDown, X,
  BookOpen, Map, FolderKanban, Code2, ClipboardCheck,
  Briefcase, FileText, MessageSquare, Star, Users,
  Trophy, MessageCircle, GitPullRequest,
  Database, FlaskConical, Bot, Layers, Target,
  GraduationCap, Settings, Shield, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Sidebar config ────────────────────────────────────────────────────────────
const SIDEBAR_CONFIG: Record<string, { sections: Section[] }> = {
  learn: {
    sections: [
      {
        items: [
          { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard" },
          { icon: Library,         label: "My Library",  href: "/learn/library" },
          { icon: TrendingUp,      label: "Progress",    href: "/learn/progress" },
          { icon: Trophy,          label: "Leaderboard", href: "/leaderboard", badge: "NEW", badgeColor: "bg-teal-500 text-white" },
        ]
      },
      {
        label: "LEARN",
        items: [
          { icon: Map,             label: "Tracks",      href: "/learn/tracks",           hasDropdown: true },
          { icon: BookOpen,        label: "Courses",     href: "/courses" },
          { icon: Code2,           label: "Practice",    href: "/challenges" },
          { icon: ClipboardCheck,  label: "Assessments", href: "/practice/assessments",   badge: "Soon", badgeColor: "bg-neutral-100 text-neutral-400" },
        ]
      },
      {
        label: "APPLY",
        items: [
          { icon: Database,        label: "Africa Data Lab", href: "/africa-lab" },
          { icon: FolderKanban,    label: "Projects",        href: "/learn/projects" },
          { icon: FlaskConical,    label: "Challenges",      href: "/challenges" },
          { icon: Target,          label: "Data Battles",    href: "/challenges",           badge: "Soon", badgeColor: "bg-neutral-100 text-neutral-400" },
        ]
      },
    ]
  },
  practice: {
    sections: [{
      items: [
        { icon: Code2,          label: "Challenges",  href: "/challenges" },
        { icon: ClipboardCheck, label: "Assessments", href: "/practice/assessments" },
        { icon: FlaskConical,   label: "Workspace",   href: "/workspace" },
        { icon: Database,       label: "Africa Lab",  href: "/africa-lab" },
      ]
    }]
  },
  career: {
    sections: [{
      items: [
        { icon: Briefcase,     label: "Job Board",      href: "/career" },
        { icon: FolderKanban,  label: "My Portfolio",   href: "/career/portfolio" },
        { icon: FileText,      label: "Resume Review",  href: "/career/resume" },
        { icon: MessageSquare, label: "Mock Interviews", href: "/career/interviews" },
        { icon: Users,         label: "Mentors",        href: "/career/mentors" },
        { icon: Star,          label: "Placement Wall", href: "/placed" },
      ]
    }]
  },
  community: {
    sections: [{
      items: [
        { icon: MessageCircle, label: "Forums",       href: "/community" },
        { icon: Users,         label: "Study Groups", href: "/community",         badge: "Soon", badgeColor: "bg-neutral-100 text-neutral-400" },
        { icon: Trophy,        label: "Leaderboard",  href: "/leaderboard" },
        { icon: GitPullRequest,label: "Peer Review",  href: "/community/peer-review" },
      ]
    }]
  },
  "africa-lab": {
    sections: [{
      items: [
        { icon: Database,     label: "Datasets",   href: "/africa-lab" },
        { icon: FlaskConical, label: "Workspace",  href: "/workspace" },
        { icon: Code2,        label: "Challenges", href: "/challenges" },
        { icon: FolderKanban, label: "Projects",   href: "/learn/projects" },
      ]
    }]
  },
}

type NavItem = {
  icon:         React.ElementType
  label:        string
  href:         string
  badge?:       string
  badgeColor?:  string
  hasDropdown?: boolean
}

type Section = {
  label?: string
  items:  NavItem[]
}

const TRACK_ITEMS = [
  { label: "Career Tracks", href: "/learn/tracks/career", sub: "End-to-end programs"  },
  { label: "Skill Tracks",  href: "/learn/tracks/skill",  sub: "Focused skill bundles" },
]

function TrackDropdown({ pathname }: { pathname: string }) {
  const isActive = pathname.startsWith("/learn/tracks")
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button onClick={() => setOpen(v => !v)}
        className={cn("nav-item w-full", isActive && "nav-item-active")}>
        <Map className={cn("nav-item-icon w-4 h-4 shrink-0", isActive && "text-teal-600")} />
        <span className="flex-1 text-left text-[13px]">Tracks</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-0.5 ml-3 pl-3 border-l-2 border-[#E5E9F0] space-y-0.5 animate-fade-in">
          {TRACK_ITEMS.map(t => {
            const active = pathname.startsWith(t.href)
            return (
              <Link key={t.href} href={t.href}
                className={cn("block px-3 py-2 rounded-lg transition-colors",
                  active ? "bg-teal-50 text-teal-700" : "text-neutral-500 hover:text-navy-800 hover:bg-[#F0F4F8]"
                )}>
                <div className={cn("text-[13px] font-medium", active && "font-semibold")}>{t.label}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{t.sub}</div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
  if (item.hasDropdown) return <TrackDropdown pathname={pathname} />
  return (
    <Link href={item.href} className={cn("nav-item relative", active && "nav-item-active")}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-500 rounded-r-full" />}
      <item.icon className={cn("nav-item-icon w-4 h-4 shrink-0", active && "text-teal-600")} />
      <span className="flex-1 text-[13px]">{item.label}</span>
      {item.badge && (
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full font-code shrink-0", item.badgeColor)}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

interface Props {
  activeSection?: string
  userRole?:      string
  isOpen:         boolean
  onClose:        () => void
}

export function AppSidebar({ activeSection, userRole, isOpen, onClose }: Props) {
  const pathname = usePathname()
  const config   = SIDEBAR_CONFIG[activeSection ?? "learn"] ?? SIDEBAR_CONFIG["learn"]

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Mobile-only close button row */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#E5E9F0]">
        <WikrenaLogo variant="dark-bg" href="/home" height={22} />
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
        {config.sections.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-4" : ""}>
            {section.label && (
              <div className="px-3 mb-1.5 mt-1 text-[10px] font-code font-bold text-neutral-400 uppercase tracking-widest">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.href + item.label} item={item} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin/instructor links */}
      {userRole && ["ADMIN","INSTRUCTOR","TEACHER"].includes(userRole) && (
        <div className="px-3 pt-2 pb-1 border-t border-[#E5E9F0]">
          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-1">
            {userRole === "ADMIN" ? "ADMIN" : "INSTRUCTOR"}
          </div>
          <div className="space-y-0.5">
            <Link href="/admin/content"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-navy-50 hover:text-navy-700 transition-all">
              <BookOpen className="w-3.5 h-3.5" /> Course Manager
            </Link>
            {userRole === "ADMIN" && (
              <Link href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-navy-50 hover:text-navy-700 transition-all">
                <GraduationCap className="w-3.5 h-3.5" /> Admin Panel
              </Link>
            )}
            {userRole === "INSTRUCTOR" && (
              <Link href="/instructor/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-navy-50 hover:text-navy-700 transition-all">
                <GraduationCap className="w-3.5 h-3.5" /> My Courses
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Wren AI pinned */}
      <div className="px-3 pb-3 pt-2 border-t border-[#E5E9F0]">
        <Link href="/ai-tutor"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group border",
            pathname === "/ai-tutor"
              ? "bg-navy-800 border-navy-700"
              : "bg-gradient-to-r from-navy-50 to-teal-50/60 border-teal-200 hover:border-teal-300"
          )}>
          <Bot className={cn("w-4 h-4 shrink-0", pathname === "/ai-tutor" ? "text-teal-400" : "text-teal-600")} />
          <div className="flex-1 min-w-0">
            <div className={cn("text-[13px] font-semibold leading-none mb-0.5", pathname === "/ai-tutor" ? "text-white" : "text-navy-800")}>
              Ask Wren
            </div>
            <div className={cn("text-[10px] font-code", pathname === "/ai-tutor" ? "text-white/40" : "text-neutral-400")}>
              AI tutor · Powered by Claude
            </div>
          </div>
          <span className="text-[9px] font-code bg-coral-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">AI</span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ── DESKTOP: always visible fixed sidebar ──────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-60 border-r border-[#E5E9F0] z-30 flex-col">
        {sidebarContent}
      </aside>

      {/* ── MOBILE: overlay drawer ─────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        {sidebarContent}
      </aside>
    </>
  )
}
