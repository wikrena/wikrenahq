import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Hexagon,
  Users,
  Calendar,
  ShieldCheck,
  BookOpen,
  Hammer,
  Briefcase,
  Star,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { ProgramShowcase } from "@/components/marketing/program-showcase";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Wikrena Academy — Cohort-Based Data & AI Training",
  description:
    "Cohort-based, Africa-specific data and AI training. Build real skills on real African business data, get instructor feedback, and leave with a portfolio employers actually look at.",
};

const HERO_STATS = [
  { value: 147, suffix: "+", label: "Students" },
  { value: 3, suffix: "", label: "Programs" },
  { value: 3, suffix: "", label: "Tracks" },
  { value: 100, suffix: "%", label: "Real Projects" },
];

const ABOUT_BULLETS = [
  "Small, capped cohorts: real attention, not a number",
  "Live weekly sessions with your instructor, not pre-recorded lectures",
  "Capstone project built on real African industry data",
  "90-day post-graduation career support",
  "Lifetime alumni network access",
];

const ABOUT_STATS = [
  { value: 147, suffix: "+", label: "Professionals trained" },
  { value: 3, suffix: "", label: "Programs to choose from" },
  { value: 90, suffix: "", label: "Days of career support" },
  { value: 100, suffix: "%", label: "Capstones on real data" },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    icon: BookOpen,
    title: "Learn",
    desc: "Build the technical foundation: tools, concepts, and thinking that employers actually need. Live sessions, real datasets, no-fluff curriculum.",
  },
  {
    n: "02",
    icon: Hammer,
    title: "Build",
    desc: "Apply everything to a real capstone project in your industry track. Present it to the cohort and industry guests. Publish it on GitHub. That's your portfolio.",
  },
  {
    n: "03",
    icon: Briefcase,
    title: "Get Placed",
    desc: "CV review, LinkedIn optimisation, mock interviews, warm introductions to hiring partners. Then 90 days of post-graduation support until you land.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Before Wikrena Academy, I struggled to get real insight from spreadsheets. Nine weeks in, I was confidently using Excel to analyze business data that guide decisions across my company. The impact was immediate.",
    name: "Deborah Boma",
    role: "Business Owner · Majik Fire, Enugu",
    initials: "DB",
    color: "bg-teal-500",
  },
  {
    quote:
      "Training at Wikrena feels like learning from someone who has actually been where you are. Chris and the team treat you like a professional in training, not just a student in a classroom, and that shift makes all the difference.",
    name: "Emeka Obi",
    role: "Radiologist · Health Facility, PH",
    initials: "EO",
    color: "bg-navy-800",
  },
  {
    quote:
      "The training was intense yet rewarding, and the support from the instructors and community keeps me motivated. I can't wait to apply these skills and transform my career!",
    name: "Mrs Ifeoma Eneh",
    role: "Senior Systems Analyst · NCAA",
    initials: "IE",
    color: "bg-coral-500",
  },
];

const FAQS = [
  {
    q: "Do I need any prior experience to join?",
    a: "No. All three programs are designed to be accessible from scratch. If you can use a smartphone and are willing to learn consistently, you are ready. We start from the foundation and build from there.",
  },
  {
    q: "What's the difference between the three programs?",
    a: "The Data Analytics Professional Program is a 12-15 week deep-dive into data analysis: SQL, Python, Power BI, Excel and a full industry capstone. It's for people who want to become data analysts or seriously upskill. The AI Automation Specialist Program is shorter and focused on using AI tools and no-code platforms like Zapier and Make.com to automate workflows, for business owners and professionals who want to work smarter without becoming analysts. The SPSS Program is a self-paced, 7-week track built for researchers and postgraduate students who need to analyse and report on survey or research data.",
  },
  {
    q: "Are the sessions live or pre-recorded?",
    a: "Live, for the cohort-based programs. Every cohort runs on a live model with weekly sessions, direct instructor access, and peer interaction. We don't believe pre-recorded videos alone build the kind of skills and accountability that lead to real outcomes. The SPSS Program is the exception: it's self-paced by design, for learners who need flexibility.",
  },
  {
    q: "What happens if I miss a session?",
    a: "Sessions are recorded and shared with cohort members. But we encourage consistent attendance because the live interaction, peer feedback, and instructor Q&A are a significant part of what you are paying for.",
  },
  {
    q: "What happens after I graduate?",
    a: "You get 90 days of career support: CV review, LinkedIn optimisation, mock interviews, and warm introductions to hiring partners where possible. You also join the Wikrena alumni network for life. If you've completed all program requirements and haven't landed within 90 days, we extend support at no cost.",
  },
];

export default function AcademyPage() {
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
            <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.14] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.coral.500),transparent_70%)]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono text-white/40">
                <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                Wikrena Academy
              </div>
              <h1 className="font-display font-black tracking-tight leading-[1.05] mb-6 text-white text-4xl sm:text-5xl md:text-6xl">
                The Shortest Distance Between
                <br className="hidden sm:block" /> Where You Are and a Data Career.
              </h1>
              <p className="text-base sm:text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
                Most people interested in data spend months consuming content and going nowhere.
                Wikrena Academy is built differently. Cohort-based. Practically focused.
                Africa-specific. We work with you until the outcome is real.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
                <Link
                  href="#programs"
                  className="btn-shine group inline-flex items-center gap-2.5 sm:gap-3 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100"
                >
                  Explore Programs
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 sm:gap-3 bg-white/5 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  Talk to Us First
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-white/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT THE ACADEMY ───────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="eyebrow">About the Academy</div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-6">
                  Not Another Online Course.
                  <br /> A Real Career Investment.
                </h2>
                <p className="text-neutral-500 text-base leading-relaxed mb-4">
                  The internet is full of data courses. Most of them give you videos, a certificate,
                  and nothing else. No feedback. No community. No idea what to do next.
                </p>
                <p className="text-neutral-500 text-base leading-relaxed mb-4">
                  Wikrena Academy was built because that wasn&apos;t good enough for Africa. We run
                  small cohorts, where you learn alongside peers, build on real African business
                  data, get direct instructor feedback, and leave with a portfolio project you can
                  actually show an employer.
                </p>
                <p className="text-neutral-500 text-base leading-relaxed mb-8">
                  We don&apos;t stop at graduation. Every student gets 90 days of career support
                  after the program ends. Because the certificate is not the point. The outcome is.
                </p>
                <ul className="space-y-3">
                  {ABOUT_BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-neutral-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  {ABOUT_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="bg-neutral-50 border border-neutral-200 rounded-2xl p-7 text-center"
                    >
                      <div className="font-display font-black text-3xl sm:text-4xl text-navy-800 tracking-tight mb-1">
                        <AnimatedCounter value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-sm text-neutral-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── PROGRAMS ─────────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50" id="programs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-12">
                <div className="eyebrow justify-center">Our Programs</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
                  Three Programs. One Clear Path Forward in Data.
                </h2>
                <p className="text-neutral-500 text-base max-w-xl mx-auto">
                  Choose the program that matches where you are and where you want to go. All
                  three are practical and built to produce real outcomes.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ProgramShowcase />
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-center text-sm text-neutral-500 mt-8">
                Not sure which program is right for you?{" "}
                <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-700">
                  Talk to us first →
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-14">
                <div className="eyebrow justify-center">How It Works</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
                  Simple. Structured. Outcome-Focused.
                </h2>
                <p className="text-neutral-500 text-base max-w-2xl mx-auto">
                  Every Wikrena Academy program follows the same three-chapter structure, designed
                  so that by the time you finish, you have more than a certificate.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.08}>
                  <div className="h-full bg-neutral-50 border border-neutral-200 rounded-2xl p-8 hover:border-teal-300 hover:shadow-card-hover transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display font-black text-3xl text-teal-500/30 tracking-tight">
                        {step.n}
                      </span>
                      <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-teal-600" />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-xl text-navy-800 mb-3">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-14">
                <div className="eyebrow justify-center">What Our Students Say</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight">
                  Real People. Real Outcomes.
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div className="h-full bg-white border border-neutral-200 rounded-2xl p-7 hover:border-teal-300 hover:shadow-card transition-all">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-6">{t.quote}</p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-navy-800">{t.name}</div>
                        <div className="text-xs text-neutral-400">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="text-center mb-12">
                <div className="eyebrow justify-center">Common Questions</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
                  Frequently Asked Questions.
                </h2>
                <p className="text-neutral-500 text-base">
                  Still have questions? Email us at{" "}
                  <Link href="mailto:hello@wikrena.com" className="text-teal-600 font-semibold hover:text-teal-700">
                    hello@wikrena.com
                  </Link>{" "}
                  and we&apos;ll respond within 24 hours.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <FaqAccordion items={FAQS} />
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-navy-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-[0.14] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
            <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.coral.500),transparent_70%)]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono text-white/40">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                Ready to Start
              </div>
              <h2 className="font-display font-black tracking-tight text-white text-3xl sm:text-4xl md:text-5xl mb-6">
                The Next Cohort Starts August 17, 2026.
              </h2>
              <p className="text-white/55 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Spots are limited each cohort. Once they&apos;re gone, the next opening is months away.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/paths/data-analytics"
                  className="btn-shine group inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 ease-brand shadow-teal-glow hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  Reserve Your Spot
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-white/5 text-white font-bold text-base px-8 py-4 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all duration-300 ease-brand hover:-translate-y-0.5"
                >
                  I Have Questions
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="inline-flex items-start gap-4 bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 text-left max-w-xl">
                <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-sm text-white mb-1">
                    The Wikrena Commitment
                  </div>
                  <p className="text-xs text-white/55 leading-relaxed">
                    Complete every module, submit your capstone, attend the career sessions. If
                    you&apos;ve done all three and not landed within 90 days of graduation, we
                    extend your support at no extra cost. We succeed when you succeed.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/40">
                <Users className="w-4 h-4 text-teal-400" />
                <Link href="mailto:hello@wikrena.com" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-400" />
                  hello@wikrena.com
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
