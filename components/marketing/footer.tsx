import Link from "next/link";
import { WikrenaLogo, WikrenaIcon } from "@/components/app-shell/wikrena-logo";

export function MarketingFooter() {
  return (
    <footer className="bg-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-5">
              <WikrenaLogo variant="light-bg" href="/" height={30} />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Building Africa&apos;s data and AI infrastructure — one
              professional at a time.
            </p>
            <div className="space-y-1 text-xs font-mono text-white/30">
              <div>hello@wikrena.com</div>
              <div>+234 905 959 3334</div>
              <div>12 Achi Street, Enugu, Nigeria</div>
            </div>
          </div>

          {[
            {
              title: "Learn",
              links: [
                { label: "Data Analytics", href: "/paths/data-analytics" },
                {
                  label: "Research Analysis with SPSS",
                  href: "/paths/research-spss",
                },
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
                { label: "About Us", href: "https://wikrena.com/about-us" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "https://wikrena.com/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
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
