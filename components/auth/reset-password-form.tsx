"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);

  // The user arrives here after clicking the reset link in their email.
  // Supabase sets a session automatically from the token in the URL.
  // We wait for that session before showing the form.
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setHasSession(true);
      }
    });

    // Also check for existing session (user may have already been verified)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasSession(true);
    });
  }, []);

  const passwordsMatch = password === confirm;
  const passwordValid = password.length >= 8;

  const strength =
    password.length === 0
      ? null
      : password.length < 8
        ? "weak"
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? "strong"
          : "good";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 3000);
  }

  if (!hasSession) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-50 border-2 border-neutral-200 flex items-center justify-center text-3xl mx-auto mb-5">
          🔗
        </div>
        <h2 className="font-display font-black text-2xl text-navy-800 mb-2">
          Invalid or expired link
        </h2>
        <p className="text-neutral-500 text-sm mb-6">
          This password reset link is invalid or has already been used. Request
          a new one.
        </p>
        <a
          href="/forgot-password"
          className="block w-full py-3 rounded-xl font-bold text-sm text-white bg-teal-500 hover:bg-teal-400 transition-all text-center"
        >
          Request New Reset Link
        </a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-teal-500" />
        </div>
        <h2 className="font-display font-black text-2xl text-navy-800 mb-2">
          Password updated
        </h2>
        <p className="text-neutral-500 text-sm">
          Your password has been changed. Redirecting you to your dashboard...
        </p>
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
          Set new password
        </h1>
        <p className="text-neutral-500 text-sm">
          Choose a strong password for your account.
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
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoFocus
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {strength && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1 flex-1">
                  {["weak", "good", "strong"].map((s) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        background:
                          strength === "strong"
                            ? "#2ec4b6"
                            : strength === "good" && s !== "strong"
                              ? "#f59e0b"
                              : strength === "weak" && s === "weak"
                                ? "#ef4444"
                                : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-[10px] font-semibold capitalize"
                  style={{
                    color:
                      strength === "strong"
                        ? "#0d9488"
                        : strength === "good"
                          ? "#d97706"
                          : "#dc2626",
                  }}
                >
                  {strength}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
            {confirm && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordValid || !passwordsMatch}
            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
