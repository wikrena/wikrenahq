import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Wikrena Academy — Learn Data. Get Hired.",
  description:
    "Africa's most outcome-driven data school. Go from zero to earning as a data professional using real business data, cohort learning and an AI tutor.",
};

const PROOFS = [
  "147+ professionals trained",
  "92% completion rate",
  "90-day post-grad support",
  "Max 45 per cohort",
];

const STATS = [
  { value: "147+", label: "Professionals Trained", icon: "🎓" },
  { value: "92%", label: "Completion Rate", icon: "🎯" },
  { value: "45", label: "Max Students / Cohort", icon: "👥" },
  { value: "90", label: "Days Post-Grad Support", icon: "📅" },
];

const PATHS = [
  {
    featured: true,
    icon: "📊",
    title: "Data Analytics",
    slug: "data-analytics",
    desc: "Nigeria's fastest-growing skill gap. You'll work on real datasets from Paystack, Access Bank and Jumia — building dashboards, writing SQL and telling stories with data that actually get used in decisions.",
    weeks: "12 weeks",
    level: "Beginner friendly",
    levelColor: "",
    modules: [
      { n: "SQL Fundamentals", shared: true },
      { n: "Excel & Sheets", shared: false },
      { n: "Power BI", shared: false },
      { n: "Data Storytelling", shared: true },
      { n: "Problem Solving", shared: false },
    ],
  },
  {
    featured: false,
    icon: "🔬",
    title: "Research Analysis with SPSS",
    slug: "research-spss",
    desc: "For researchers, postgraduate students and healthcare professionals who need to analyse data, interpret results and publish. Master SPSS, survey design and academic data presentation.",
    weeks: "8 weeks",
    level: "All levels",
    levelColor: "purple",
    modules: [
      { n: "Statistics", shared: true },
      { n: "SPSS Interface", shared: false },
      { n: "Survey Design", shared: false },
      { n: "Report Writing", shared: true },
    ],
  },
  {
    featured: false,
    icon: "⚡",
    title: "AI Automation",
    slug: "ai-automation",
    desc: "Build AI workflows without writing code. Automate repetitive work using Zapier, Make and AI agents. For professionals who want to do more in less time.",
    weeks: "6 weeks",
    level: "No code needed",
    levelColor: "amber",
    modules: [
      { n: "AI Agents (n8n)", shared: true },
      { n: "Zapier & Make", shared: false },
      { n: "Prompt Engineering", shared: true },
      { n: "GPT APIs", shared: false },
    ],
  },
];

const FEATURES = [
  {
    icon: "💻",
    title: "In-Browser Code Editor",
    desc: "Write Python and SQL in your browser. VS Code quality. Zero setup. Your code runs on real infrastructure.",
    tag: "Monaco + Judge0",
    accent: "#2ec4b6",
    tagColor: "text-teal-700 bg-teal-50 border-teal-200",
  },
  {
    icon: "🤖",
    title: "Wren — Your AI Tutor",
    desc: "Get unstuck instantly without waiting for an instructor. Wren knows your progress and explains everything with real African business context.",
    tag: "Built for how we Learn",
    accent: "#ff6b3d",
    tagColor: "text-orange-700 bg-orange-50 border-orange-200",
  },
  {
    icon: "🌍",
    title: "Africa Data Lab",
    desc: "12+ real datasets from real African companies. You learn on the same data you'll use in your first job.",
    tag: "Learn problem solving with real data",
    accent: "#a78bfa",
    tagColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
  {
    icon: "🏆",
    title: "XP, Badges & Leaderboards",
    desc: "Every lesson earns XP. Climb from Curious Learner to Legend. Compete weekly in your cohort and keep your streak alive.",
    tag: "Gamified for consistency",
    accent: "#f59e0b",
    tagColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    icon: "👥",
    title: "Cohort Learning",
    desc: "Max 45 students. Live sessions, peer reviews, assignments and accountability every week. You will not disappear into a course library.",
    tag: "Max 45 students",
    accent: "#2ec4b6",
    tagColor: "text-teal-700 bg-teal-50 border-teal-200",
  },
  {
    icon: "🎯",
    title: "Post-Grad Support",
    desc: "Portfolio builder, AI resume review, mock interviews, Africa-curated job board. We stay until you land — not until the course ends.",
    tag: "Until you're placed",
    accent: "#2ec4b6",
    tagColor: "text-teal-700 bg-teal-50 border-teal-200",
  },
];

const GAMIFICATION = [
  {
    icon: "🔥",
    title: "Daily Streaks",
    desc: "Miss a day, lose your streak. Use a freeze to protect it and stay in the game.",
  },
  {
    icon: "⚡",
    title: "XP & Levels",
    desc: "Beginner → Explorer → Analyst → Senior Analyst → Expert → Legend",
  },
  {
    icon: "🏅",
    title: "30+ Badges",
    desc: "From First Flame to Month Champion. Rare, epic and legendary tiers.",
  },
  {
    icon: "🏆",
    title: "Weekly Leaderboard",
    desc: "Compete with your cohort. Top 3 earn bonus XP and special badges every week.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Before Wikrena, I had no idea what SQL even was. Eight weeks in, I was writing queries on real transaction data and presenting dashboards to my team.",
    name: "Ruth Ugwu",
    role: "Dietitian & Healthcare Analyst · Safari Pharmacy",
    initials: "RU",
    color: "bg-teal-500",
  },
  {
    quote:
      "The cohort format kept me accountable every single week. I came in knowing nothing about Power BI and left with three dashboard projects ready for my portfolio.",
    name: "Chidera Agor",
    role: "Data Analyst · Wise Breed Analytics",
    initials: "CA",
    color: "bg-navy-800",
  },
  {
    quote:
      "The training is intense yet rewarding, and the support from the instructors and community keeps me motivated. I can’t wait to apply these skills and transform my career!",
    name: "Mrs Ifeoma Eneh",
    role: "Senior Systems Analyst · NCAA",
    initials: "IE",
    color: "bg-coral-500",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AcademyPage() {
  return (
    <>
      <MarketingNav />
      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden bg-white min-h-screen flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.28]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,#d1d8e4 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div
              className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{
                background:
                  "radial-gradient(circle,#2ec4b6 0%,transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
              style={{
                background:
                  "radial-gradient(circle,#ff6b3d 0%,transparent 70%)",
              }}
            />
            <div className="absolute top-1/3 right-[8%] w-4 h-4 rounded-full bg-coral-400 opacity-40 animate-float" />
            <div
              className="absolute top-1/2 left-[6%] w-2.5 h-2.5 rounded-full bg-teal-400 opacity-30 animate-float"
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className="absolute bottom-1/3 right-[15%] w-2 h-2 rounded-full bg-amber-400 opacity-25 animate-float"
              style={{ animationDelay: "0.8s" }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-mono font-normal px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse-dot shrink-0" />
                Wikrena Academy — Africa&apos;s Data &amp; AI Learning Platform
              </div>

              <h1
                className="font-display font-black tracking-tighter leading-[0.95] mb-6 text-navy-800"
                style={{ fontSize: "clamp(2.8rem,7vw,5.2rem)" }}
              >
                Learn Data.{" "}
                <span className="text-gradient-teal">Get Hired.</span>
              </h1>

              <p className="text-base sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-5 leading-relaxed font-light tracking-tight">
                Africa&apos;s most outcome-driven data school. Go from zero to{" "}
                <span className="text-navy-800 font-semibold">
                  earning as a data professional in Africa
                </span>{" "}
                using real business data. Cohorts of 45. A strong community that
                delivers result.
              </p>

              <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10 flex-wrap">
                {PROOFS.map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-1.5 text-sm text-neutral-500"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    {p}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 bg-navy-800 hover:bg-navy-700 text-white font-black text-base px-8 py-4 rounded-2xl transition-all shadow-brand-sm hover:shadow-brand-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-3 bg-white text-navy-800 font-bold text-base px-8 py-4 rounded-2xl border-2 border-neutral-200 hover:border-teal-300 transition-all hover:-translate-y-0.5"
                >
                  View Pricing
                </Link>
              </div>

              {/* Platform preview */}
              <div className="relative max-w-4xl mx-auto">
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-10 blur-2xl opacity-20 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #2ec4b6, #0a192f)",
                  }}
                />
                <div className="relative rounded-2xl border border-neutral-200 overflow-hidden shadow-brand-xl bg-white">
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-center text-xs font-mono text-neutral-400 border border-neutral-200">
                      academy.wikrena.com/learn/sql-fundamentals
                    </div>
                  </div>
                  <div className="grid grid-cols-5 h-64 sm:h-80">
                    <div className="col-span-1 bg-navy-800 p-3 hidden sm:flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 px-2 py-2 mb-2 border-b border-white/10">
                        <div className="w-5 h-5 rounded bg-teal-500 flex items-center justify-center">
                          <span className="text-navy-800 font-black text-[9px]">
                            W
                          </span>
                        </div>
                        <span className="text-white text-[10px] font-semibold">
                          Wikrena
                        </span>
                      </div>
                      {[
                        "🏠 Home",
                        "📚 Paths",
                        "💻 Code",
                        "🏆 Rank",
                        "🤖 Wren",
                      ].map((item, i) => (
                        <div
                          key={item}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] ${i === 1 ? "bg-teal-500/20 text-teal-300 font-semibold" : "text-white/40"}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="col-span-5 sm:col-span-4 grid grid-cols-2 bg-neutral-50">
                      <div className="border-r border-neutral-200 flex flex-col bg-white overflow-hidden">
                        <div className="px-3 pt-3 pb-2 border-b border-neutral-100">
                          <div className="text-[9px] font-mono text-teal-600 mb-1">
                            SQL · Lesson 3
                          </div>
                          <div className="font-display font-bold text-xs text-navy-800">
                            Filtering with WHERE
                          </div>
                        </div>
                        <div className="flex-1 p-3 text-[10px] text-neutral-600 leading-relaxed overflow-hidden">
                          <p className="mb-2">
                            The{" "}
                            <code className="bg-teal-50 text-teal-700 px-1 rounded font-mono">
                              WHERE
                            </code>{" "}
                            clause filters rows. At Access Bank, analysts use it
                            daily.
                          </p>
                          <div className="bg-navy-800 rounded-lg p-2 font-mono text-[9px] text-teal-300 leading-loose">
                            <span className="text-blue-300">SELECT</span> *{" "}
                            <span className="text-blue-300">FROM</span>
                            <br />
                            <span className="text-yellow-300">
                              {" "}
                              transactions
                            </span>
                            <br />
                            <span className="text-blue-300">WHERE</span> amount
                            <br />
                            <span className="text-coral-300"> &gt;</span>{" "}
                            <span className="text-green-300">50000</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col bg-[#0d1117] overflow-hidden">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span className="text-[9px] font-mono text-white/50">
                            SQL Editor
                          </span>
                        </div>
                        <div className="flex-1 p-2 font-mono text-[9px] leading-loose overflow-hidden">
                          <span className="text-blue-400">SELECT</span>
                          <span className="text-white"> * </span>
                          <span className="text-blue-400">FROM</span>
                          <span className="text-yellow-300"> sales</span>
                          <br />
                          <span className="text-blue-400">WHERE</span>
                          <span className="text-white"> region </span>
                          <span className="text-coral-300">=</span>
                          <span className="text-green-300">
                            {" "}
                            &apos;Lagos&apos;
                          </span>
                          <br />
                          <span className="text-blue-400">AND</span>
                          <span className="text-white"> amount </span>
                          <span className="text-coral-300">&gt;</span>
                          <span className="text-green-300"> 10000</span>
                          <span className="animate-pulse text-teal-400 ml-0.5">
                            |
                          </span>
                        </div>
                        <div className="px-2 py-1.5 border-t border-white/[0.06] flex items-center justify-between bg-teal-500/10">
                          <span className="text-[8px] font-mono text-teal-400">
                            ✓ 47 rows · 0.02s
                          </span>
                          <span className="text-[8px] font-mono text-white/40">
                            +15 XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <section className="border-y border-neutral-100 bg-neutral-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-neutral-100">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center py-10 px-6 text-center"
                >
                  <span className="text-3xl mb-3">{s.icon}</span>
                  <div className="font-display font-black text-4xl text-navy-800 mb-1 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-sm text-neutral-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PATHS ────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white" id="paths">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <div className="eyebrow justify-center">
                Learning Paths
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
                Start with one skill. Grow into a career.
              </h2>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">
                Begin with data analytics, then expand into engineering, AI, and
                automation as you gain{" "}
                <span className="text-teal-600 font-semibold">
                  real experience.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Featured card — Data Analytics */}
              <div className="lg:col-span-2 bg-navy-800 rounded-2xl p-7 relative overflow-hidden flex flex-col">
                <div
                  className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.15]"
                  style={{
                    background:
                      "radial-gradient(circle,#2ec4b6,transparent 70%)",
                  }}
                />
                <div className="inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full self-start mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Most Popular
                </div>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-display font-black text-2xl text-white tracking-tight mb-3">
                  Data Analytics
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-5 flex-1">
                  Nigeria&apos;s fastest-growing skill gap. You&apos;ll work on
                  real datasets from Nigeria & African companies; building
                  dashboards, writing SQL and telling stories with data that
                  actually get used in decisions.
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/25">
                    12 weeks
                  </span>
                  <span
                    className="text-[11px] font-bold px-3 py-1.5 rounded-full text-white/55 border border-white/12"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    Beginner friendly
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {PATHS[0].modules.map((m) => (
                    <span
                      key={m.n}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded border ${
                        m.shared
                          ? "text-teal-400 border-teal-500/20"
                          : "text-white/40 border-white/10"
                      }`}
                      style={{
                        background: m.shared
                          ? "rgba(46,196,182,0.1)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {m.shared && "✓ "}
                      {m.n}
                    </span>
                  ))}
                </div>
                <Link
                  href="/paths/data-analytics"
                  className="inline-flex items-center gap-2 text-teal-400 font-bold text-sm hover:text-teal-300 transition-colors group mt-auto"
                >
                  Explore path
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Secondary paths */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                {PATHS.slice(1).map((path) => (
                  <Link
                    key={path.slug}
                    href={`/paths/${path.slug}`}
                    className="group block bg-white border-2 border-neutral-100 hover:border-teal-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 flex-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl shrink-0 mt-0.5">
                        {path.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg text-navy-800 mb-1.5 group-hover:text-teal-600 transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                          {path.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                            {path.weeks}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              path.levelColor
                                ? LEVEL_COLORS[path.levelColor]
                                : "bg-neutral-50 text-neutral-600 border-neutral-200"
                            }`}
                          >
                            {path.level}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {path.modules.map((m) => (
                            <span
                              key={m.n}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                m.shared
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : "bg-neutral-50 text-neutral-500 border-neutral-200"
                              }`}
                            >
                              {m.shared && "✓ "}
                              {m.n}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <div className="eyebrow justify-center">
                Platform Features
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight">
                Built for how Africans actually learn.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-neutral-200 rounded-2xl p-7 hover:shadow-card-hover transition-all duration-200 group"
                  style={{ borderLeft: `3px solid ${f.accent}` }}
                >
                  <div className="text-3xl mb-5">{f.icon}</div>
                  <h3 className="font-display font-bold text-lg text-navy-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                    {f.desc}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${f.tagColor}`}
                  >
                    {f.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GAMIFICATION ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="eyebrow">Gamification</div>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-6">
                  Learning should feel like leveling up.
                </h2>
                <p className="text-neutral-500 text-base mb-8 leading-relaxed">
                  Every action earns XP. Every streak gets rewarded. Every
                  milestone unlocks a badge. Consistency is everything — so we
                  made it feel like a game.
                </p>
                <div className="space-y-5">
                  {GAMIFICATION.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="text-2xl mt-0.5 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-navy-800 mb-0.5">
                          {item.title}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-navy-800 rounded-3xl p-7 shadow-brand-xl">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">
                      Current Level
                    </div>
                    <div className="font-display font-black text-2xl text-white">
                      ⚡ Senior Analyst
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-teal-500/20 border border-teal-500/30 text-teal-300 px-3 py-1.5 rounded-full">
                    1,840 XP
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono text-white/40 mb-2">
                  <span>Progress to Expert</span>
                  <span>68%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-teal-500 to-teal-700" />
                </div>
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
                  Badges Earned
                </div>
                <div className="flex gap-2.5 flex-wrap mb-6">
                  {["🔥", "👑", "📅", "🧠", "⭐"].map((b) => (
                    <div
                      key={b}
                      className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xl"
                    >
                      {b}
                    </div>
                  ))}
                  {["🏆", "🎓"].map((b) => (
                    <div
                      key={b}
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl opacity-20 grayscale"
                    >
                      {b}
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-5">
                  <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
                    This Week&apos;s Leaderboard
                  </div>
                  {[
                    {
                      rank: 1,
                      name: "Femi Kolade",
                      xp: "+380",
                      initials: "CK",
                      color: "#2ec4b6",
                    },
                    {
                      rank: 2,
                      name: "Abdul Rahman",
                      xp: "+290",
                      initials: "NI",
                      color: "#ff6b3d",
                    },
                    {
                      rank: 3,
                      name: "Adaeze Okonkwo",
                      xp: "+245",
                      initials: "AO",
                      color: "#7b8cde",
                    },
                  ].map((e) => (
                    <div
                      key={e.rank}
                      className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
                    >
                      <span className="w-5 text-xs font-mono font-bold text-teal-400">
                        #{e.rank}
                      </span>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: e.color }}
                      >
                        {e.initials}
                      </div>
                      <span className="flex-1 text-sm text-white/80">
                        {e.name}
                      </span>
                      <span className="text-xs font-mono text-teal-400">
                        {e.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <div className="eyebrow justify-center">Results</div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight">
                What our students say.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-neutral-50 border border-neutral-200 rounded-2xl p-7 hover:border-teal-300 hover:shadow-card transition-all"
                >
                  <div className="text-4xl text-teal-300 font-serif mb-4 leading-none">
                    &ldquo;
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-navy-800">
                        {t.name}
                      </div>
                      <div className="text-xs text-neutral-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="eyebrow justify-center">Get Started</div>
            <h2
              className="font-display font-black tracking-tight text-navy-800 mb-6"
              style={{ fontSize: "clamp(2.2rem,5vw,3rem)" }}
            >
              Start your journey to becoming{" "}
              <span className="text-gradient-teal">a paid </span>Data
              Professional.
            </h2>
            <p className="text-neutral-500 text-xl mb-10 max-w-lg mx-auto">
              Join the next cohort. Build real skills. Get placed. Build the
              career you&apos;d be proud of.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-black text-base px-9 py-4 rounded-2xl transition-all shadow-brand-sm hover:shadow-teal-glow hover:-translate-y-0.5"
              >
                Start Learning Free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-navy-800 font-bold text-base px-9 py-4 rounded-2xl border-2 border-neutral-200 hover:border-teal-300 transition-all hover:-translate-y-0.5"
              >
                View Pricing
              </Link>
            </div>
            <div
              className="inline-flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-6 py-4 shadow-brand-sm text-left"
              style={{ borderLeft: "4px solid #2ec4b6" }}
            >
              <span className="text-2xl shrink-0">🤝</span>
              <div>
                <div className="font-semibold text-sm text-navy-800 mb-0.5">
                  The Wikrena Placement Promise
                </div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  Complete the program. If you haven&apos;t landed in 90 days,
                  we extend support — at no cost, no questions asked.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
