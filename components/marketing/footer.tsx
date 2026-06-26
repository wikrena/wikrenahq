import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { WikrenaLogo, WikrenaIcon } from "@/components/app-shell/wikrena-logo";

const CONTACT = [
  { icon: Mail, value: "hello@wikrena.com", href: "mailto:hello@wikrena.com" },
  { icon: Phone, value: "+234 905 959 3334", href: "tel:+2349059593334" },
  { icon: MapPin, value: "12 Achi Street, Independence Layout, Enugu, Nigeria", href: undefined },
];

const COLUMNS = [
  {
    title: "Learn",
    links: [
      { label: "Data Analytics", href: "/paths/data-analytics" },
      { label: "Research Analysis with SPSS", href: "/paths/research-spss" },
      { label: "AI Automation", href: "/paths/ai-automation" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Africa Data Lab", href: "/africa-lab" },
      { label: "Certifications", href: "/certifications" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative bg-navy-900 text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

      {/* Oversized watermark mark */}
      <div className="absolute -bottom-16 -right-16 opacity-[0.04] pointer-events-none">
        <WikrenaIcon size={320} href={undefined} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-5">
              <WikrenaLogo variant="dark-bg" href="/" height={30} />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Building Africa&apos;s data and AI infrastructure, one
              professional at a time.
            </p>
            <div className="space-y-2.5">
              {CONTACT.map((c) => {
                const content = (
                  <span className="flex items-center gap-2 text-xs font-mono text-white/40">
                    <c.icon className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                    {c.value}
                  </span>
                );
                return c.href ? (
                  <Link key={c.value} href={c.href} className="block hover:text-white transition-colors">
                    {content}
                  </Link>
                ) : (
                  <div key={c.value}>{content}</div>
                );
              })}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-mono text-white/30 tracking-wide mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/30">
            © 2026 Wikrena Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse-dot" />
            <span className="text-xs font-mono text-white/30">
              Africa&apos;s Data & AI Infrastructure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
