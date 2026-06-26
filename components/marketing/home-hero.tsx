"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, Hexagon } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { AnimatedCounter } from "@/components/marketing/animated-counter";

const PROOFS = [
  { value: 3, suffix: "", label: "Core Service Lines" },
  { value: 147, suffix: "+", label: "Professionals Trained" },
  { value: 100, suffix: "%", label: "Africa-First" },
];

const NODES = [
  { cx: 24, cy: 72, color: "#94a3b8", delay: 0 },
  { cx: 70, cy: 18, color: "#2ec4b6", delay: 0.4 },
  { cx: 116, cy: 72, color: "#ff6b3d", delay: 0.8 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function HomeHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const glowY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const glow = useMotionTemplate`radial-gradient(560px circle at ${glowX}px ${glowY}px, rgba(46,196,182,0.16), transparent 75%)`;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const cardOneY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const cardTwoY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const cardThreeY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-navy-900"
    >
      {/* Static texture + glows */}
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

      {/* Cursor-tracking spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glow }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-10 items-center">
          {/* Text column */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono text-white/40"
            >
              <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
              Africa&apos;s data &amp; AI infrastructure
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display font-black tracking-tight leading-[1.05] mb-6 text-white text-4xl sm:text-[2.75rem] md:text-[2.95rem]"
            >
              We Work With Businesses.
              <br />
              We Train <span className="text-gradient-teal">the People</span> Who Run Them.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/55 max-w-lg mb-10 leading-relaxed">
              Wikrena is a data and AI company built for Africa-focused
              businesses. We help businesses make smarter decisions with
              their data. And we train the professionals who make that
              work happen.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-12 sm:mb-14">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2.5 sm:gap-3 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all shadow-teal-glow hover:-translate-y-0.5 active:translate-y-0"
              >
                Work with Us
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/academy"
                className="group inline-flex items-center gap-2.5 sm:gap-3 bg-white/5 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Explore the Academy
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Proof strip */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-5 max-w-xl">
              {PROOFS.map((p) => (
                <div key={p.label}>
                  <div className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                    <AnimatedCounter value={p.value} suffix={p.suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/45 mt-0.5">{p.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual column: floating system cards with scroll parallax */}
          <div className="relative hidden lg:block h-[400px]">
            {/* Consulting: live trend chart */}
            <motion.div
              style={{ y: cardOneY }}
              initial={{ opacity: 0, x: 30, rotate: -3 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-4 right-6 w-56 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-5 shadow-brand-xl animate-float z-20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-white/40 tracking-wide">Consulting</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-400 bg-teal-500/10 rounded-full px-1.5 py-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  18%
                </span>
              </div>
              <svg viewBox="0 0 200 64" className="w-full h-14" fill="none">
                <defs>
                  <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2ec4b6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2ec4b6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,52 L28,44 L56,48 L84,30 L112,34 L140,16 L168,20 L200,4 L200,64 L0,64 Z"
                  fill="url(#heroChartFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                />
                <motion.path
                  d="M0,52 L28,44 L56,48 L84,30 L112,34 L140,16 L168,20 L200,4"
                  stroke="#2ec4b6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="text-[11px] text-white/40 mt-2">Decision-ready in days</div>
            </motion.div>

            {/* Ecosystem: flowing network */}
            <motion.div
              style={{ y: cardThreeY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[125px] left-12 w-40 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-sm p-4 shadow-brand-xl animate-float delay-200 z-10"
            >
              <svg viewBox="0 0 140 90" className="w-full h-16">
                <line x1="24" y1="72" x2="70" y2="18" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                <line x1="70" y1="18" x2="116" y2="72" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                <line x1="24" y1="72" x2="116" y2="72" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                {NODES.map((n, i) => (
                  <motion.circle
                    key={i}
                    cx={n.cx}
                    cy={n.cy}
                    fill={n.color}
                    initial={{ r: 4 }}
                    animate={{ r: [4, 6, 4] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
                  />
                ))}
              </svg>
              <div className="text-[11px] font-mono text-white/40 tracking-wide mt-1">One Ecosystem</div>
            </motion.div>

            {/* Academy: career readiness */}
            <motion.div
              style={{ y: cardTwoY }}
              initial={{ opacity: 0, x: -30, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-2 right-10 w-60 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-6 shadow-brand-xl animate-float delay-300 z-20"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="6" />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#2ec4b6"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 0.82) }}
                      transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-display font-black text-white">
                    82%
                  </div>
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-white leading-none">
                    <AnimatedCounter value={147} suffix="+" />
                  </div>
                  <div className="text-xs text-white/45">Professionals Trained</div>
                </div>
              </div>
              <div className="border-t border-white/10 mt-4 pt-3 flex items-center gap-1.5">
                {["IE", "RU", "SI"].map((initials, i) => (
                  <div
                    key={initials}
                    className="w-6 h-6 rounded-full border-2 border-navy-800 bg-teal-500/80 flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  >
                    {initials}
                  </div>
                ))}
                <span className="text-[11px] text-white/40 ml-2">Career-ready cohort</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-white/30"
      >
        <span className="text-[11px] font-mono tracking-wide">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
