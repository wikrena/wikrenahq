import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Compass,
  BarChart3,
  GraduationCap,
  FileText,
  Presentation,
  Target,
  Users,
  Heart,
  ShoppingBag,
  Phone,
  FileCheck,
  Handshake,
  Package,
  RefreshCw,
  Hexagon,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Consulting Services — Wikrena",
  description:
    "Data strategy, analysis, AI workflow implementation, and corporate training for Africa-focused businesses. We close the gap between your data and the decisions that grow your business.",
};

const QUESTIONS = [
  "Why is our revenue dropping even though sales are up?",
  "Which of our products is actually making us money?",
  "Where are customers dropping off and why?",
  "Are we collecting the right data to make good decisions?",
  "What does our data say about where to focus next quarter?",
  "Which workflows could AI be handling for us right now?",
];

const WITHOUT = [
  "Decisions made on gut feeling",
  "Reports that answer nothing",
  "Opportunities buried in the numbers",
  "Time wasted on the wrong metrics",
  "Data sitting idle, doing nothing",
];

const WITH = [
  "Decisions backed by real evidence",
  "Clarity on what the numbers mean",
  "Opportunities surfaced and acted on",
  "Focus on metrics that actually move the business",
  "Data and AI working for you every day",
];

const WHO = [
  {
    icon: Users,
    title: "SMEs and Growing Businesses",
    desc: "You have revenue, you have customers, and you are making decisions mostly by gut feel. That needs to change. We know how to change it.",
  },
  {
    icon: BarChart3,
    title: "Fintech and Financial Services",
    desc: "Transaction data, customer behaviour, risk profiling. We help you understand what your numbers are actually saying and build AI-assisted workflows around them.",
  },
  {
    icon: Heart,
    title: "Healthcare Organisations",
    desc: "Clinical data, patient outcomes, operational efficiency. We bring data discipline to environments where accuracy is not optional.",
  },
  {
    icon: ShoppingBag,
    title: "Retail and E-commerce",
    desc: "Sales patterns, inventory data, customer lifetime value. We turn your transactional data into strategic decisions your team can act on immediately.",
  },
];

const SERVICES = [
  {
    n: "01",
    icon: Compass,
    badge: null,
    title: "Data Strategy and Advisory",
    tagline: "Start with clarity, not chaos.",
    desc: "Most businesses do not have a data problem. They have a clarity problem. They do not know what data they have, what it means, or what to do with it first. This engagement gives you the full picture and a prioritised roadmap to act on it. We audit your current data landscape, identify the gaps, and map out a practical plan that fits your business size, budget, and goals, including where AI can start working for you immediately.",
    deliverables: [
      "Current state audit: what data you have, where it lives, and what condition it is in",
      "Gap analysis: what is missing and why it matters for your decisions",
      "Prioritised data and AI roadmap: what to build first, second, and third based on ROI",
      "Tool and platform recommendations suited to your budget and technical capacity",
      "90-minute executive debrief and recommendations session",
    ],
    accent: "teal",
  },
  {
    n: "02",
    icon: BarChart3,
    badge: "Most Requested",
    title: "Data Analysis and Reporting",
    tagline: "Turn your numbers into decisions.",
    desc: "We take your raw numbers (spreadsheets, CRM exports, sales data, whatever you have) and turn them into clear, visual, decision-ready reports your team will actually use. Every analysis includes plain-language interpretation. We do not hand you a chart and leave you to figure out what it means.",
    deliverables: [
      "Full data cleaning and preparation from your existing sources",
      "In-depth analysis report with findings and recommendations",
      "Custom dashboard built for your team in Power BI or Excel",
      "Plain-language narrative: what the data says and what to do about it",
      "Presentation of findings to your leadership team",
    ],
    accent: "coral",
  },
  {
    n: "03",
    icon: GraduationCap,
    badge: null,
    title: "Corporate Data and AI Training",
    tagline: "Build a team that understands its data.",
    desc: "Your team has data. They just do not know how to work with it, or how AI can amplify what they are already doing. We bring practical data and AI training directly to your organisation, tailored to your industry, your tools, and your people's actual skill level. This is not a generic course. It is built around your business.",
    deliverables: [
      "Skills assessment to understand where your team is starting from",
      "Custom training curriculum built around your business context and tools",
      "Live workshops, in-person or virtual, your choice",
      "Hands-on exercises using your actual business data",
      "Post-training support pack and 30-day follow-up session",
    ],
    accent: "teal",
  },
];

const HOW = [
  {
    n: "01",
    icon: Phone,
    title: "Discovery Call",
    desc: "30 minutes to understand your business and what you are trying to solve. Not a sales call. A diagnostic. We will tell you honestly if we can help.",
  },
  {
    n: "02",
    icon: FileCheck,
    title: "Proposal and Scope",
    desc: "Within 48 hours you receive a written proposal: exact scope, what we deliver, timeline, and investment. No hidden fees. No surprises.",
  },
  {
    n: "03",
    icon: Presentation,
    title: "Engagement and Delivery",
    desc: "We do the work. You are involved at key checkpoints. Deliverables arrive on the agreed schedule.",
  },
  {
    n: "04",
    icon: Package,
    title: "Handover and Follow-up",
    desc: "A proper handover, documentation, and a 30-day window for questions. We build for your independence, not ongoing dependency.",
  },
];

const DIFF = [
  {
    icon: Target,
    title: "Africa-First by Design",
    desc: "We understand Nigerian and African business realities. We do not apply Western frameworks to African contexts and call it consulting.",
  },
  {
    icon: Users,
    title: "Expert-Led Delivery",
    desc: "Every engagement is handled by a senior, experienced team. No handoffs to inexperienced staff after the first call.",
  },
  {
    icon: FileText,
    title: "Real Deliverables",
    desc: "Every engagement ends with something tangible: a dashboard, a report, a strategy document, a trained team. Not slides that gather dust.",
  },
  {
    icon: RefreshCw,
    title: "Lasting Impact",
    desc: "Every deliverable is documented and handed over properly so your team can continue where we stopped. We build for independence.",
  },
];

const FAQS = [
  {
    q: "How much do your services cost?",
    a: "Every engagement is scoped individually because every business situation is different. We do not publish fixed prices because a one-hour advisory session and a three-month data project are very different things. Book a discovery call and we will give you a clear, honest proposal after understanding your needs.",
  },
  {
    q: "Do we need to have clean, organised data before working with you?",
    a: "No. Most of our clients come to us with messy, scattered data across spreadsheets, CRM tools, and manual records. Data cleaning and preparation is part of what we do. Bring us what you have.",
  },
  {
    q: "How long does a typical engagement take?",
    a: "A Data Strategy engagement typically takes two to three weeks. A Data Analysis and Reporting project is usually three to six weeks depending on data complexity. Corporate Training is designed around your team's availability and schedule. We give you a clear timeline in the proposal before work begins.",
  },
  {
    q: "Do you work with businesses outside Nigeria?",
    a: "Yes. Our clients are primarily in Nigeria but we work remotely across Africa. If you are building a business on the continent, we want to work with you.",
  },
  {
    q: "What tools do you use?",
    a: "We work primarily with Power BI, Excel, SQL, Python, and leading AI platforms for analysis, reporting, and workflow automation. We match our tools to what your team can maintain after we are done. There is no point building something complex that breaks when we leave.",
  },
  {
    q: "Can we start small before committing to a larger engagement?",
    a: "Yes. Many clients start with a Data Strategy session to understand what they need before committing to a larger project. That is a completely reasonable way to start and we actively encourage it.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <MarketingNav />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-[100svh] lg:min-h-0">

              {/* Left: copy */}
              <div className="flex flex-col justify-center pt-36 pb-20 lg:pt-40 lg:pb-28 pr-0 lg:pr-16">
                <Reveal>
                  <div className="inline-flex items-center gap-2 mb-7 text-[11px] font-mono text-white/35">
                    <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                    Wikrena Consulting
                  </div>
                  <h1 className="font-display font-black tracking-tight leading-[1.05] text-white text-4xl sm:text-5xl md:text-[3.25rem] mb-7">
                    Your business has answers{" "}
                    <span className="text-gradient-teal">hidden in its data.</span>{" "}
                    We help you find them.
                  </h1>
                  <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
                    We work directly with Africa-focused businesses on data strategy,
                    analysis, reporting, and AI workflow implementation. Every engagement
                    ends with clarity you can act on.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-14">
                    <Link
                      href="/contact"
                      className="btn-shine group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5"
                    >
                      Book a Free Discovery Call
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                    </Link>
                    <a
                      href="#services"
                      className="group inline-flex items-center gap-2.5 bg-white/5 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl border border-white/15 hover:border-teal-400/40 hover:bg-white/10 transition-all duration-300 ease-brand"
                    >
                      See Our Services
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                    </a>
                  </div>

                  <div className="flex items-center gap-8 border-t border-white/10 pt-8">
                    {[
                      { value: 5, suffix: "+", label: "Years delivering" },
                      { value: 3, suffix: "", label: "Core services" },
                      { value: 100, suffix: "%", label: "Outcome-focused" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="font-display font-black text-2xl text-white tracking-tight">
                          <AnimatedCounter value={s.value} suffix={s.suffix} />
                        </div>
                        <div className="text-[11px] text-white/35 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* Right: visual panel */}
              <div className="hidden lg:flex flex-col justify-center py-16 pl-10 border-l border-white/[0.06]">
                <Reveal delay={0.15}>
                  <div className="space-y-4">
                    <div className="text-[11px] font-mono text-white/25 tracking-widest uppercase mb-6">
                      What we solve
                    </div>
                    {QUESTIONS.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 group"
                        style={{ opacity: 1 - i * 0.1 }}
                      >
                        <span className="text-teal-500 text-sm font-bold shrink-0 mt-0.5 group-hover:text-teal-300 transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* ── TENSION BANNER ───────────────────────────────────────────────── */}
        <section className="py-14 bg-teal-500 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              <p className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-900 tracking-tight leading-tight">
                The problem is never the data.{" "}
                <span className="text-navy-900/60">
                  It is the gap between your data and the decisions that grow your business.
                </span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── BEFORE / AFTER ───────────────────────────────────────────────── */}
        <section className="py-0 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Without */}
              <Reveal>
                <div className="px-8 sm:px-14 py-16 sm:py-20 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200">
                  <div className="inline-flex items-center gap-2 mb-8 text-[11px] font-mono font-bold text-red-400 tracking-widest uppercase">
                    <XCircle className="w-3.5 h-3.5" />
                    Without Wikrena
                  </div>
                  <ul className="space-y-5">
                    {WITHOUT.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <span className="text-neutral-500 text-sm sm:text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* With */}
              <Reveal delay={0.1}>
                <div className="px-8 sm:px-14 py-16 sm:py-20 bg-navy-900">
                  <div className="inline-flex items-center gap-2 mb-8 text-[11px] font-mono font-bold text-teal-400 tracking-widest uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    With Wikrena
                  </div>
                  <ul className="space-y-5">
                    {WITH.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <span className="text-white/75 text-sm sm:text-base leading-relaxed font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── WHO WE WORK WITH ─────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">

              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <div className="eyebrow mb-4">Who we work with</div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-4 leading-tight">
                    We work best with businesses that are ready.
                  </h2>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    Not every business is ready for a data and AI engagement. We want to work with the ones that are.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {WHO.map((w, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-surface hover:shadow-lift transition-all duration-300 hover:-translate-y-0.5 p-7 h-full">
                      <div className="w-11 h-11 rounded-2xl bg-navy-900 flex items-center justify-center mb-5">
                        <w.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <h3 className="font-display font-bold text-navy-800 text-base mb-2.5">{w.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{w.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── THREE SERVICES ───────────────────────────────────────────────── */}
        <section id="services" className="bg-white">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10">
            <Reveal>
              <div className="eyebrow mb-4">Our services</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-navy-800 tracking-tight mb-4 max-w-2xl leading-tight">
                Three ways we work with you.
              </h2>
              <p className="text-neutral-500 text-base max-w-xl">
                Every engagement starts with a discovery call. You will never be sold a service
                that does not fit your actual problem.
              </p>
            </Reveal>
          </div>

          {SERVICES.map((svc, i) => {
            const isEven = i % 2 === 1;
            const accentClasses = svc.accent === "coral"
              ? { bg: "bg-coral-500", text: "text-coral-500", badge: "bg-coral-50 text-coral-600 border-coral-200", glow: "shadow-coral-glow" }
              : { bg: "bg-teal-500", text: "text-teal-500", badge: "bg-teal-50 text-teal-600 border-teal-200", glow: "shadow-teal-glow" };

            return (
              <Reveal key={i} delay={0.05}>
                <div className={`border-t border-neutral-100 ${i === SERVICES.length - 1 ? "border-b" : ""}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${isEven ? "lg:flex-row-reverse" : ""}`}>

                      {/* Number + icon panel */}
                      <div className={`${isEven ? "lg:order-2" : ""} bg-navy-900 px-8 sm:px-14 py-14 sm:py-20 flex flex-col justify-between relative overflow-hidden`}>
                        <div className="absolute -bottom-8 -right-8 text-[140px] font-black text-white/[0.04] leading-none select-none">
                          {svc.n}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-10">
                            <div className={`w-11 h-11 rounded-2xl ${svc.accent === "coral" ? "bg-coral-500/15" : "bg-teal-500/15"} border ${svc.accent === "coral" ? "border-coral-500/25" : "border-teal-500/25"} flex items-center justify-center`}>
                              <svc.icon className={`w-5 h-5 ${svc.accent === "coral" ? "text-coral-400" : "text-teal-400"}`} />
                            </div>
                            {svc.badge && (
                              <span className={`text-[10px] font-bold font-mono tracking-widest uppercase px-3 py-1 rounded-full border ${accentClasses.badge}`}>
                                {svc.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-white/25 mb-3">Service {svc.n}</div>
                          <h3 className="font-display font-black text-white text-2xl sm:text-3xl tracking-tight mb-3 leading-tight">
                            {svc.title}
                          </h3>
                          <p className={`text-base font-semibold ${svc.accent === "coral" ? "text-coral-400" : "text-teal-400"} mb-7`}>
                            {svc.tagline}
                          </p>
                          <p className="text-white/45 text-sm sm:text-base leading-relaxed">
                            {svc.desc}
                          </p>
                        </div>
                      </div>

                      {/* Deliverables panel */}
                      <div className={`${isEven ? "lg:order-1" : ""} bg-white px-8 sm:px-14 py-14 sm:py-20 flex flex-col justify-center`}>
                        <div className="text-[11px] font-mono font-bold text-neutral-400 tracking-widest uppercase mb-7">
                          What you get
                        </div>
                        <ul className="space-y-5">
                          {svc.deliverables.map((d, j) => (
                            <li key={j} className="flex items-start gap-4">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${svc.accent === "coral" ? "bg-coral-50 border border-coral-200" : "bg-teal-50 border border-teal-200"}`}>
                                <ChevronRight className={`w-3 h-3 ${svc.accent === "coral" ? "text-coral-500" : "text-teal-500"}`} />
                              </div>
                              <span className="text-navy-700 text-sm sm:text-base leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-10 pt-8 border-t border-neutral-100">
                          <Link
                            href="/contact"
                            className={`group inline-flex items-center gap-2.5 font-bold text-sm transition-colors duration-200 ${svc.accent === "coral" ? "text-coral-600 hover:text-coral-500" : "text-teal-600 hover:text-teal-500"}`}
                          >
                            Enquire about this service
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-neutral-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <Reveal>
              <div className="text-center mb-16">
                <div className="eyebrow mb-4">How we work</div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-3">
                  Four steps. No surprises.
                </h2>
                <p className="text-neutral-500 text-base max-w-lg mx-auto">
                  Every engagement follows the same four steps regardless of which service you choose.
                </p>
              </div>
            </Reveal>

            {/* Stepper */}
            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="hidden lg:block absolute top-[42px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-neutral-200 z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {HOW.map((step, i) => (
                  <Reveal key={i} delay={i * 0.09}>
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                      {/* Step circle */}
                      <div className="w-[52px] h-[52px] rounded-full bg-navy-900 border-4 border-neutral-50 flex items-center justify-center mb-5 shrink-0 shadow-lift">
                        <step.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mb-1">Step {step.n}</div>
                      <h3 className="font-display font-bold text-navy-800 text-base mb-2">{step.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── DIFFERENTIATORS ──────────────────────────────────────────────── */}
        <section className="py-0 bg-navy-900 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">

              {/* Left label */}
              <div className="px-8 sm:px-14 py-16 sm:py-20 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col justify-center">
                <Reveal>
                  <div className="eyebrow-light mb-4">What makes us different</div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-4">
                    Built for African businesses. Delivered by experts.
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    We are a data and AI consultancy that understands the market it operates in.
                    That changes everything about how we work.
                  </p>
                </Reveal>
              </div>

              {/* Right grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {DIFF.map((d, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className={`px-8 sm:px-10 py-10 sm:py-12 border-white/[0.06] ${i < 2 ? "border-b" : ""} ${i % 2 === 0 ? "sm:border-r" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                        <d.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <h3 className="font-display font-bold text-white text-base mb-2">{d.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-start">
              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <div className="eyebrow mb-4">Questions</div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-4 leading-tight">
                    Frequently asked questions.
                  </h2>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                    Have a question not answered here?
                  </p>
                  <a
                    href="mailto:hello@wikrena.com"
                    className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-500 transition-colors"
                  >
                    hello@wikrena.com
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <FaqAccordion items={FAQS} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="relative bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.12] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left: statement */}
              <div className="py-20 sm:py-28 lg:pr-16 lg:border-r border-white/[0.06]">
                <Reveal>
                  <div className="flex items-center gap-2 mb-8 text-[11px] font-mono text-white/30">
                    <Zap className="w-3.5 h-3.5 text-teal-400" />
                    Let&apos;s talk
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6 leading-tight">
                    Your data should be working for you.{" "}
                    <span className="text-white/30">Every day.</span>
                  </h2>
                  <p className="text-white/45 text-base sm:text-lg leading-relaxed max-w-lg">
                    Book a free 30-minute discovery call. No pitch. No pressure.
                    Just an honest conversation about your data, your AI opportunities,
                    and what we can build together.
                  </p>
                </Reveal>
              </div>

              {/* Right: action + assurances */}
              <div className="py-20 sm:py-28 lg:pl-16 flex flex-col justify-center">
                <Reveal delay={0.1}>
                  <Link
                    href="/contact"
                    className="btn-shine group inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5 mb-10 self-start"
                  >
                    Book a Free Discovery Call
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                  </Link>

                  <div className="space-y-5">
                    {[
                      { icon: Phone, label: "Free discovery call", sub: "30 minutes, no obligation" },
                      { icon: FileCheck, label: "Clear proposal within 48 hours", sub: "Scope and cost upfront, no surprises" },
                      { icon: Handshake, label: "Founder-led delivery", sub: "Chris on every engagement" },
                      { icon: TrendingUp, label: "Africa-first approach", sub: "Built specifically for this market" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold">{item.label}</div>
                          <div className="text-white/35 text-xs">{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

      </main>
      <MarketingFooter />
    </>
  );
}
