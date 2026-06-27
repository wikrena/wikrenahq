import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hexagon, Mail } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or may have moved.",
};

export default function NotFound() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-navy-900">
          {/* Static texture + glows, matching the homepage hero */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.14] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.coral.500),transparent_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900" />
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center justify-center gap-2 mb-6 text-[11px] font-mono text-white/40">
                <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                Error 404
              </div>
              <h1 className="font-display font-black tracking-tight leading-[1.1] mb-5 text-white text-3xl sm:text-4xl md:text-[2.75rem]">
                We Couldn&apos;t Find That Page.
              </h1>
              <p className="text-base sm:text-lg text-white/55 max-w-lg mx-auto mb-10 leading-relaxed">
                The link might be broken, or the page may have been moved.
                Here&apos;s how to get back on track.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
                <Link
                  href="/"
                  className="btn-shine group inline-flex items-center gap-2.5 sm:gap-3 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100"
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
                <Link
                  href="/academy"
                  className="group inline-flex items-center gap-2.5 sm:gap-3 bg-white/5 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  Explore the Academy
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <Link
                href="mailto:hello@wikrena.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-teal-400" />
                Still stuck? Email hello@wikrena.com
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
