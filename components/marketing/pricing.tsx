"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATIC_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "NGN",
    interval: null,
    features: [
      "Access to free lessons",
      "Africa Data Lab (browse only)",
      "Community forums",
      "5 Wren AI messages/day",
      "Basic leaderboard",
    ],
    cta: "Start Free",
    highlight: false,
    badge: null,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 15000,
    currency: "NGN",
    interval: "monthly",
    features: [
      "All Career & Skill Tracks",
      "Full Africa Data Lab access",
      "Unlimited Wren AI",
      "Monaco code editor",
      "Certificates on completion",
      "Job board + resume review",
      "Priority support",
    ],
    cta: "Start Learning",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "annual",
    name: "Annual",
    price: 120000,
    currency: "NGN",
    interval: "yearly",
    features: [
      "Everything in Monthly",
      "2 months free (save ₦30,000)",
      "Cohort access (one per year)",
      "3 mentor sessions",
      "Placement support for 90 days",
      "Early access to new courses",
    ],
    cta: "Best Value",
    highlight: false,
    badge: "Save 17%",
  },
];

interface Props {
  plans: any[];
  userId?: string;
}

export function PricingPage({ plans, userId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const displayPlans = plans.length > 0 ? plans : STATIC_PLANS;

  async function checkout(plan: any) {
    if (plan.price === 0) {
      router.push(userId ? "/dashboard" : "/register");
      return;
    }
    if (!userId) {
      router.push("/register");
      return;
    }

    setLoading(plan.id);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.error ?? "Payment failed to initialise");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F8FA] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="eyebrow justify-center">Pricing</div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Built for African purchasing power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative bg-white rounded-2xl p-6 border-2 flex flex-col transition-all",
                plan.highlight
                  ? "border-teal-500 shadow-teal ring-4 ring-teal-500/10"
                  : "border-[#E5E9F0] hover:border-teal-200 hover:shadow-lift",
              )}
            >
              {plan.badge && (
                <div
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full font-code",
                    plan.highlight
                      ? "bg-teal-500 text-white"
                      : "bg-navy-800 text-white",
                  )}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-5">
                <div className="font-display font-bold text-lg text-navy-800 mb-2">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-black text-4xl text-navy-800">
                    {plan.price === 0
                      ? "Free"
                      : `₦${plan.price.toLocaleString()}`}
                  </span>
                  {plan.interval && (
                    <span className="text-neutral-400 text-sm">
                      /{plan.interval === "monthly" ? "mo" : "yr"}
                    </span>
                  )}
                </div>
                {plan.interval === "monthly" && (
                  <div className="text-xs text-neutral-400 mt-0.5">
                    ≈ ₦500/day
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((f: string) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-teal-600" />
                    </div>
                    <span className="text-sm text-neutral-600">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => checkout(plan)}
                disabled={loading === plan.id}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
                  plan.highlight
                    ? "bg-teal-500 hover:bg-teal-400 text-white shadow-teal"
                    : "bg-navy-800 hover:bg-navy-700 text-white",
                )}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                  </>
                ) : (
                  <>
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🔒",
              title: "Secure Payment",
              desc: "Powered by Paystack. Your card details are never stored.",
            },
            {
              icon: "↩️",
              title: "No Risk",
              desc: "Not satisfied in your first 7 days? We'll refund you, no questions.",
            },
            {
              icon: "🌍",
              title: "Made for Africa",
              desc: "NGN pricing. Verve, Mastercard, Visa, bank transfer, USSD.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E5E9F0] rounded-xl p-4 flex items-start gap-3"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm text-navy-800 mb-0.5">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
