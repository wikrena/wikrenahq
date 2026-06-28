"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDES = [
  { src: "/hero/hero-1-data-work.jpg", alt: "Analysts working with data on laptops" },
  { src: "/hero/hero-2-consulting.jpg", alt: "Team in a strategy meeting around a boardroom table" },
  { src: "/hero/hero-3-cohort.jpg", alt: "Cohort members collaborating together" },
  { src: "/hero/hero-4-dashboard.jpg", alt: "Analytics dashboard on a laptop screen" },
  { src: "/hero/hero-5-placement.jpg", alt: "Handshake after a successful placement" },
];

const INTERVAL_MS = 6000;

export function HeroImageCarousel() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            priority={index === 0}
            quality={70}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Brand tint so photos read as art-directed, not raw stock */}
      <div className="absolute inset-0 bg-navy-900/72 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/70 to-navy-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 via-transparent to-navy-900/20" />
    </div>
  );
}
