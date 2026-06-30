import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Compass,
  BarChart3,
  GraduationCap,
  Search,
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

const HERO_STATS = [
  { value: 5, suffix: "+", label: "Years delivering" },
  { value: 3, suffix: "", label: "Core services" },
  { value: 100, suffix: "%", label: "Outcome-focused" },
];

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
    desc: "Most businesses do not have a data problem. They have a clarity problem. They do not know what data they have, what it means, or what to do with it first. This engagement gives you the full picture and a prioritised roadmap to act on it. We audit your current data landscape, identify the gaps, and map out a practical plan that fits your business size, budget, and goals, including where AI can start working for you immediately.",
    deliverables: [
      "Current state audit: what data you have, where it lives, and what condition it is in",
      "Gap analysis: what is missing and why it matters for your decisions",
      "Prioritised data and AI roadmap: what to build first, second, and third based on ROI",
      "Tool and platform recommendations suited to your budget and technical capacity",
      "90-minute executive debrief and recommendations session",
    ],
  },
  {
    n: "02",
    icon: BarChart3,
    badge: "Most Requested",
    title: "Data Analysis and Reporting",
    desc: "We take your raw numbers (spreadsheets, CRM exports, sales data, whatever you have) and turn them into clear, visual, decision-ready reports your team will actually use. Every analysis includes plain-language interpretation. We do not hand you a chart and leave you to figure out what it means.",
    deliverables: [
      "Full data cleaning and preparation from your existing sources",
      "In-depth analysis report with findings and recommendations",
      "Custom dashboard built for your team in Power BI or Excel",
      "Plain-language narrative: what the data says and what to do about it",
      "Presentation of findings to your leadership team",
    ],
  },
  {
    n: "03",
    icon: GraduationCap,
    badge: null,
    title: "Corporate Data and AI Training",
    desc: "Your team has data. They just do not know how to work with it, or how AI can amplify what they are already doing. We bring practical data and AI training directly to your organisation, tailored to your industry, your tools, and your people's actual skill level. This is not a generic course. It is built around your business.",
    deliverables: [
      "Skills assessment to understand where your team is starting from",
      "Custom training curriculum built around your business context and tools",
      "Live workshops, in-person or virtual, your choice",
      "Hands-on exercises using your actual business data",
      "Post-training support pack and 30-day follow-up session",
    ],
  },
];

const HOW = [
  {
    n: "1",
    icon: Phone,
    title: "Discovery Call",
    desc: "We spend 30 minutes understanding your business, your data situation, and what you are trying to solve. This is not a sales call. It is a diagnostic. At the end, we tell you honestly whether we can help and which service fits. If we are not the right fit, we say so.",
  },
  {
    n: "2",
    icon: FileCheck,
    title: "Proposal and Scope",
    desc: "Within 48 hours of the discovery call, you receive a written proposal with the exact scope of work, what we will deliver, the timeline, and the investment. No vague estimates. No hidden fees. You know exactly what you are agreeing to before you sign anything.",
  },
  {
    n: "3",
    icon: Presentation,
    title: "Engagement and Delivery",
    desc: "We do the work. You are involved at key checkpoints but you are not expected to manage us. We communicate proactively and flag anything that needs your input before it becomes a delay. Deliverables arrive on the agreed schedule.",
  },
  {
    n: "4",
    icon: Package,
    title: "Handover and Follow-up",
    desc: "Every engagement ends with a proper handover. We do not deliver and disappear. You receive a walkthrough of everything we built, documentation where relevant, and a 30-day window to ask questions. Ongoing clients move to a retainer structure that keeps them supported without unnecessary cost.",
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
    desc: "Every engagement ends with something tangible: a dashboard, a report, a strategy document, a trained team. Not a presentation deck that gathers dust.",
  },
  {
    icon: RefreshCw,
    title: "Lasting Impact",
    desc: "Every deliverable is documented and handed over properly so you or your team can continue where we stopped. We build for independence, not dependency.",
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
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-navy-900">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.12] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.08] bg-[radial-gradient(circle,theme(colors.coral.500),transparent_70%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono text-white/40">
                <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                Wikrena Consulting
              </div>
              <h1 className="font-display font-black tracking-tight leading-[1.05] text-white text-4xl sm:text-5xl md:text-[3.25rem] max-w-3xl mb-6">
                Your business has answers{" "}
                <span className="text-gradient-teal">hidden in its data.</span>{" "}
                We help you find them.
              </h1>
              <p className="text-white/55 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
                We work directly with Africa-focused businesses on data strategy,
                analysis, reporting, and AI workflow implementation. Every engagement
                ends with clarity you can act on, not a report that sits on a shelf.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-16">
                <Link
                  href="/contact"
                  className="btn-shine group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5"
                >
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2.5 bg-white/5 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 ease-brand hover:-translate-y-0.5"
                >
                  See Our Services
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-sm border-t border-white/10 pt-8">
                {HERO_STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-black text-2xl text-white tracking-tight">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── DIAGNOSTIC QUESTIONS ─────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">The kind of questions we answer</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-10 max-w-xl">
                If you are asking any of these, you are in the right place.
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUESTIONS.map((q, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-3 bg-white border border-neutral-200 rounded-2xl p-5 shadow-surface hover:shadow-lift transition-shadow duration-300">
                    <span className="text-teal-500 text-lg font-bold shrink-0 mt-0.5">?</span>
                    <p className="text-navy-700 text-sm font-medium leading-relaxed">{q}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-8 text-neutral-500 text-sm">
                We work with you to find the answers, and more importantly, what to do with them.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── PROBLEM / SOLUTION ───────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">The problem</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-4 max-w-2xl">
                Data without direction is just noise.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-2xl mb-12">
                Most growing African businesses have more data than they know what to do with.
                Sales spreadsheets nobody reads. Reports that take a week to produce and get ignored
                in a meeting. Dashboards that show numbers but answer no questions.
                The problem is never the data. It is the gap between the data and the decision.
                Wikrena Consulting closes that gap with data expertise and AI tools working together.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-red-100 bg-red-50/60 p-7">
                  <div className="text-[11px] font-mono font-bold text-red-400 tracking-widest uppercase mb-5">
                    Without Wikrena
                  </div>
                  <ul className="space-y-3.5">
                    {WITHOUT.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <span className="text-neutral-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-7">
                  <div className="text-[11px] font-mono font-bold text-teal-600 tracking-widest uppercase mb-5">
                    With Wikrena
                  </div>
                  <ul className="space-y-3.5">
                    {WITH.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                        <span className="text-navy-700 text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── WHO WE WORK WITH ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">Who we work with</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-3">
                We work best with businesses that are ready.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base max-w-xl mb-10">
                Not every business is ready for a data and AI engagement. We want to work with the ones that are.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHO.map((w, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-surface p-6 h-full">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                      <w.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="font-display font-bold text-navy-800 text-base mb-2">{w.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── THREE SERVICES ───────────────────────────────────────────────── */}
        <section id="services" className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">Our services</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-3">
                Three ways we work with you.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base max-w-xl mb-12">
                Every engagement starts with a discovery call where we understand your situation before
                recommending a path. You will never be sold a service that does not fit your actual problem.
              </p>
            </Reveal>

            <div className="space-y-8">
              {SERVICES.map((svc, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="relative rounded-3xl border border-neutral-200 bg-white shadow-surface hover:shadow-lift transition-shadow duration-300 p-7 sm:p-9">
                    {svc.badge && (
                      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[10px] font-bold font-mono tracking-widest text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 uppercase">
                        {svc.badge}
                      </div>
                    )}
                    <div className="flex items-start gap-5 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shrink-0">
                        <svc.icon className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono text-neutral-400 mb-0.5">Service {svc.n}</div>
                        <h3 className="font-display font-black text-navy-800 text-xl sm:text-2xl tracking-tight">
                          {svc.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                      {svc.desc}
                    </p>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-neutral-400 tracking-widest uppercase mb-3">
                        What you get
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {svc.deliverables.map((d, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <ChevronRight className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                            <span className="text-neutral-600 text-sm">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="mt-8 text-neutral-500 text-sm text-center">
                Not sure which service fits your situation?{" "}
                <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-500 transition-colors">
                  Tell us about your business
                </Link>{" "}
                and we will recommend the right path.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-navy-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow-light mb-4">How we work</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mb-3">
                How a Wikrena engagement works.
              </h2>
              <p className="text-white/50 text-sm sm:text-base max-w-xl mb-12">
                Every engagement follows the same four steps regardless of which service you choose.
                No scope creep. No invoice you did not expect.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW.map((step, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 h-full">
                    <div className="text-[11px] font-mono text-white/25 mb-4">Step {step.n}</div>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                      <step.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base mb-2">{step.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIFFERENTIATORS ──────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">What makes us different</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy-800 tracking-tight mb-10">
                Built for African businesses. Delivered by experts.
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DIFF.map((d, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-surface p-6 h-full">
                    <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center mb-4">
                      <d.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-display font-bold text-navy-800 text-base mb-2">{d.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="eyebrow mb-4">Questions</div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-navy-800 tracking-tight mb-2">
                Frequently asked questions.
              </h2>
              <p className="text-neutral-500 text-sm mb-10">
                Have a question not answered here? Email{" "}
                <a href="mailto:hello@wikrena.com" className="text-teal-600 hover:text-teal-500 transition-colors">
                  hello@wikrena.com
                </a>{" "}
                and we respond within 24 hours.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion items={FAQS} />
            </Reveal>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-navy-900 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              <div className="eyebrow-light mb-4">Let&apos;s talk</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
                Your data should be working for you.
              </h2>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto">
                Book a free 30-minute discovery call. No pitch. No pressure. Just an honest
                conversation about your data, your AI opportunities, and what we can build together.
              </p>

              <Link
                href="/contact"
                className="btn-shine group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5 mb-12"
              >
                Book a Free Discovery Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
              </Link>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/10">
                {[
                  { icon: Phone, label: "Free discovery call", sub: "30 minutes, no obligation" },
                  { icon: FileCheck, label: "Clear proposal", sub: "Scope and cost upfront" },
                  { icon: Handshake, label: "Founder-led", sub: "Chris on every engagement" },
                  { icon: Target, label: "Africa-first", sub: "Built for this market" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="text-white text-xs font-semibold">{item.label}</div>
                    <div className="text-white/35 text-[11px]">{item.sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <MarketingFooter />
    </>
  );
}
