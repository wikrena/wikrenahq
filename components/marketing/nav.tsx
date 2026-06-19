"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, BookOpen, Zap, Users, Star, ChevronRight } from "lucide-react";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Academy", href: "/academy" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_FEATURES = [
  { icon: BookOpen, label: "Learn from Africa's best data instructors", color: "text-teal-400" },
  { icon: Zap, label: "Earn XP and build a verified portfolio", color: "text-amber-400" },
  { icon: Users, label: "Join 2,400+ African data professionals", color: "text-purple-400" },
  { icon: Star, label: "Land your first data role in 90 days", color: "text-coral-400" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", session.user.id)
        .single();
      setUserRole(data?.role ?? "STUDENT");
      setUserName(data?.name ?? null);
    });
  }, []);

  function getDashboardUrl(role: string) {
    const r = role.toUpperCase();
    if (r === "PARENT") return "/parent/dashboard";
    if (r === "SCHOOL" || r === "TEACHER") return "/school/dashboard";
    if (r === "ADMIN") return "/admin/dashboard";
    if (r === "INSTRUCTOR") return "/instructor/dashboard";
    return "/dashboard";
  }

  function getRoleLabel(role: string) {
    const r = role.toUpperCase();
    if (r === "PARENT") return "Parent";
    if (r === "SCHOOL") return "School";
    if (r === "ADMIN") return "Admin";
    if (r === "INSTRUCTOR") return "Instructor";
    return "Student";
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const linkClass = (active: boolean) =>
    cn(
      "relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
      active ? "text-navy-800" : "text-neutral-500 hover:text-navy-800",
    );

  return (
    <>
      {/* ── DESKTOP: floating pill nav ───────────────────────────────────── */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className={cn(
            "mx-auto transition-[max-width,padding] duration-500 ease-out",
            scrolled ? "max-w-3xl pt-3" : "max-w-5xl pt-5",
          )}
        >
          <nav
            className={cn(
              "relative pointer-events-auto flex items-center justify-between gap-6 rounded-full bg-white border border-neutral-200 transition-all duration-300",
              scrolled ? "shadow-card px-3 py-2" : "shadow-surface px-5 py-3",
            )}
          >
            {/* Gradient accent line — visible on scroll */}
            <div
              aria-hidden
              className={cn(
                "absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent transition-opacity duration-300",
                scrolled ? "opacity-60" : "opacity-0",
              )}
            />

            <WikrenaLogo variant="light-bg" href="/" height={24} />

            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} className={linkClass(active)}>
                    {link.label}
                  </Link>
                );
              })}
              {userRole && (
                <Link
                  href={getDashboardUrl(userRole)}
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-teal-500 hover:bg-teal-400 rounded-full transition-all"
                >
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ── MOBILE NAV ───────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 md:hidden bg-white transition-all duration-300",
          scrolled ? "shadow-[0_1px_0_0_rgb(0,0,0,0.08)] border-b border-neutral-200/80" : "border-b border-neutral-100",
        )}
      >
        <nav className="px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <WikrenaLogo variant="light-bg" href="/" height={28} />

          {userRole ? (
            <Link
              href={getDashboardUrl(userRole)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-teal-500 hover:bg-teal-400 rounded-xl transition-all"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </nav>
      </header>

      {/* ── MOBILE MENU ───────────────────────────────────── */}
      <div className={cn("fixed inset-0 z-50 md:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[88vw] max-w-sm flex flex-col bg-navy-800 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.08] shrink-0">
            <WikrenaLogo variant="dark-bg" href="/" height={24} />
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {userRole && userName && (
              <div className="mx-4 mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold text-sm">Hey, {userName.split(" ")[0]}</div>
                    <div className="text-white/40 text-xs mt-0.5">{getRoleLabel(userRole)} · Wikrena Academy</div>
                  </div>
                  <Link
                    href={getDashboardUrl(userRole)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                  >
                    Dashboard <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            <nav className="px-3 pt-4 pb-2 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors group"
                >
                  {link.label}
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                </Link>
              ))}
            </nav>

            <div className="mx-4 my-2 border-t border-white/[0.06]" />

            <div className="px-4 py-3 space-y-3">
              <div className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-1 mb-3">
                Why Wikrena
              </div>
              {MOBILE_FEATURES.map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon className={cn("w-3.5 h-3.5", f.color)} />
                  </div>
                  <span className="text-white/50 text-xs leading-relaxed">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
