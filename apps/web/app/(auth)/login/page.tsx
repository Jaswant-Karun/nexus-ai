"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ZapIcon } from "@/components/ui/Icons";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("from") ?? "/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPw,   setShowPw]   = useState(false);

  // Show success message if redirected after registration
  const [registered, setRegistered] = useState(false);
  useEffect(() => {
    if (searchParams.get("registered") === "1") setRegistered(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json() as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      // Redirect to the page they were trying to visit, or dashboard
      router.replace(redirectTo);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/40">
            <ZapIcon size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">NEXUS</span>
              <span className="text-brand-400"> AI</span>
            </p>
            <p className="text-sm text-dark-300 mt-0.5">Sign in to your platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl border border-white/[0.06] p-8 animate-fade-in-up animation-delay-100">
          {registered && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              <span>✓</span>
              <span>Account created successfully! Sign in below.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-dark-200">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexus.ai"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-dark-200">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors text-xs"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400"
              >
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs text-dark-500 bg-transparent">
              <span className="bg-dark-900 px-3">or continue with</span>
            </div>
          </div>

          {/* Social auth placeholders */}
          <div className="grid grid-cols-2 gap-3">
            {["Google", "GitHub"].map((provider) => (
              <button
                key={provider}
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-dark-300 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {provider}
                <span className="text-[9px] text-dark-500">(soon)</span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-dark-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-[10px] text-dark-500">
          By signing in you agree to our{" "}
          <a href="#" className="underline hover:text-dark-300 transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-dark-300 transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
