import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Settings2,
  GraduationCap,
  Compass,
  BarChart3,
  Globe2,
  Handshake,
  Package,
  Target,
  RefreshCw,
  BookOpen,
  Landmark,
  Database,
  Quote,
  Star,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { FaqTabs } from "@/components/marketing/faq-tabs";
import { HomeHero } from "@/components/marketing/home-hero";
import { Reveal } from "@/components/marketing/reveal";
import { Parallax } from "@/components/marketing/parallax";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { ProgramShowcase } from "@/components/marketing/program-showcase";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wikrena Limited: Building Africa's Data & AI Infrastructure",
  description:
    "Wikrena is a data and AI company built for Africa-focused businesses. We help businesses make smarter decisions with their data, and we train the professionals who make that work happen.",
};

type Accent = "teal" | "coral" | "navy";

const ACCENT: Record<Accent, { iconWrap: string; icon: string }> = {
  teal: {
    iconWrap: "bg-teal-50 border border-teal-200",
    icon: "text-teal-600",
  },
  coral: {
    iconWrap: "bg-coral-50 border border-coral-200",
    icon: "text-coral-600",
  },
  navy: {
    iconWrap: "bg-navy-50 border border-navy-200",
    icon: "text-navy-700",
  },
};

const ECOSYSTEM: {
  key: "os" | "academy" | "consulting";
  icon: typeof Settings2;
  title: string;
  tag: string;
  desc: string;
  cta: string;
  href: string;
  external: boolean;
  accent: Accent;
}[] = [
  {
    key: "os",
    icon: Settings2,
    title: "Wikrena OS",
    tag: "For African Service Businesses",
    desc: "The operating system for African service businesses to run with clarity, structure, and control. Manage clients, protect your scope, get paid on time, and build the track record that takes you to the next level, with offline mode built in by design.",
    cta: "Start for free",
    href: "https://os.wikrena.com",
    external: true,
    accent: "navy",
  },
  {
    key: "academy",
    icon: GraduationCap,
    title: "Wikrena Academy",
    tag: "For Professionals",
    desc: "Practical programs. Real outcomes. Built for Africans who are serious about what comes next for their career. We support you from your first lesson to your first role or promotion, not just people who want a certificate.",
    cta: "Explore the Academy",
    href: "/academy",
    external: false,
    accent: "teal",
  },
  {
    key: "consulting",
    icon: Compass,
    title: "Wikrena Consulting",
    tag: "For Growing Businesses",
    desc: "We work directly with businesses on data strategy, analysis, reporting, and AI workflow implementation. You bring the business problem. We bring the clarity. Every engagement ends with something you can act on immediately.",
    cta: "Explore our Services",
    href: "/services",
    external: false,
    accent: "coral",
  },
];

const SERVICES: {
  key: "analysis" | "strategy" | "training";
  icon: typeof Compass;
  title: string;
  desc: string;
  items: string[];
  badge: string | null;
}[] = [
  {
    key: "analysis",
    icon: BarChart3,
    title: "Data Analysis & Reporting",
    desc: "We take your raw numbers from spreadsheets, CRM exports, sales data and other sources, and turn them into clear, visual, decision-ready reports your leadership team will actually use.",
    items: ["A custom dashboard", "A plain-language analysis report", "A presentation of findings to your team"],
    badge: "Most Requested",
  },
  {
    key: "strategy",
    icon: Compass,
    title: "Data Strategy & Advisory",
    desc: "Before dashboards or reports, you need to know what questions you're actually trying to answer. We help you define a data strategy tied directly to your growth goals.",
    items: ["A clear data strategy", "The right KPIs", "A governance framework your team can actually use"],
    badge: null,
  },
  {
    key: "training",
    icon: GraduationCap,
    title: "Corporate Data Training",
    desc: "Your team has data. They just don't know how to work with it. We bring practical training directly to your organisation, tailored to your industry, tools, and skill level.",
    items: ["A trained team", "Custom learning materials built on your own data", "30 days of post-training support"],
    badge: null,
  },
];

const WHY_WIKRENA: {
  icon: typeof Globe2;
  title: string;
  desc: string;
  accent: Accent;
}[] = [
  {
    icon: Globe2,
    title: "Africa-First by Design",
    desc: "We work with real Nigerian and African business data, not recycled global templates. We understand the realities of this market, its constraints, and where the real opportunities lie.",
    accent: "teal",
  },
  {
    icon: Handshake,
    title: "Senior-Level Delivery",
    desc: "Every engagement is handled by an experienced team. No handoffs to inexperienced staff. No layers slowing things down. Just clear thinking and solid execution.",
    accent: "coral",
  },
  {
    icon: Package,
    title: "Practical Over Theoretical",
    desc: "Every engagement and every program produces something real: a dashboard, a strategy document, a portfolio project. Not reports that gather dust or certificates without substance.",
    accent: "navy",
  },
  {
    icon: GraduationCap,
    title: "Learn. Build. Get Placed.",
    desc: "Our Academy goes beyond teaching. You build real projects, strengthen your profile, and get placement support. The outcome is what matters.",
    accent: "coral",
  },
  {
    icon: Target,
    title: "Industry-Specific Focus",
    desc: "Fintech, Healthcare, and Retail tracks built for real job demands in Africa. Not generic data skills that could apply anywhere and therefore apply nowhere.",
    accent: "navy",
  },
  {
    icon: RefreshCw,
    title: "End-to-End and Beyond",
    desc: "We handle everything from understanding your data problem to deploying the solution and training your team to maintain it. We do not disappear after delivery.",
    accent: "teal",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The training was intense yet rewarding, and the support from the instructors and community keeps me motivated. I can't wait to apply these skills and transform my career!",
    name: "Mrs Ifeoma Eneh",
    role: "Senior Systems Analyst · NCAA",
    initials: "IE",
    color: "bg-coral-500",
  },
  {
    quote:
      "I started unsure, but Wikrena Academy changed that. Through practical, hands-on training, I learned to confidently use Excel, MySQL, and Power BI to solve real problems. It shifted me from just learning to actually thinking and working with data.",
    name: "Ruth Ugwu",
    role: "Clinical Dietitian · Safari Pharmacy",
    initials: "RU",
    color: "bg-teal-500",
  },
  {
    quote:
      "Training at Wikrena feels like learning from someone who has actually been where you are. Chris and the team treat you like a professional in training, not just a student in a classroom, and that shift makes all the difference.",
    name: "Samuel Ifebuche",
    role: "Radiologist · Port Harcourt",
    initials: "SI",
    color: "bg-navy-800",
  },
];


export default function HomePage() {
  return (
    <div className="home-rebrand">
      <MarketingNav />
      <main>
        <HomeHero />

        {/* ── WHO WE ARE ───────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Image column */}
              <Reveal className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-teal-500 pointer-events-none" />
                  <Parallax offset={16}>
                    <div
                      className="relative aspect-[4/3] overflow-hidden border border-navy-700 shadow-brand-lg"
                      style={{ clipPath: "polygon(0 0, calc(100% - 56px) 0%, 100% 56px, 100% 100%, 0% 100%)" }}
                    >
                      <Image
                        src="/about-us-section.jpg"
                        alt="The Wikrena team reviewing data together"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-navy-900/10" />
                    </div>
                  </Parallax>

                  {/* Floating credibility card */}
                  <div className="absolute -bottom-6 -right-6 sm:-right-10 w-52 rounded-2xl bg-white border border-neutral-200 shadow-float p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-xl text-navy-800 leading-none">
                          <AnimatedCounter value={147} suffix="+" />
                        </div>
                        <div className="text-[11px] text-neutral-500">Professionals Trained</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Text column */}
              <Reveal delay={0.1} className="order-1 lg:order-2">
                <div className="eyebrow">Who We Are</div>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-5">
                  We&apos;re Not Your Typical Data Company.
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-4">
                  Wikrena is a data and AI company with one mission: to build
                  the infrastructure Africa&apos;s next economy needs to grow
                  with intelligence and precision. We work with businesses to
                  transform how they use data, and we train the professionals
                  who will power that transformation across the continent.
                  Everything we do is hands-on, Africa-specific, and built to
                  produce real outcomes.
                </p>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
                  <span className="text-navy-800 font-semibold">
                    Not reports that gather dust. Not certificates with
                    nothing behind them.
                  </span>{" "}
                  Businesses that make better decisions. Professionals who
                  actually get placed. A data culture that compounds over
                  time. That&apos;s what we&apos;re building, and we&apos;re
                  just getting started.
                </p>
                <Link
                  href="/about-us"
                  className="btn-shine group inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  About Us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── ECOSYSTEM ────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-neutral-50" id="ecosystem">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-16">
              <div className="eyebrow">The Wikrena Ecosystem</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-4">
                Three Ways We Serve Africa.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base">
                Every part of Wikrena is designed to feed the others: services,
                education, and technology working as one. That is not a
                coincidence. That is how Wikrena is designed.
              </p>
            </Reveal>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
              {ECOSYSTEM.map((e, i) => {
                const a = ACCENT[e.accent];
                return (
                  <Fragment key={e.title}>
                    <Reveal delay={i * 0.1} className="flex-1 min-w-0">
                      <div
                        className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col h-full`}
                      >
                        <div
                          className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.10] ${a.icon} bg-current`}
                          style={{ filter: "blur(28px)" }}
                        />

                        {/* Mini product-preview mockup */}
                        <div className={`relative rounded-2xl p-3.5 sm:p-4 mb-6 ${e.key === "os" ? "bg-navy-800" : a.iconWrap}`}>
                          {e.key === "os" && (
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-3">
                                <span>Scope</span>
                                <span>Invoice</span>
                                <span>Paid</span>
                              </div>
                              <div className="flex items-center">
                                {[0, 1, 2].map((idx) => (
                                  <Fragment key={idx}>
                                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                                      <CheckCircle2 className="w-3 h-3 text-navy-900" />
                                    </div>
                                    {idx < 2 && <div className="flex-1 h-0.5 bg-teal-500/40" />}
                                  </Fragment>
                                ))}
                              </div>
                            </div>
                          )}
                          {e.key === "academy" && (
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono text-navy-700 mb-2">
                                <span>Module 8/12</span>
                                <span className="text-teal-600 font-bold">+240 XP</span>
                              </div>
                              <div className="xp-bar">
                                <div className="xp-fill" style={{ width: "72%" }} />
                              </div>
                            </div>
                          )}
                          {e.key === "consulting" && (
                            <div className="flex items-end gap-1.5 h-12">
                              {[35, 55, 45, 70, 60, 85].map((h, idx) => (
                                <div
                                  key={idx}
                                  className="flex-1 rounded-t-sm bg-gradient-to-t from-coral-500/30 to-coral-500"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                          )}
                          <div className={`absolute -bottom-3 -right-1 w-9 h-9 rounded-xl bg-white border border-neutral-200 shadow-lift flex items-center justify-center`}>
                            <e.icon className={`w-4 h-4 ${a.icon}`} />
                          </div>
                        </div>

                        <div className="text-[11px] font-mono tracking-wide text-neutral-400 mb-2">
                          {e.tag}
                        </div>
                        <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-navy-800 mb-3">{e.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed mb-7 flex-1">{e.desc}</p>
                        <Link
                          href={e.href}
                          target={e.external ? "_blank" : undefined}
                          rel={e.external ? "noopener noreferrer" : undefined}
                          className={`relative inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all group ${a.icon}`}
                        >
                          {e.cta}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                        </Link>
                      </div>
                    </Reveal>

                    {i < ECOSYSTEM.length - 1 && (
                      <div className="hidden md:flex items-center justify-center shrink-0">
                        <div className="w-9 h-9 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-14">
              <div className="eyebrow">What We Do</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-4">
                What We Actually Do For Your Business.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base">
                Three focused services. No inflated list. No overpromising.
                Just what we can deliver with excellence right now.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {SERVICES.map((s, i) => {
                const featured = i === 0;
                const Icon = s.icon;
                return (
                  <Reveal key={s.title} delay={i * 0.1}>
                    <div
                      className={
                        featured
                          ? "relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-navy-800 flex flex-col shadow-brand-lg h-full"
                          : "relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 flex flex-col hover:shadow-float hover:-translate-y-1 transition-all duration-300 h-full"
                      }
                    >
                      <div
                        className={
                          featured
                            ? "absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-[0.18] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]"
                            : "absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-[0.08] bg-[radial-gradient(circle,theme(colors.navy.500),transparent_70%)]"
                        }
                      />
                      {s.badge && (
                        <span
                          className={
                            featured
                              ? "relative inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[11px] font-mono tracking-wide px-3 py-1.5 rounded-full self-start mb-6"
                              : "relative inline-flex items-center gap-1.5 bg-coral-50 border border-coral-200 text-coral-600 text-[11px] font-mono tracking-wide px-3 py-1.5 rounded-full self-start mb-6"
                          }
                        >
                          <span className={featured ? "w-1.5 h-1.5 rounded-full bg-teal-400" : "w-1.5 h-1.5 rounded-full bg-coral-500"} />
                          {s.badge}
                        </span>
                      )}

                      {/* Deliverable-preview mockup */}
                      <div
                        className={cn(
                          "relative rounded-2xl p-4 mb-6",
                          s.key === "analysis" && "bg-white/[0.06] border border-white/10",
                          s.key === "strategy" && "bg-gradient-to-br from-coral-400 to-coral-500",
                          s.key === "training" && "bg-gradient-to-br from-teal-500 to-teal-600",
                        )}
                      >
                        {s.key === "analysis" && (
                          <div>
                            <div className="flex items-end gap-1.5 h-12 mb-2.5">
                              {[30, 50, 40, 65, 55, 80, 70].map((h, idx) => (
                                <div key={idx} className="flex-1 rounded-t-sm bg-gradient-to-t from-teal-500/30 to-teal-400" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-teal-400 font-bold">Revenue ↑ 18%</span>
                              <span className="text-white/40">Churn ↓ 4%</span>
                            </div>
                          </div>
                        )}
                        {s.key === "strategy" && (
                          <div className="space-y-1.5">
                            {["Define the question", "Pick the KPIs", "Set the governance"].map((step, idx) => (
                              <div key={step} className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1.5 shadow-sm">
                                <span className="w-4 h-4 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-[9px] font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] font-mono text-navy-700">{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {s.key === "training" && (
                          <div>
                            <div className="flex gap-1.5 mb-2.5">
                              {Array.from({ length: 8 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${idx < 6 ? "bg-white" : "bg-white/20"}`}
                                >
                                  {idx < 6 && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] font-mono text-white/85">6/8 team members trained</div>
                          </div>
                        )}
                        <div className={featured ? "absolute -bottom-3 -right-1 w-9 h-9 rounded-xl bg-navy-900 border border-white/10 shadow-lift flex items-center justify-center" : "absolute -bottom-3 -right-1 w-9 h-9 rounded-xl bg-white border border-neutral-200 shadow-lift flex items-center justify-center"}>
                          <Icon className={featured ? "w-4 h-4 text-teal-400" : "w-4 h-4 text-navy-700"} />
                        </div>
                      </div>

                      <h3 className={featured ? "relative font-display font-bold text-lg sm:text-xl lg:text-2xl text-white tracking-tight mb-3" : "relative font-display font-bold text-lg sm:text-xl lg:text-2xl text-navy-800 tracking-tight mb-3"}>
                        {s.title}
                      </h3>
                      <p className={featured ? "relative text-white/55 text-sm leading-relaxed mb-6" : "relative text-neutral-500 text-sm leading-relaxed mb-6"}>
                        {s.desc}
                      </p>
                      <ul className="relative space-y-2 mb-7 flex-1">
                        {s.items.map((item) => (
                          <li
                            key={item}
                            className={featured ? "flex items-start gap-2 text-sm text-white/70" : "flex items-start gap-2 text-sm text-neutral-600"}
                          >
                            <CheckCircle2 className={featured ? "w-4 h-4 text-teal-400 shrink-0 mt-0.5" : "w-4 h-4 text-teal-500 shrink-0 mt-0.5"} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contact"
                        className={
                          featured
                            ? "relative inline-flex items-center gap-2 text-teal-400 font-bold text-sm hover:text-teal-300 transition-colors group mt-auto"
                            : "relative inline-flex items-center gap-2 text-navy-800 font-bold text-sm hover:text-teal-600 transition-colors group mt-auto"
                        }
                      >
                        Talk to Us
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
              >
                View Full Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── FOUNDER ──────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-navy-800 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-[0.12] pointer-events-none bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.4fr] gap-12 lg:gap-20 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[2rem] opacity-30 bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)] pointer-events-none" />
                  <Parallax offset={16} className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-brand-xl">
                    <Image
                      src="/chris-awoke.jpg"
                      alt="Chris Awoke, Founder and CEO of Wikrena Limited"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 380px, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/5 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="font-display font-bold text-xl text-white mb-0.5">Chris Awoke</div>
                      <div className="text-sm text-teal-300">Founder &amp; CEO · Wikrena Limited</div>
                    </div>
                  </Parallax>
                  <div className="relative space-y-2.5 mt-6">
                    <div className="flex items-center gap-2.5 text-xs text-white/60">
                      <BookOpen className="w-4 h-4 text-teal-400 shrink-0" /> Author · The Self-Taught Data Analyst
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/60">
                      <Database className="w-4 h-4 text-teal-400 shrink-0" /> Analytics Data Engineer
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/60">
                      <Landmark className="w-4 h-4 text-teal-400 shrink-0" /> Building Africa&apos;s Data &amp; AI Infrastructure
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/60">
                      <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" /> 147+ Professionals Trained
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mb-5 leading-tight">
                  I&apos;m Chris Awoke, Founder of Wikrena.
                </h2>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">
                  I built this company because I believe Africa&apos;s next
                  economic chapter cannot be written on gut feeling and
                  guesswork. Every business decision made without data is
                  value left on the table. Every professional who can&apos;t
                  work with data and AI is potential unrealised.
                </p>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                  Over the past years, I&apos;ve built these skills and taught
                  them to others long enough to see what actually changes
                  outcomes. Wikrena is what that experience became:
                  infrastructure built for the continent, not just one
                  company. We&apos;re building it one business, one
                  professional, and one cohort at a time.
                </p>
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 text-teal-400 font-bold text-sm hover:text-teal-300 transition-colors group"
                >
                  Read Our Full Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── WHY WIKRENA ──────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-14">
              <div className="eyebrow">Why Wikrena</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-4">
                Why Businesses and Professionals Choose Us.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base">
                Not because of what we say. Because of how we work.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_WIKRENA.map((f, i) => {
                const a = ACCENT[f.accent];
                return (
                  <Reveal key={f.title} delay={(i % 3) * 0.08}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col p-7">
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${a.iconWrap}`}>
                        <f.icon className={`w-6 h-6 ${a.icon}`} />
                      </div>
                      <h3 className="font-display font-bold text-lg text-navy-800 mb-2">
                        {f.title}
                      </h3>
                      <p className="text-neutral-500 leading-relaxed text-sm">
                        {f.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-14">
              <div className="eyebrow">Results</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight">
                Results That Speak For Themselves.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => {
                const bar = [
                  { stripe: "bg-teal-500", tint: "text-teal-500/[0.07]" },
                  { stripe: "bg-coral-500", tint: "text-coral-500/[0.07]" },
                  { stripe: "bg-navy-700", tint: "text-navy-700/[0.07]" },
                ][i % 3];
                return (
                  <Reveal key={t.name} delay={i * 0.1}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col p-7">
                      <div className={`absolute top-0 left-0 right-0 h-1 ${bar.stripe}`} />
                      <Quote className={`absolute -top-3 -right-3 w-20 h-20 ${bar.tint}`} />
                      <div className="relative flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 text-coral-400" fill="currentColor" />
                        ))}
                      </div>
                      <p className="relative text-neutral-600 text-sm leading-relaxed mb-6 flex-1">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="relative flex items-center gap-3 pt-5 border-t border-neutral-100">
                        <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                          {t.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-navy-800">{t.name}</div>
                          <div className="text-xs text-neutral-400">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURED PROGRAM ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal>
              <ProgramShowcase />
            </Reveal>
          </div>
        </section>

        {/* ── DUAL CTA ─────────────────────────────────────────────────────── */}
        <section className="relative py-16 sm:py-20 lg:py-24 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.10] pointer-events-none bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.10] pointer-events-none bg-[radial-gradient(circle,theme(colors.coral.500),transparent_70%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-14">
              <div className="eyebrow">Get Started</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Whichever Side You&apos;re On, We&apos;re Ready.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal>
                <div className="group h-full rounded-3xl bg-white/[0.04] border border-white/10 hover:border-teal-400/40 hover:bg-white/[0.06] transition-all p-6 sm:p-10 text-center sm:text-left">
                  <div className="text-[11px] font-mono tracking-wide text-teal-400 mb-3">For Businesses</div>
                  <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mb-4">
                    Tell Us About Your Data Challenge.
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-7">
                    Book a free 30-minute discovery call. No pitch. No pressure.
                    Just an honest conversation about what your data could be
                    doing for your business.
                  </p>
                  <Link
                    href="/contact"
                    className="btn-shine inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    Book a Discovery Call
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="group h-full rounded-3xl bg-white/[0.04] border border-white/10 hover:border-coral-400/40 hover:bg-white/[0.06] transition-all p-6 sm:p-10 text-center sm:text-left">
                  <div className="text-[11px] font-mono tracking-wide text-coral-400 mb-3">For Professionals</div>
                  <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mb-4">
                    Find the Right Program For You.
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-7">
                    Three programs. All practical. All cohort-based or
                    self-paced. All built for Africans who are serious about
                    what comes next for their career.
                  </p>
                  <Link
                    href="/academy"
                    className="btn-shine inline-flex items-center gap-2 bg-white text-navy-900 hover:bg-white/90 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    Explore the Academy
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal className="max-w-2xl mb-12">
              <div className="eyebrow">Questions</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-4">
                Frequently Asked Questions.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base">
                Different questions for businesses and for professionals.
                Pick the side that&apos;s you.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqTabs />
            </Reveal>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
