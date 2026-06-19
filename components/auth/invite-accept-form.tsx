"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";

export function InviteAcceptForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to accept invitation");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done)
    return (
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-3xl mx-auto mb-5">
          ✅
        </div>
        <h2 className="font-display font-black text-2xl text-navy-800 mb-2">
          Account Created!
        </h2>
        <p className="text-neutral-500 text-sm">Redirecting you to login...</p>
      </div>
    );

  return (
    <div className="max-w-sm w-full">
      <div className="flex justify-center mb-8">
        <WikrenaLogo variant="dark-bg" href="/" height={32} />
      </div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎓</div>
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">
          Accept Your Invitation
        </h1>
        <p className="text-neutral-500 text-sm">
          Set a password to activate your instructor account.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="surface-lg p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            ⚠️ {error}
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
            Confirm Password
          </label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Repeat your password"
            required
            className="w-full border border-[#E5E9F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !password || !password2}
          className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white py-3 rounded-xl font-bold text-sm transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
            </>
          ) : (
            "Activate My Account →"
          )}
        </button>
      </form>
    </div>
  );
}
