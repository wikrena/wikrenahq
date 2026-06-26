"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Quote, TrendingUp, ChevronDown } from "lucide-react";
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
  { value: 5, suffix: "+", label: "Years in Data & AI" },
  { value: 3, suffix: "", label: "Core Service Lines" },
  { value: 147, suffix: "+", label: "Professionals Trained" },
  { value: 100, suffix: "%", label: "Africa-First" },
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
  const cardOneY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const cardTwoY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-10 items-center">
          {/* Text column */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-teal-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot" />
              Africa&apos;s Data &amp; AI Infrastructure
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display font-black tracking-tight leading-[1.05] mb-6 text-white text-4xl sm:text-5xl md:text-[3.4rem]"
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

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4 mb-14">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-teal-glow hover:-translate-y-0.5 active:translate-y-0"
              >
                Work with Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/academy"
                className="group inline-flex items-center gap-3 bg-white/5 text-white font-bold text-base px-8 py-4 rounded-2xl border border-white/15 hover:border-teal-400/50 hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Explore the Academy
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Proof strip */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 max-w-xl">
              {PROOFS.map((p) => (
                <div key={p.label}>
                  <div className="font-display font-black text-2xl text-white tracking-tight">
                    <AnimatedCounter value={p.value} suffix={p.suffix} />
                  </div>
                  <div className="text-xs text-white/45 mt-0.5">{p.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual column — floating stat cards with scroll parallax */}
          <div className="relative hidden lg:block h-[420px]">
            <motion.div
              style={{ y: cardOneY }}
              initial={{ opacity: 0, x: 30, rotate: -3 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-6 right-0 w-64 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 shadow-brand-xl animate-float"
            >
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">
                Wikrena Consulting
              </div>
              <div className="flex items-end gap-2 h-20 mb-4">
                {[40, 65, 50, 80, 60, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-teal-500/30 to-teal-400"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                Decision-ready in days
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardTwoY }}
              initial={{ opacity: 0, x: -30, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-2 left-0 w-72 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-6 shadow-brand-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-white leading-none">
                    <AnimatedCounter value={147} suffix="+" />
                  </div>
                  <div className="text-xs text-white/45">Professionals Trained</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-start gap-2">
                <Quote className="w-4 h-4 text-coral-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/50 leading-relaxed">
                  &ldquo;Chris and the team treat you like a professional
                  in training.&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-white/30"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
