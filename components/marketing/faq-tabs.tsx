"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { cn } from "@/lib/utils";

const FAQS_PROFESSIONALS = [
  {
    q: "Do I need any prior experience to join?",
    a: "No. Both programs are designed to be accessible from scratch. If you can use a smartphone and are willing to learn consistently, you are ready. We start from the foundation and build from there.",
  },
  {
    q: "Are the sessions live or pre-recorded?",
    a: "Live. Every Wikrena Academy program runs on a live cohort model with weekly sessions, direct instructor access, and peer interaction. We don't believe pre-recorded videos alone build the kind of skills and accountability that lead to real outcomes.",
  },
  {
    q: "What happens after I graduate?",
    a: "You get 90 days of career support: CV review, LinkedIn optimisation, mock interviews, and warm introductions to hiring partners where possible. You also join the Wikrena alumni network for life.",
  },
  {
    q: "How is your Academy different from other data training platforms?",
    a: "Three things. First, we run cohort-based programs with a capped class size, not self-paced courses with thousands of people and no accountability. Second, every program is built on African business data, not generic global datasets. Third, we do not stop at the certificate. Career support and placement assistance are built into every program.",
  },
];

const FAQS_BUSINESSES = [
  {
    q: "How much do your services cost?",
    a: "Every engagement is scoped individually because every business situation is different. We do not publish fixed prices because a one-hour advisory session and a three-month data project are very different things. Book a discovery call and we will give you a clear, honest proposal after understanding your needs.",
  },
  {
    q: "Do we need clean, organised data before working with you?",
    a: "No. Most of our clients come to us with messy, scattered data across spreadsheets, CRM tools, and manual records. Data cleaning and preparation is part of what we do. Bring us what you have.",
  },
  {
    q: "How long does a typical engagement take?",
    a: "A Data Strategy engagement typically takes two to three weeks. A Data Analysis and Reporting project is usually three to six weeks depending on data complexity. Corporate Training is designed around your team's availability.",
  },
  {
    q: "Do you work with businesses outside Nigeria?",
    a: "Yes. Our clients are primarily in Nigeria but we work remotely across Africa. If you are building a business on the continent, we want to work with you.",
  },
];

const TABS = [
  { id: "professionals", label: "For Professionals", items: FAQS_PROFESSIONALS },
  { id: "businesses", label: "For Businesses", items: FAQS_BUSINESSES },
] as const;

export function FaqTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("professionals");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
      <div>
        <div className="inline-flex p-1 rounded-2xl bg-white border border-neutral-200 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                active === t.id ? "bg-navy-800 text-white" : "text-neutral-500 hover:text-navy-800",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <FaqAccordion key={current.id} items={current.items} />
      </div>

      <div className="lg:sticky lg:top-28 h-fit rounded-3xl bg-navy-800 p-9 text-center lg:text-left">
        <h3 className="font-display font-bold text-xl text-white mb-3">Still have questions?</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-8">
          We respond within 24 hours, every time.
        </p>
        <div className="space-y-4">
          <Link
            href="mailto:hello@wikrena.com"
            className="flex items-center justify-center lg:justify-start gap-2.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 text-teal-400 shrink-0" />
            hello@wikrena.com
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center lg:justify-start gap-2.5 text-sm font-bold text-navy-900 bg-teal-500 hover:bg-teal-400 rounded-xl px-5 py-3.5 transition-colors mt-3"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            Book a Discovery Call
          </Link>
        </div>
      </div>
    </div>
  );
}
