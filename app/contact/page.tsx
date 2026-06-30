import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  BarChart3,
  Users,
  Hexagon,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";
import { ContactForm } from "@/components/marketing/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — Wikrena",
  description:
    "Get in touch with the Wikrena team. Whether you want to join the Academy, explore a consulting engagement, or bring data and AI training to your organisation, we want to hear from you.",
};

const PATHS = [
  {
    icon: GraduationCap,
    title: "Joining the Academy",
    desc: "You want to build a career in data or AI, get certified, and land a role. Tell us about your background and what you are aiming for.",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
  },
  {
    icon: BarChart3,
    title: "Data and AI Consulting",
    desc: "You run or work in a business that needs better data, smarter reporting, or AI workflow support. We start with a free discovery call.",
    color: "bg-navy-50 border-navy-200",
    iconColor: "text-navy-700",
    iconBg: "bg-navy-100",
  },
  {
    icon: Users,
    title: "Corporate Training",
    desc: "You want to upskill your team on data tools, AI platforms, or both. We build the curriculum around your organisation.",
    color: "bg-coral-50 border-coral-200",
    iconColor: "text-coral-600",
    iconBg: "bg-coral-100",
  },
];

const ASSURANCES = [
  { icon: Clock, label: "24-hour response", desc: "Every message gets a reply within one business day." },
  { icon: Mail, label: "Direct access", desc: "You are talking to the team, not a chatbot or support queue." },
  { icon: MapPin, label: "Africa-based", desc: "We understand the realities of building here. No generic responses." },
];

export default function ContactPage() {
  return (
    <>
      <MarketingNav />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-[0.10] bg-[radial-gradient(circle,theme(colors.teal.500),transparent_70%)]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono text-white/40">
                <Hexagon className="w-3.5 h-3.5 text-teal-400" strokeWidth={1.75} />
                Get in touch
              </div>
              <h1 className="font-display font-black tracking-tight leading-[1.05] text-white text-4xl sm:text-5xl md:text-[3rem] max-w-2xl mb-5">
                Let&apos;s talk about{" "}
                <span className="text-gradient-teal">what you are building.</span>
              </h1>
              <p className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
                Whether you want to join the Academy, bring data and AI expertise into your
                business, or train your team, we want to hear from you. Tell us what you are
                working toward and we will point you in the right direction.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WHAT BRINGS YOU HERE ─────────────────────────────────────────── */}
        <section className="py-12 bg-neutral-50 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PATHS.map((p, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className={`rounded-2xl border p-5 ${p.color}`}>
                    <div className={`w-9 h-9 rounded-xl ${p.iconBg} flex items-center justify-center mb-3`}>
                      <p.icon className={`w-4 h-4 ${p.iconColor}`} />
                    </div>
                    <h3 className="font-display font-bold text-navy-800 text-sm mb-1.5">{p.title}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM + DETAILS ───────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">

              {/* Form */}
              <Reveal>
                <div className="bg-white border border-neutral-200 rounded-3xl shadow-surface p-7 sm:p-9">
                  <h2 className="font-display font-black text-xl sm:text-2xl text-navy-800 tracking-tight mb-1">
                    Send us a message.
                  </h2>
                  <p className="text-neutral-500 text-sm mb-7">
                    Fill in the form below and we will respond within 24 hours.
                  </p>
                  <ContactForm />
                </div>
              </Reveal>

              {/* Sidebar */}
              <div className="space-y-6">
                <Reveal delay={0.1}>
                  <div className="bg-navy-900 rounded-3xl p-7 text-white">
                    <div className="text-[11px] font-mono text-white/30 tracking-widest uppercase mb-5">
                      Contact details
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div>
                          <div className="text-[11px] text-white/30 mb-0.5">Email</div>
                          <a
                            href="mailto:hello@wikrena.com"
                            className="text-sm text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                          >
                            hello@wikrena.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div>
                          <div className="text-[11px] text-white/30 mb-0.5">Address</div>
                          <p className="text-sm text-white/70 leading-relaxed">
                            12 Achi Street<br />
                            Independence Layout<br />
                            Enugu, Nigeria
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div>
                          <div className="text-[11px] text-white/30 mb-0.5">Response time</div>
                          <p className="text-sm text-white/70">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <div className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase mb-4">
                      Consulting clients
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                      For data strategy, analysis, or AI implementation enquiries, the first step
                      is always a free 30-minute discovery call. No pitch. Just an honest
                      conversation about your situation.
                    </p>
                    <Link
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:text-teal-500 transition-colors"
                    >
                      Use the form above to get started
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="space-y-3">
                    {ASSURANCES.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-neutral-200">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                          <a.icon className="w-3.5 h-3.5 text-teal-600" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-navy-800 mb-0.5">{a.label}</div>
                          <div className="text-xs text-neutral-500 leading-relaxed">{a.desc}</div>
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
