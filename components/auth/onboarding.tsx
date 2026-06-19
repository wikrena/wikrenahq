"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { cn } from "@/lib/utils";

const STEPS = ["goal", "level", "industry", "path"] as const;
type Step = (typeof STEPS)[number];

const GOALS = [
  {
    id: "job",
    emoji: "💼",
    title: "Get a data job",
    desc: "Land a role as a data analyst, engineer or scientist",
  },
  {
    id: "upskill",
    emoji: "📈",
    title: "Upskill in my current role",
    desc: "I work with data and want to get significantly better",
  },
  {
    id: "switch",
    emoji: "🔄",
    title: "Switch careers into data",
    desc: "Coming from a different field and want to transition",
  },
  {
    id: "business",
    emoji: "🏢",
    title: "Use data in my business",
    desc: "I run a company and want data to drive decisions",
  },
];

const LEVELS = [
  {
    id: "beginner",
    emoji: "🌱",
    title: "Complete beginner",
    desc: "Never written code or SQL before",
  },
  {
    id: "some",
    emoji: "🧭",
    title: "Some experience",
    desc: "Done a few tutorials or written basic queries",
  },
  {
    id: "intermediate",
    emoji: "📊",
    title: "Intermediate",
    desc: "Work with data regularly but want to level up",
  },
];

const INDUSTRIES = [
  { id: "fintech", emoji: "💳", title: "Fintech & Banking" },
  { id: "healthcare", emoji: "🏥", title: "Healthcare" },
  { id: "retail", emoji: "🛍️", title: "Retail & E-commerce" },
  { id: "telecom", emoji: "📡", title: "Telecoms" },
  { id: "agri", emoji: "🌾", title: "Agriculture" },
  { id: "gov", emoji: "🏛️", title: "Government / Public Sector" },
  { id: "other", emoji: "🔭", title: "Other" },
];

const PATHS = [
  {
    id: "data-analytics-professional",
    emoji: "📊",
    title: "Data Analytics",
    desc: "SQL · Excel · Power BI · Statistics",
    weeks: 12,
    level: "Beginner",
    goals: ["job", "upskill", "business"],
  },
  {
    id: "data-engineering",
    emoji: "⚙️",
    title: "Data Engineering",
    desc: "SQL · Python · dbt · Airflow",
    weeks: 10,
    level: "Intermediate",
    goals: ["job", "switch"],
  },
  {
    id: "data-science",
    emoji: "🔬",
    title: "Data Science",
    desc: "Python · Statistics · Scikit-learn",
    weeks: 12,
    level: "Intermediate",
    goals: ["job", "switch"],
  },
  {
    id: "machine-learning",
    emoji: "🤖",
    title: "Machine Learning",
    desc: "Python · TensorFlow · MLOps",
    weeks: 14,
    level: "Advanced",
    goals: ["job"],
  },
  {
    id: "ai-automation",
    emoji: "⚡",
    title: "AI Automation",
    desc: "Zapier · AI Agents · Prompt Eng",
    weeks: 6,
    level: "All Levels",
    goals: ["upskill", "business"],
  },
];

interface Props {
  userId: string;
  userName?: string | null;
}

export function OnboardingFlow({ userId, userName }: Props) {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [industry, setIndustry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const firstName = userName?.split(" ")[0] ?? null;
  const stepIndex = STEPS.indexOf(step);

  const recommended = PATHS.filter(
    (p) =>
      p.goals.includes(goal) ||
      (level === "beginner" && p.level === "Beginner") ||
      (level === "some" && ["Beginner", "Intermediate"].includes(p.level)),
  );

  async function finishOnboarding(pathSlug: string) {
    if (saving) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, pathSlug }),
      });

      // Always check ok BEFORE parsing — a 500 can return HTML, not JSON
      if (!res.ok) {
        let message = "Something went wrong. Please try again.";
        try {
          const errData = await res.json();
          message = errData.error ?? message;
        } catch {
          // Response was not JSON (e.g. HTML error page) — use default message
        }
        setError(message);
        setSaving(false);
        return;
      }

      // Response is ok — safe to parse
      await res.json();

      // Hard navigation — full browser reload guarantees the server
      // reads fresh data from DB and sees onboarding_done = true
      window.location.replace("/dashboard");
    } catch (e: any) {
      setError("Network error. Please check your connection and try again.");
      setSaving(false);
    }
  }

  const Card = ({ id, emoji, title, desc, selected, onClick }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all",
        selected
          ? "border-teal-500 bg-teal-50"
          : "border-[#E5E9F0] bg-white hover:border-teal-300 hover:bg-teal-50/30",
      )}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="flex-1">
        <div className="font-semibold text-sm text-navy-800">{title}</div>
        {desc && <div className="text-xs text-neutral-500 mt-0.5">{desc}</div>}
      </div>
      {selected && <Check className="w-4 h-4 text-teal-500 shrink-0" />}
    </button>
  );

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <WikrenaLogo variant="dark-bg" href="/" height={32} />
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "rounded-full transition-all duration-300",
              i < stepIndex
                ? "w-6 h-2 bg-teal-500"
                : i === stepIndex
                  ? "w-8 h-2 bg-teal-500"
                  : "w-2 h-2 bg-neutral-200",
            )}
          />
        ))}
      </div>

      {/* ── Step 1: Goal ── */}
      {step === "goal" && (
        <div className="animate-fade-up">
          <h2 className="font-display font-black text-2xl text-navy-800 text-center mb-1">
            {firstName ? `Welcome, ${firstName}! 👋` : "Welcome! 👋"}
          </h2>
          <p className="text-neutral-500 text-sm text-center mb-7">
            What brings you to Wikrena?
          </p>
          <div className="space-y-2.5 mb-6">
            {GOALS.map((g) => (
              <Card
                key={g.id}
                {...g}
                selected={goal === g.id}
                onClick={() => setGoal(g.id)}
              />
            ))}
          </div>
          <button
            onClick={() => goal && setStep("level")}
            disabled={!goal}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 2: Level ── */}
      {step === "level" && (
        <div className="animate-fade-up">
          <button
            onClick={() => setStep("goal")}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-navy-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display font-black text-2xl text-navy-800 text-center mb-1">
            Your experience level
          </h2>
          <p className="text-neutral-500 text-sm text-center mb-7">
            Helps us recommend the right starting point.
          </p>
          <div className="space-y-2.5 mb-6">
            {LEVELS.map((l) => (
              <Card
                key={l.id}
                {...l}
                selected={level === l.id}
                onClick={() => setLevel(l.id)}
              />
            ))}
          </div>
          <button
            onClick={() => level && setStep("industry")}
            disabled={!level}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 3: Industry ── */}
      {step === "industry" && (
        <div className="animate-fade-up">
          <button
            onClick={() => setStep("level")}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-navy-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display font-black text-2xl text-navy-800 text-center mb-1">
            Your industry
          </h2>
          <p className="text-neutral-500 text-sm text-center mb-7">
            We&apos;ll personalise examples to your world.
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setIndustry(ind.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all",
                  industry === ind.id
                    ? "border-teal-500 bg-teal-50"
                    : "border-[#E5E9F0] bg-white hover:border-teal-300",
                )}
              >
                <span className="text-xl shrink-0">{ind.emoji}</span>
                <span className="font-medium text-xs text-navy-800">
                  {ind.title}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => industry && setStep("path")}
            disabled={!industry}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 4: Path ── */}
      {step === "path" && (
        <div className="animate-fade-up">
          <button
            onClick={() => setStep("industry")}
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-navy-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display font-black text-2xl text-navy-800 text-center mb-1">
            Choose your first track
          </h2>
          <p className="text-neutral-500 text-sm text-center mb-6">
            You can always change this later.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2.5">
            {PATHS.map((p, i) => {
              const isRec = recommended.some((r) => r.id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => finishOnboarding(p.id)}
                  disabled={saving}
                  className={cn(
                    "w-full flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all relative",
                    isRec && i === 0
                      ? "border-teal-300 bg-teal-50/50"
                      : "border-[#E5E9F0] bg-white hover:border-teal-200",
                    saving && "opacity-60 cursor-not-allowed",
                  )}
                >
                  {isRec && i === 0 && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <span className="text-2xl shrink-0">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-navy-800">
                      {p.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {p.desc}
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[10px] font-code bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                        {p.weeks}w
                      </span>
                      <span className="text-[10px] font-code bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                        {p.level}
                      </span>
                    </div>
                  </div>
                  {saving ? (
                    <Loader2 className="w-4 h-4 text-teal-500 animate-spin shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {saving && (
            <p className="text-xs text-neutral-400 text-center mt-4">
              Saving your choices and setting up your dashboard...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
