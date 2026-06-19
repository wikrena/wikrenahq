"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(
        error.message.includes("Invalid")
          ? "Incorrect email or password."
          : error.message.includes("Email not confirmed")
            ? "Please verify your email first. Check your inbox."
            : error.message,
      );
      return;
    }
    // Use full navigation so middleware can run fresh
    window.location.href = redirectTo;
  }

  async function handleGoogle() {
    setGLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }

  return (
    <div>
      {/* Logo — mobile only (desktop sees left panel logo) */}
      <div className="flex justify-center mb-8 lg:hidden">
        <WikrenaLogo variant="dark-bg" href="/" height={28} />
      </div>

      <h1 className="font-display font-black text-2xl text-navy-800 mb-1.5">
        Welcome back
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Continue your learning journey
      </p>

      {/* Error from URL params */}
      {(searchParams.get("error") || error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {searchParams.get("error") === "OAuthError"
            ? "Google sign-in failed. Please try again."
            : searchParams.get("error") === "verification_failed"
              ? "Email verification failed. Please try again."
              : error}
        </div>
      )}

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={gLoading}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border-2 border-[#E5E9F0] bg-white hover:border-[#C5CBD5] hover:bg-[#F8FAFC] text-sm font-medium text-navy-700 transition-all disabled:opacity-50 mb-5 shadow-surface"
      >
        {gLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5 text-xs text-neutral-400 font-code">
        <div className="flex-1 h-px bg-[#E5E9F0]" />
        or sign in with email
        <div className="flex-1 h-px bg-[#E5E9F0]" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="flex w-full rounded-xl border border-[#E5E9F0] bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-600">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-teal-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              autoComplete="current-password"
              className="flex w-full rounded-xl border border-[#E5E9F0] bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-11 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-teal"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In →"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        No account yet?{" "}
        <Link
          href="/register"
          className="text-teal-600 hover:underline font-semibold"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
