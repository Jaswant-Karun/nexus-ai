"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ZapIcon } from "@/components/ui/Icons";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/40">
            <ZapIcon size={22} className="text-white" />
          </div>
          <p className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">NEXUS</span>
            <span className="text-brand-400"> AI</span>
          </p>
        </div>

        <div className="glass-dark rounded-2xl border border-white/[0.06] p-8">
          {saved ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Password updated</h1>
              <p className="mt-2 text-sm text-dark-300">Your password is ready. Sign in to continue.</p>
              <Link href="/login" className="mt-6 inline-flex text-sm font-medium text-brand-400 hover:text-brand-300">
                Go to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-white">Create a new password</h1>
                <p className="mt-1.5 text-sm text-dark-300">Choose a secure password for your Nexus AI account.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <label className="block space-y-1.5 text-xs font-medium text-dark-200">
                  New password
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                  />
                </label>
                <label className="block space-y-1.5 text-xs font-medium text-dark-200">
                  Confirm password
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                  />
                </label>
                {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error}</p>}
                <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500">
                  Update password
                </button>
              </form>
              <Link href="/login" className="mt-5 flex items-center justify-center gap-1.5 text-xs text-dark-400 hover:text-white">
                <ArrowLeftIcon size={12} /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
