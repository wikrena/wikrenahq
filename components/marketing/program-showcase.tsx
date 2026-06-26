"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  tag: string;
  shortTitle: string;
  title: string;
  desc: string;
  bullets: string[];
  href: string;
  details: [string, string][];
}

const PROGRAMS: Program[] = [
  {
    id: "data-analytics",
    tag: "Flagship Program",
    shortTitle: "Data Analytics",
    title: "Data Analytics Professional Program",
    desc: "Go from spreadsheets to a full analytics skill set: Python, SQL, Power BI and Excel, with an industry track built around the kind of data you'll actually work with on the job.",
    bullets: [
      "Python, SQL, Power BI and Excel",
      "Fintech, Healthcare or Retail industry track",
      "Capstone project with real data",
      "90 days of career support after graduation",
    ],
    href: "/paths/data-analytics",
    details: [
      ["Instructor", "Chris Awoke · Wikrena Academy"],
      ["Level", "Beginner to Advanced"],
      ["Format", "Cohort-based · Live Sessions"],
      ["Duration", "12 to 15 weeks"],
    ],
  },
  {
    id: "ai-automation",
    tag: "Featured Course",
    shortTitle: "AI Automation",
    title: "AI Automation Specialist Program",
    desc: "Learn to use AI tools and automation platforms to eliminate repetitive work and build smarter workflows, no coding required. For business owners and professionals who want to work smarter, immediately.",
    bullets: [
      "Zapier, Make.com, n8n and AI workflow tools",
      "Build automations on your actual work processes",
      "Career, Professional or Business track",
      "Certificate of completion",
    ],
    href: "/paths/ai-automation",
    details: [
      ["Instructor", "Chris Awoke · Wikrena Academy"],
      ["Level", "All Levels"],
      ["Format", "Cohort-based + 2-week capstone"],
      ["Duration", "8 weeks + capstone"],
    ],
  },
  {
    id: "spss",
    tag: "Self-Paced",
    shortTitle: "SPSS",
    title: "Research & Data Analysis with SPSS",
    desc: "Built for postgraduate researchers, academics, and healthcare or NGO staff who need to run rigorous statistical analysis on their own research data, at their own pace.",
    bullets: [
      "Built for postgraduate researchers and academics",
      "Self-paced, 34 lessons across 7 weeks",
      "Tiered pricing: Starter, Professional, Premium",
      "Designed for healthcare and NGO data work",
    ],
    href: "/paths/research-spss",
    details: [
      ["Instructor", "Wikrena Academy"],
      ["Level", "Postgraduate / Research"],
      ["Format", "Self-paced"],
      ["Duration", "7 weeks · 34 lessons"],
    ],
  },
];

export function ProgramShowcase() {
  const [active, setActive] = useState(0);
  const program = PROGRAMS[active];

  return (
    <div className="bg-navy-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.15] pointer-events-none bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />

      {/* Tab selector */}
      <div className="relative flex flex-wrap gap-2 mb-9">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
              active === i
                ? "bg-teal-500 text-navy-900 border-teal-500"
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white",
            )}
          >
            {p.shortTitle}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[11px] font-mono tracking-wide px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              {program.tag}
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mb-4">
              {program.title}.
            </h2>
            <p className="text-white/55 text-sm sm:text-base leading-relaxed mb-6">{program.desc}</p>
            <ul className="space-y-2 mb-7">
              {program.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={program.href}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="text-[11px] font-mono text-white/40 tracking-wide mb-4">Program Details</div>
            <div className="space-y-3 text-sm">
              {program.details.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white/80 font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
