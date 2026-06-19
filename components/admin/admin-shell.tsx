"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Plus,
  Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { cn } from "@/lib/utils";

const NAV = [
  {
    section: "Main",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/content", icon: BookOpen, label: "Content" },
    ],
  },
  {
    section: "Platform",
    items: [
      { href: "/admin/schools", icon: Building2, label: "Schools" },
      { href: "/admin/instructors", icon: GraduationCap, label: "Instructors" },
      { href: "/admin/payments", icon: CreditCard, label: "Payments" },
      { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
    ],
  },
];

interface Course {
  id: string;
  title: string;
  is_published: boolean;
}

interface Props {
  children: React.ReactNode;
  adminName?: string;
  adminEmail?: string;
}

export function AdminShell({ children, adminName, adminEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("INSTRUCTOR");
  const [inviteName, setInviteName] = useState("");
  const [inviteCourses, setInviteCourses] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const firstName = adminName?.split(" ")[0] ?? "Admin";

  useEffect(() => {
    if (!inviteOpen || courses.length > 0) return;
    setLoadingCourses(true);
    fetch("/api/admin/courses-list")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setCourses(d.data);
      })
      .catch(() => null)
      .finally(() => setLoadingCourses(false));
  }, [inviteOpen]);

  function closeInvite() {
    setInviteOpen(false);
    setInviteMsg(null);
    setInviteEmail("");
    setInviteName("");
    setInviteCourses([]);
    setInviteRole("INSTRUCTOR");
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function toggleCourse(id: string) {
    setInviteCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
          name: inviteName.trim(),
          course_ids: inviteCourses.length > 0 ? inviteCourses : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteMsg({
          type: "error",
          text: data.error ?? "Failed to send invitation",
        });
      } else {
        setInviteMsg({
          type: "success",
          text: `Invitation sent to ${inviteEmail}`,
        });
        setTimeout(closeInvite, 2500);
      }
    } catch {
      setInviteMsg({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setInviting(false);
    }
  }


  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.07] shrink-0">
          <WikrenaLogo variant="light-bg" href="/admin/dashboard" height={24} />
          <span className="text-[10px] font-bold text-white/25 font-mono uppercase tracking-widest">
            Admin
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="px-3 mb-1.5 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                {group.section}
              </div>
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-teal-500/15 text-teal-400"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        active
                          ? "text-teal-400"
                          : "text-white/30 group-hover:text-white/50",
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <ChevronRight className="w-3 h-3 text-teal-400/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/[0.07] p-3 space-y-1">
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
              pathname === "/admin/settings"
                ? "bg-teal-500/15 text-teal-400"
                : "text-white/40 hover:text-white/70 hover:bg-white/5",
            )}
          >
            <Settings className="w-4 h-4 shrink-0 text-white/30" />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-4 h-4 shrink-0 text-white/30 rotate-180" />
            Back to site
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
          <div className="mt-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-xs font-semibold text-white/60 truncate">
              {adminName ?? "Admin"}
            </div>
            <div className="text-[10px] text-white/25 truncate">
              {adminEmail}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F0F4F8]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-[#0a192f] flex-col shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 bg-[#0a192f] flex flex-col h-full z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#E5E9F0] sticky top-0 z-20 flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-neutral-400"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-xs hidden sm:flex items-center gap-2 h-8 bg-neutral-50 border border-neutral-200 rounded-lg px-3">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-xs text-neutral-400">
              Search users, courses...
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Invite User
            </button>
            <Link
              href="/admin/content"
              className="hidden sm:flex items-center gap-1.5 bg-[#0a192f] hover:bg-[#0d2140] text-white text-xs font-bold px-3 py-2 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Course
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
              {firstName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-bold text-navy-800">Invite a User</h2>
              <button
                onClick={closeInvite}
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={sendInvite} className="p-6 space-y-4">
              {inviteMsg && (
                <div
                  className={cn(
                    "text-sm px-4 py-3 rounded-xl border",
                    inviteMsg.type === "success"
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : "bg-red-50 text-red-700 border-red-200",
                  )}
                >
                  {inviteMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Amara Nwosu"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => {
                    setInviteRole(e.target.value);
                    setInviteCourses([]);
                  }}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                >
                  <option value="INSTRUCTOR">
                    Instructor — creates and publishes courses
                  </option>
                  <option value="SCHOOL">
                    School — manages cohorts and students
                  </option>
                  <option value="TEACHER">
                    Teacher — manages a school&apos;s courses
                  </option>
                  <option value="ADMIN">Admin — full platform access</option>
                </select>
              </div>

              {inviteRole === "INSTRUCTOR" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Assign to Courses{" "}
                      <span className="text-neutral-300">(optional)</span>
                    </label>
                    {inviteCourses.length > 0 && (
                      <span className="text-[11px] font-semibold text-teal-600">
                        {inviteCourses.length} selected
                      </span>
                    )}
                  </div>

                  {loadingCourses ? (
                    <div className="border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-400">
                      Loading courses...
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="border border-dashed border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-400 text-center">
                      No courses yet —{" "}
                      <Link
                        href="/admin/content"
                        onClick={closeInvite}
                        className="text-teal-600 font-semibold hover:underline"
                      >
                        create one first
                      </Link>
                    </div>
                  ) : (
                    <div className="border border-neutral-200 rounded-xl overflow-hidden">
                      {courses.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 cursor-pointer border-b border-neutral-50 last:border-0 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={inviteCourses.includes(c.id)}
                            onChange={() => toggleCourse(c.id)}
                            className="w-4 h-4 rounded border-neutral-300 accent-teal-500"
                          />
                          <span className="text-sm text-navy-800 flex-1">
                            {c.title}
                          </span>
                          {!c.is_published && (
                            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                              draft
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-neutral-400 mt-1.5">
                    Tick any number of courses. The instructor sees all selected
                    courses in their dashboard immediately after accepting the
                    invite.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                {inviting ? "Sending invitation..." : "Send Invitation Email"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
