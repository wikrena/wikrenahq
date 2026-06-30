import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Hexagon,
  Zap,
  GraduationCap,
  BarChart3,
  Monitor,
  ExternalLink,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";
import { AnimatedCounter } from "@/components/marketing/animated-counter";

export const metadata: Metadata = {
  title: "About Wikrena — Data and AI for Africa",
  description:
    "Wikrena is a data and AI company building the infrastructure Africa's next economy needs. Learn our story, our team, and the mission that drives us.",
};

const PILLARS = [
  {
    n: "01",
    icon: BarChart3,
    label: "Data and Analytics",
    title: "Wikrena Consulting",
    desc: "We work directly with businesses on data strategy, analysis, reporting, and AI workflow implementation. You bring the business problem. We bring the clarity.",
    href: "/services",
    cta: "Explore Our Services",
  },
  {
    n: "02",
    icon: GraduationCap,
    label: "Education",
    title: "Wikrena Academy",
    desc: "Practical programs. Real outcomes. Built for Africans who are serious about what comes next for their career. We support you from your first lesson to your first role.",
    href: "/academy",
    cta: "Explore the Academy",
  },
  {
    n: "03",
    icon: Monitor,
    label: "Technology",
    title: "Wikrena OS",
    desc: "The operating system for African service businesses to run with clarity, structure, and control. Manage clients, protect your scope, get paid on time.",
    href: "https://www.wikrenaos.com",
    cta: "Visit Wikrena OS",
    external: true,
  },
];

const TIMELINE = [
  {
    year: "2015",
    title: "The Spark",
    desc: "Working in retail in Enugu as a storekeeper and branch sales manager, our founder saw firsthand how data drives business decisions. The seed of Wikrena was planted.",
  },
  {
    year: "2018",
    title: "The Problem Became Clear",
    desc: "During undergraduate studies, he noticed the lack of practical data guidance available to African students and businesses alike. A gap he resolved to fill.",
  },
  {
    year: "2021",
    title: "Wise Breed Analytics Founded",
    desc: "The company launched with a mission to make data more practical, accessible, and transformative, starting with training and analytics services.",
  },
  {
    year: "2023",
    title: "Training at Scale",
    desc: "Over 137 students trained in Data Analytics. Corporate training programs launched. Partnerships with businesses to help them make sense of their data.",
  },
  {
    year: "2025",
    title: "Wikrena — A New Chapter",
    desc: "Rebranded as Wikrena with an expanded vision: become a major data, AI, and analytics infrastructure company for Africa. Three pillars. One mission.",
  },
  {
    year: "Now",
    title: "Building for Africa",
    desc: "Deeper into analytics services, education, and digital workplace transformation. The gap between data and impact is closing.",
    current: true,
  },
];

const STATS = [
  { value: 147, suffix: "+", label: "Students trained in Data Analytics" },
  { value: 17, suffix: "+", label: "Professionals trained in digital tools" },
  { value: 3, suffix: "", label: "Business pillars built for Africa's future" },
  { value: 5, suffix: "+", label: "Years of impact across the continent" },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Make It Matter",
    desc: "We build what solves, teach what works, and create only what drives real impact. If it does not move people or business forward, we do not do it.",
  },
  {
    n: "02",
    title: "Stay Relentlessly Curious",
    desc: "We question, explore, test, and learn. Curiosity drives mastery, and we never assume we know it all. Growth lives at the edge of our comfort zone.",
  },
  {
    n: "03",
    title: "Own the Outcome",
    desc: "Responsibility is our culture. We show up fully, take ownership, and fix fast when things do not work. No excuses. No finger-pointing.",
  },
  {
    n: "04",
    title: "Build to Uplift",
    desc: "Our mission starts with clients, learners, and teams. We measure success not just by revenue, but by how many people we genuinely empower.",
  },
];

const TEAM = [
  {
    name: "Chris Awoke",
    role: "Founder and CEO",
    org: "Wikrena Limited",
    bio: "Self-taught data professional and author. Seven years in technology, building towards one mission: making data and AI the backbone of how Africa grows.",
    links: [
      { icon: Linkedin, href: "https://www.linkedin.com/in/chrisawoke/", label: "LinkedIn" },
      { icon: Twitter, href: "https://x.com/chrisawoke_", label: "Twitter" },
    ],
    initials: "CA",
  },
  {
    name: "Goodness Oga",
    role: "Lead Project Manager and Content Lead",
    org: "Wikrena Limited",
    bio: "Bridges strategy and execution, ensuring every project, campaign, and communication lands with precision.",
    links: [
      { icon: Linkedin, href: "https://www.linkedin.com/in/goodness-oga", label: "LinkedIn" },
      { icon: Facebook, href: "https://web.facebook.com/goodnessoga1", label: "Facebook" },
    ],
    initials: "GO",
  },
  {
    name: "Edikan Bassey",
    role: "Data Analytics Instructor",
    org: "Wikrena Academy",
    bio: "Healthcare Analyst with a strong passion to equip the next generation of professionals with solid data analytics skills and digital workplace proficiency.",
    links: [
      { icon: Linkedin, href: "https://www.linkedin.com/in/edikanbassey", label: "LinkedIn" },
    ],
    initials: "EB",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingNav />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-navy-900 overflow-hidden pt-28 pb-0">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">

              {/* Copy */}
              <div className="py-16 sm:py-20 lg:py-28 lg:pr-16">
                <Reveal>
                  <div className="inline-flex items-center gap-2 mb-7 text-[11px] font-mono text-white/35">
                    <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                    Who We Are
                  </div>
                  <h1 className="font-display font-black tracking-tight leading-[1.05] text-white text-4xl sm:text-5xl md:text-[3rem] mb-7">
                    We are not here to{" "}
                    <span className="text-gradient-teal">ride the wave.</span>{" "}
                    We are here to shape it.
                  </h1>
                  <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
                    Wikrena is a data and AI company building the infrastructure Africa's next
                    economy needs, helping businesses grow with precision, and training the
                    professionals who will lead that change.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="#our-story"
                      className="group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5"
                    >
                      Our Story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                    </a>
                    <a
                      href="#our-team"
                      className="group inline-flex items-center gap-2.5 bg-white/5 text-white font-bold text-sm px-6 py-3 rounded-2xl border border-white/15 hover:border-teal-400/40 hover:bg-white/10 transition-all duration-300 ease-brand"
                    >
                      Meet the Team
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Layered photos */}
              <div className="relative hidden lg:flex items-end justify-center pb-0 pl-8">
                <Reveal delay={0.15}>
                  <div className="relative w-full max-w-[420px] mb-0">
                    {/* Primary */}
                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-t-2xl border border-navy-700 shadow-brand-lg"
                      style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0%, 100% 40px, 100% 100%, 0% 100%)" }}
                    >
                      <Image
                        src="/about/about-team.jpg"
                        alt="The Wikrena team in a strategy session"
                        fill
                        className="object-cover"
                        sizes="420px"
                        priority
                      />
                      <div className="absolute inset-0 bg-navy-900/15" />
                    </div>

                    {/* Accent: bottom-left */}
                    <div className="absolute -bottom-5 -left-6 w-36 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-navy-900 shadow-float z-20">
                      <Image
                        src="/about/about-team-warm.jpg"
                        alt="Team members sharing a moment over a laptop"
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>

                    {/* Accent: top-right */}
                    <div className="absolute -top-5 -right-5 w-20 aspect-square rounded-xl overflow-hidden border-4 border-navy-900 shadow-lift z-30 rotate-3">
                      <Image
                        src="/about/about-data-detail.jpg"
                        alt="Data visualisation detail"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Credibility tag */}
                    <div className="absolute -bottom-8 -right-6 bg-white rounded-2xl border border-neutral-200 shadow-float px-5 py-3.5 z-20">
                      <div className="text-[11px] font-mono text-neutral-400 mb-0.5">Founded</div>
                      <div className="font-display font-black text-navy-900 text-xl">2021</div>
                      <div className="text-[11px] text-neutral-500">Enugu, Nigeria</div>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ── THREE PILLARS ─────────────────────────────────────────────────── */}
        <section className="py-0 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6">
              <Reveal>
                <div className="eyebrow mb-4">What We Do</div>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight max-w-xl">
                  Three things we do exceptionally well.
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-neutral-100">
              {PILLARS.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className={`px-8 sm:px-10 py-10 sm:py-12 h-full flex flex-col ${i < PILLARS.length - 1 ? "border-b md:border-b-0 md:border-r border-neutral-100" : ""}`}>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center shrink-0">
                        <p.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-neutral-400">{p.n}</div>
                        <div className="text-[11px] font-mono font-bold text-neutral-500 tracking-wide">{p.label}</div>
                      </div>
                    </div>
                    <h3 className="font-display font-black text-navy-800 text-xl mb-3">{p.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed flex-1 mb-6">{p.desc}</p>
                    {p.external ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-500 transition-colors"
                      >
                        {p.cta}
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                      </a>
                    ) : (
                      <Link
                        href={p.href}
                        className="group inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-500 transition-colors"
                      >
                        {p.cta}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY ────────────────────────────────────────────────────────── */}
        <section id="our-story" className="py-20 sm:py-28 bg-neutral-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-start">

              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <div className="eyebrow mb-4">Our Story</div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-5 leading-tight">
                    How it started.
                  </h2>
                  <blockquote className="border-l-2 border-teal-400 pl-5">
                    <p className="text-navy-700 text-base sm:text-lg font-semibold leading-snug italic mb-3">
                      &ldquo;Data is not just numbers. It is the backbone of better decisions.&rdquo;
                    </p>
                    <footer className="text-neutral-500 text-sm">
                      Chris Awoke, Founder
                    </footer>
                  </blockquote>

                  <p className="text-neutral-500 text-sm leading-relaxed mt-6">
                    Wikrena was born from lived experience. In 2015, our founder began his career in retail,
                    first as a storekeeper, then as a branch sales manager in Enugu. It was there he discovered
                    how deeply data shapes decisions, growth, and change in business.
                  </p>
                </div>
              </Reveal>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-neutral-200 hidden sm:block" />
                <div className="space-y-0">
                  {TIMELINE.map((event, i) => (
                    <Reveal key={i} delay={i * 0.07}>
                      <div className="flex items-start gap-6 py-7 border-b border-neutral-200 last:border-b-0">
                        <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center hidden sm:flex ${event.current ? "bg-teal-500 border-teal-500" : "bg-white border-neutral-300"}`}>
                          <div className={`w-2 h-2 rounded-full ${event.current ? "bg-white" : "bg-neutral-300"}`} />
                        </div>
                        <div className="flex-1 min-w-0 sm:pt-2">
                          <div className={`text-[11px] font-mono font-bold tracking-widest mb-1.5 ${event.current ? "text-teal-500" : "text-neutral-400"}`}>
                            {event.year}
                          </div>
                          <h3 className="font-display font-bold text-navy-800 text-base mb-1.5">{event.title}</h3>
                          <p className="text-neutral-500 text-sm leading-relaxed">{event.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <section className="py-0 bg-navy-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className={`px-8 sm:px-12 py-12 sm:py-16 text-center ${i < STATS.length - 1 ? "border-b lg:border-b-0 border-r-0 lg:border-r border-white/[0.06]" : ""} ${i === 1 ? "border-r border-white/[0.06]" : ""}`}>
                    <div className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight mb-2">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-white/40 text-xs sm:text-sm leading-relaxed">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION + VISION ─────────────────────────────────────────────── */}
        <section className="py-0 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6">
              <Reveal>
                <div className="eyebrow mb-4">Our Purpose</div>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight">
                  Why we exist. Where we&apos;re going.
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-neutral-100">

              <Reveal>
                <div className="px-8 sm:px-14 py-12 sm:py-16 border-b md:border-b-0 md:border-r border-neutral-100">
                  <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono font-bold text-teal-500 tracking-widest uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    Mission
                  </div>
                  <h3 className="font-display font-black text-navy-800 text-xl sm:text-2xl mb-4 leading-tight">
                    Build Africa&apos;s data and AI infrastructure.
                  </h3>
                  <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                    To equip African businesses with the data intelligence they need to grow, train
                    the professionals who will drive that transformation, and build the systems that
                    help organisations work smarter, for the long term.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="px-8 sm:px-14 py-12 sm:py-16 bg-neutral-50">
                  <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono font-bold text-coral-500 tracking-widest uppercase">
                    <Hexagon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Vision
                  </div>
                  <h3 className="font-display font-black text-navy-800 text-xl sm:text-2xl mb-4 leading-tight">
                    A data-driven Africa.
                  </h3>
                  <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                    We envision a continent where businesses grow with precision, policymakers decide
                    with evidence, and every African professional has the skills to participate in and
                    lead the data and AI economy.
                  </p>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── PRINCIPLES ───────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-14">
                <div className="eyebrow mb-4">How We Work</div>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight">
                  The principles that guide us every day.
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-surface hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5 p-7 h-full">
                    <div className="text-[11px] font-mono text-neutral-400 mb-4">{p.n}</div>
                    <h3 className="font-display font-bold text-navy-800 text-base mb-3">{p.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ─────────────────────────────────────────────────────────── */}
        <section id="our-team" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="mb-14">
                <div className="eyebrow mb-4">The Team</div>
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-3">
                  The minds behind the mission.
                </h2>
                <p className="text-neutral-500 text-base max-w-xl">
                  A small, focused team with deep expertise, driven by a shared conviction that
                  data and AI can transform Africa.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEAM.map((member, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-3xl border border-neutral-200 shadow-surface hover:shadow-lift transition-all duration-300 overflow-hidden">
                    {/* Avatar */}
                    <div className="h-52 bg-navy-900 relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.06]"
                        style={{
                          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="relative z-10 w-24 h-24 rounded-full bg-teal-500/15 border-2 border-teal-500/30 flex items-center justify-center">
                        <span className="font-display font-black text-2xl text-teal-300">{member.initials}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-7">
                      <div className="text-[11px] font-mono text-neutral-400 mb-1">{member.role}</div>
                      <div className="text-[10px] font-mono text-teal-600 mb-3">{member.org}</div>
                      <h3 className="font-display font-black text-navy-800 text-xl mb-3">{member.name}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed mb-5">{member.bio}</p>

                      <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                        {member.links.map((link, j) => (
                          <a
                            key={j}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on ${link.label}`}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-teal-50 hover:text-teal-600 border border-neutral-200 hover:border-teal-200 flex items-center justify-center text-neutral-500 transition-all duration-200"
                          >
                            <link.icon className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIG PICTURE / CTA ────────────────────────────────────────────── */}
        <section className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <Reveal>
                <div>
                  <div className="eyebrow-light mb-5">The Big Picture</div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6 leading-tight">
                    We are building for Africa&apos;s next chapter.
                  </h2>
                  <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-8">
                    We are building something bigger than a consulting firm or a training academy.
                    We are building the data and AI infrastructure that Africa's next economy will
                    run on: the talent pipeline, the business intelligence, and the systems that help
                    the continent grow with precision.
                  </p>
                  <p className="text-white/30 text-sm leading-relaxed">
                    This is a long-term mission. And we are only getting started.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-5">
                  <blockquote className="bg-white/[0.04] border border-white/10 rounded-3xl p-8">
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed italic mb-5">
                      &ldquo;Our focus is to bridge the gap between data and impact, and create
                      solutions and talent that drive growth, innovation, and a stronger Africa.&rdquo;
                    </p>
                    <footer className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
                        <span className="font-display font-black text-sm text-teal-300">CA</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">Chris Awoke</div>
                        <div className="text-white/35 text-xs">Founder and CEO, Wikrena</div>
                      </div>
                    </footer>
                  </blockquote>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact"
                      className="btn-shine group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5"
                    >
                      Work With Us
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                    </Link>
                    <Link
                      href="/academy"
                      className="group inline-flex items-center gap-2.5 bg-white/5 text-white font-bold text-sm px-6 py-3 rounded-2xl border border-white/15 hover:border-teal-400/40 hover:bg-white/10 transition-all duration-300 ease-brand"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

      </main>
      <MarketingFooter />
    </>
  );
}
