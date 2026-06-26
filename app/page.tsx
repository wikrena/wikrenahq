import type { Metadata } from "next";
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
  ImageIcon,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { HomeHero } from "@/components/marketing/home-hero";

export const metadata: Metadata = {
  title: "Wikrena Limited — Building Africa's Data & AI Infrastructure",
  description:
    "Wikrena is a data and AI company built for Africa-focused businesses. We help businesses make smarter decisions with their data, and we train the professionals who make that work happen.",
};

type Accent = "teal" | "coral" | "purple" | "amber";

const ACCENT: Record<Accent, { iconWrap: string; icon: string }> = {
  teal: {
    iconWrap: "bg-teal-50 border border-teal-200",
    icon: "text-teal-600",
  },
  coral: {
    iconWrap: "bg-coral-50 border border-coral-200",
    icon: "text-coral-600",
  },
  purple: {
    iconWrap: "bg-purple-50 border border-purple-200",
    icon: "text-purple-600",
  },
  amber: {
    iconWrap: "bg-amber-50 border border-amber-200",
    icon: "text-amber-600",
  },
};

const ECOSYSTEM: {
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
    icon: Settings2,
    title: "Wikrena OS",
    tag: "For African Service Businesses",
    desc: "The operating system for African service businesses to run with clarity, structure, and control. Manage clients, protect your scope, get paid on time, and build the track record that takes you to the next level — offline-mode by design.",
    cta: "Start for free",
    href: "https://os.wikrena.com",
    external: true,
    accent: "purple",
  },
  {
    icon: GraduationCap,
    title: "Wikrena Academy",
    tag: "For Professionals",
    desc: "Practical programs. Real outcomes. Built for Africans who are serious about what comes next for their career. We support you from your first lesson to your first role or promotion — not people who just have a certificate.",
    cta: "Explore the Academy",
    href: "/academy",
    external: false,
    accent: "teal",
  },
  {
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
  icon: typeof Compass;
  title: string;
  desc: string;
  items: string[];
  badge: string | null;
}[] = [
  {
    icon: BarChart3,
    title: "Data Analysis & Reporting",
    desc: "We take your raw numbers from spreadsheets, CRM exports, sales data and other sources, and turn them into clear, visual, decision-ready reports your leadership team will actually use.",
    items: ["A custom dashboard", "A plain-language analysis report", "A presentation of findings to your team"],
    badge: "Most Requested",
  },
  {
    icon: Compass,
    title: "Data Strategy & Advisory",
    desc: "Before dashboards or reports, you need to know what questions you're actually trying to answer. We help you define a data strategy tied directly to your growth goals.",
    items: ["A clear data strategy", "The right KPIs", "A governance framework your team can actually use"],
    badge: null,
  },
  {
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
    accent: "purple",
  },
  {
    icon: GraduationCap,
    title: "Learn. Build. Get Placed.",
    desc: "Our Academy goes beyond teaching. You build real projects, strengthen your profile, and get placement support. The outcome is what matters.",
    accent: "amber",
  },
  {
    icon: Target,
    title: "Industry-Specific Focus",
    desc: "Fintech, Healthcare, and Retail tracks built for real job demands in Africa. Not generic data skills that could apply anywhere and therefore apply nowhere.",
    accent: "teal",
  },
  {
    icon: RefreshCw,
    title: "End-to-End and Beyond",
    desc: "We handle everything from understanding your data problem to deploying the solution and training your team to maintain it. We do not disappear after delivery.",
    accent: "coral",
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

const FAQS = [
  {
    q: "Who is Wikrena for — businesses or professionals?",
    a: "Both. Wikrena Consulting serves businesses that want to understand and act on their data. Wikrena Academy serves professionals and career changers who want to build practical data skills. The two sides of Wikrena are designed to work together — we train the professionals that businesses need.",
  },
  {
    q: "Do I need a technical background to enroll in a program?",
    a: "No. Our programs are designed to be accessible from scratch. If you can use a laptop and are willing to show up consistently, you are ready. We build the technical foundation from the ground up.",
  },
  {
    q: "How do I engage Wikrena for data services for my business?",
    a: "Start with a free 30-minute discovery call. We listen to your situation, understand what you are trying to achieve, and tell you honestly whether and how we can help.",
  },
  {
    q: "Where are you based and do you work outside Nigeria?",
    a: "We are based in Nigeria but work with clients and students across Africa remotely. If you are building a business on the continent or are an African professional wherever you are, we want to work with you.",
  },
  {
    q: "How is your Academy different from other data training platforms?",
    a: "Three things. First, we run cohort-based programs with a maximum of 45 students, not self-paced courses with thousands of people and no accountability. Second, every program is built on African business data, not generic global datasets. Third, we do not stop at the certificate — career support and placement assistance are built into every program.",
  },
];

export default function HomePage() {
  return (
    <div className="home-rebrand">
      <MarketingNav />
      <main>
        <HomeHero />

        {/* ── WHO WE ARE ───────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image column — placeholder pending a real photo */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-3xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-neutral-400">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-xs font-medium">Image placeholder</span>
                  </div>
                </div>
              </div>

              {/* Text column */}
              <div className="order-1 lg:order-2">
                <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-6">
                  We&apos;re Not Your Typical Data Company.
                </h2>
                <p className="text-neutral-500 text-base leading-relaxed mb-8">
                  Wikrena is a data and AI company with one mission: to build
                  the infrastructure Africa&apos;s next economy needs to grow
                  with intelligence and precision. We work with businesses to
                  transform how they use data, and we train the professionals
                  who will power that transformation across the continent.
                  Everything we do is hands-on, Africa-specific, and built to
                  produce real outcomes.{" "}
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
                  className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors group"
                >
                  About Us
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ECOSYSTEM ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white" id="ecosystem">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-4">
                Three Ways We Serve Africa.
              </h2>
              <p className="text-neutral-500 text-base">
                Every part of Wikrena is designed to feed the others: services,
                education, and technology working as one. That is not a
                coincidence. That is how Wikrena is designed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ECOSYSTEM.map((e) => {
                const a = ACCENT[e.accent];
                return (
                  <div
                    key={e.title}
                    className={`relative overflow-hidden rounded-3xl p-9 border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 hover:shadow-float hover:-translate-y-1 transition-all duration-300 flex flex-col`}
                  >
                    <div
                      className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.10] ${a.icon} bg-current`}
                      style={{ filter: "blur(28px)" }}
                    />
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lift ${a.iconWrap}`}>
                      <e.icon className={`w-7 h-7 ${a.icon}`} />
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
                      {e.tag}
                    </div>
                    <h3 className="font-display font-bold text-2xl text-navy-800 mb-3">{e.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-7 flex-1">{e.desc}</p>
                    <Link
                      href={e.href}
                      target={e.external ? "_blank" : undefined}
                      rel={e.external ? "noopener noreferrer" : undefined}
                      className={`relative inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all group ${a.icon}`}
                    >
                      {e.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-4">
                What We Actually Do For Your Business.
              </h2>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">
                Three focused services. No inflated list. No overpromising.
                Just what we can deliver with excellence right now.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {SERVICES.map((s, i) => {
                const featured = i === 0;
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className={
                      featured
                        ? "relative overflow-hidden rounded-3xl p-8 bg-navy-800 flex flex-col shadow-brand-lg"
                        : "relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 flex flex-col hover:shadow-float hover:-translate-y-1 transition-all duration-300"
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
                            ? "relative inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full self-start mb-6"
                            : "relative inline-flex items-center gap-1.5 bg-coral-50 border border-coral-200 text-coral-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full self-start mb-6"
                        }
                      >
                        <span className={featured ? "w-1.5 h-1.5 rounded-full bg-teal-400" : "w-1.5 h-1.5 rounded-full bg-coral-500"} />
                        {s.badge}
                      </span>
                    )}
                    <div
                      className={
                        featured
                          ? "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/10"
                          : "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-navy-50 border border-navy-200 shadow-lift"
                      }
                    >
                      <Icon className={featured ? "w-7 h-7 text-teal-400" : "w-7 h-7 text-navy-700"} />
                    </div>
                    <h3 className={featured ? "relative font-display font-bold text-2xl text-white tracking-tight mb-3" : "relative font-display font-bold text-2xl text-navy-800 tracking-tight mb-3"}>
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
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
              >
                View Full Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOUNDER ──────────────────────────────────────────────────────── */}
        <section className="py-24 bg-navy-800 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full opacity-[0.12] pointer-events-none bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
              <div>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-4xl font-display font-black text-white mb-6 shadow-teal-glow">
                  CA
                </div>
                <div className="font-display font-bold text-lg text-white mb-1">Chris Awoke</div>
                <div className="text-sm text-white/50 mb-5">Founder &amp; CEO · Wikrena Limited</div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-white/60">
                    <BookOpen className="w-4 h-4 text-teal-400 shrink-0" /> Author · The Self-Taught Data Analyst
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/60">
                    <Landmark className="w-4 h-4 text-teal-400 shrink-0" /> Building Africa&apos;s Data &amp; AI Infrastructure
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/60">
                    <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" /> 147+ Professionals Trained
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-5 leading-tight">
                  I&apos;m Chris Awoke, Founder of Wikrena.
                </h2>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                  I built this company because I believe Africa&apos;s next
                  economic chapter cannot be written on gut feeling and
                  guesswork. Every business decision made without data is value
                  left on the table. Every professional who can&apos;t work
                  with data is potential unrealised. I&apos;ve spent over seven
                  years in this field — as a self-taught data analyst, a
                  front-end engineer, an author, and now a founder building the
                  infrastructure to change how Africa thinks about data. Not
                  just for one company. For the continent. Wikrena is that
                  infrastructure, and we&apos;re building it one business, one
                  professional, and one cohort at a time.
                </p>
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 text-teal-400 font-bold text-sm hover:text-teal-300 transition-colors group"
                >
                  Read Our Full Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY WIKRENA ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-4">
                Why Businesses and Professionals Choose Us.
              </h2>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">
                Not because of what we say. Because of how we work.
              </p>
            </div>
            <div className="max-w-4xl mx-auto divide-y divide-neutral-200 border-t border-neutral-200">
              {WHY_WIKRENA.map((f) => {
                const a = ACCENT[f.accent];
                return (
                  <div key={f.title} className="flex items-start gap-5 py-7">
                    <f.icon className={`w-6 h-6 shrink-0 mt-0.5 ${a.icon}`} />
                    <div>
                      <h3 className="font-display font-bold text-lg text-navy-800 mb-1.5">{f.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight">
                Results That Speak For Themselves.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-neutral-50 border border-neutral-200 rounded-2xl p-7 hover:border-teal-300 hover:shadow-card transition-all"
                >
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-navy-800">{t.name}</div>
                      <div className="text-xs text-neutral-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PROGRAM ─────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-navy-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.15] pointer-events-none bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
              <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Featured Course
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-4">
                    AI Automation Specialist Program.
                  </h2>
                  <p className="text-white/55 text-sm sm:text-base leading-relaxed mb-6">
                    Learn to use AI tools and automation platforms to eliminate
                    repetitive work and build smarter workflows — no coding
                    required. For business owners and professionals who want to
                    work smarter, immediately.
                  </p>
                  <ul className="space-y-2 mb-7">
                    {[
                      "Zapier, Make.com and AI workflow tools",
                      "Build automations on your actual work processes",
                      "No-code focused and beginner friendly",
                      "Certificate of completion",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/paths/ai-automation"
                    className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Program Details</div>
                  <div className="space-y-3 text-sm">
                    {[
                      ["Instructor", "Chris Awoke · Wikrena Academy"],
                      ["Level", "All Levels"],
                      ["Format", "Online · Live Sessions"],
                      ["Category", "AI Automation"],
                      ["Access", "Lifetime"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <span className="text-white/40">{k}</span>
                        <span className="text-white/80 font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DUAL CTA ─────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-navy-800 rounded-2xl p-8 sm:p-10 text-center sm:text-left">
                <div className="text-[10px] font-bold tracking-widest uppercase text-teal-400 mb-3">For Businesses</div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-4">
                  Tell Us About Your Data Challenge.
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-7">
                  Book a free 30-minute discovery call. No pitch. No pressure.
                  Just an honest conversation about what your data could be
                  doing for your business.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
                >
                  Book a Discovery Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 sm:p-10 text-center sm:text-left">
                <div className="text-[10px] font-bold tracking-widest uppercase text-coral-500 mb-3">For Professionals</div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-4">
                  Find the Right Program For You.
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-7">
                  Two programs. Both practical. Both cohort-based. Both built
                  for Africans who are serious about what comes next for their
                  career.
                </p>
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
                >
                  Explore the Academy
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-4">
                Frequently Asked Questions.
              </h2>
              <p className="text-neutral-500 text-base">
                Can&apos;t find your answer here? Email us at{" "}
                <a href="mailto:hello@wikrena.com" className="text-teal-600 font-semibold hover:text-teal-700">
                  hello@wikrena.com
                </a>{" "}
                and we will get back to you within 24 hours.
              </p>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
