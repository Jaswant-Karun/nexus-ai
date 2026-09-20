"use client";

import { useState } from "react";
import Link from "next/link";
import { ZapIcon, ArrowLeftIcon } from "@/components/ui/Icons";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // When a real password-reset endpoint exists, call it here.
      // For now we simulate a 1 s delay and show the success state.
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/40">
            <ZapIcon size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">NEXUS</span>
              <span className="text-brand-400"> AI</span>
            </p>
          </div>
        </div>

        <div className="glass-dark rounded-2xl border border-white/[0.06] p-8">
          {sent ? (
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl">
                ✉️
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Check your email</h2>
                <p className="mt-2 text-sm text-dark-300">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-white">{email}</span>. It expires in 15 minutes.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-2 flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
              >
                <ArrowLeftIcon size={14} /> Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-white">Forgot your password?</h2>
                <p className="mt-1.5 text-sm text-dark-300">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending…
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors"
                >
                  <ArrowLeftIcon size={12} /> Back to Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
