"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${siteUrl}/api/auth/callback?type=recovery&next=/reset-password`,
      },
    );

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-3xl mx-auto mb-5">
          📬
        </div>
        <h2 className="font-display font-black text-2xl text-navy-800 mb-2">
          Check your email
        </h2>
        <p className="text-neutral-500 text-sm mb-2">
          We sent a password reset link to{" "}
          <strong className="text-navy-800">{email}</strong>.
        </p>
        <p className="text-neutral-400 text-xs mb-6">
          Click the link in the email to set a new password. The link expires in
          24 hours.
        </p>
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-left mb-6">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Can&apos;t find the email?
          </div>
          <ul className="space-y-1.5">
            {[
              "Check your spam or junk folder",
              "Make sure you entered the correct email",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-xs text-neutral-500"
              >
                <span className="text-teal-500 font-bold shrink-0 mt-0.5">
                  →
                </span>{" "}
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/login"
          className="block w-full py-3 rounded-xl font-bold text-sm text-white bg-[#0a192f] hover:bg-[#0d2140] transition-all text-center"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <WikrenaLogo variant="dark-bg" href="/" height={28} />
        </div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-2">
          Reset your password
        </h1>
        <p className="text-neutral-500 text-sm">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-neutral-400 mt-5">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-teal-600 font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
