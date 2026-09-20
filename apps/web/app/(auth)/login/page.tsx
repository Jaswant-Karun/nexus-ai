"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("from") ?? "/dashboard";

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "1") setRegistered(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("EMAIL AND PASSWORD REQUIRED"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!res.ok || !data.success) { setError(data.error?.toUpperCase() ?? "LOGIN FAILED"); return; }
      router.replace(redirectTo);
    } catch {
      setError("NETWORK ERROR — CHECK CONNECTION");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen cyber-bg flex flex-col items-center justify-center overflow-hidden">
      {/* Scan lines */}
      <div className="scan-overlay" />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(233,30,140,0.08) 0%, transparent 70%)" }} />

      {/* Yellow corners */}
      {[
        "fixed top-4 left-4",
        "fixed top-4 right-4",
        "fixed bottom-4 left-4",
        "fixed bottom-4 right-4",
      ].map((pos, i) => (
        <div key={i} className={`pointer-events-none ${pos} z-20`}>
          <svg width="50" height="25" viewBox="0 0 50 25">
            {i === 0 && <polyline points="50,0 0,0 0,25" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i === 1 && <polyline points="0,0 50,0 50,25" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i === 2 && <polyline points="50,25 0,25 0,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i === 3 && <polyline points="0,25 50,25 50,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
          </svg>
        </div>
      ))}

      {/* Logo */}
      <div className="relative z-10 mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <svg width="36" height="36" viewBox="0 0 32 32">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#e91e8c" strokeWidth="1.5"/>
            <polygon points="16,6 26,11 26,21 16,26 6,21 6,11" fill="none" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
            <line x1="16" y1="2" x2="16" y2="30" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
            <line x1="2" y1="10" x2="30" y2="22" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
            <line x1="30" y1="10" x2="2" y2="22" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
          </svg>
          <span className="font-cyber font-black text-2xl tracking-[0.2em] uppercase text-white"
            style={{ textShadow: "0 0 20px rgba(233,30,140,0.4)" }}>
            NEX<span className="text-neon-pink" style={{ textShadow: "0 0 12px rgba(233,30,140,0.9)" }}>∞</span>S AI
          </span>
        </Link>
        <p className="font-cyber text-[10px] tracking-[0.4em] uppercase text-cyber-text-dim mt-2">
          Universal Adaptive Intelligence Platform
        </p>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm cyber-card cyber-corners p-8">
        {/* Title */}
        <h1 className="font-cyber text-sm font-bold tracking-[0.25em] uppercase text-white mb-1">
          SIGN IN
        </h1>
        <div className="neon-line mb-6" />

        {/* Success banner */}
        {registered && (
          <div className="mb-5 flex items-center gap-2 px-3 py-2 font-cyber text-[10px] tracking-widest uppercase"
            style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.35)", color: "#39ff14" }}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
            Account created — sign in below
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="cyber-label">Email Address</label>
            <input
              id="email" type="email" required autoComplete="email" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nexus.ai"
              disabled={loading}
              className="cyber-input"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="cyber-label" style={{ marginBottom: 0 }}>Password</label>
              <Link href="/forgot-password"
                className="font-cyber text-[9px] tracking-widest uppercase text-neon-pink/70 hover:text-neon-pink transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password" type={showPw ? "text" : "password"} required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="cyber-input pr-10"
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-cyber text-[9px] tracking-widest text-neon-pink/50 hover:text-neon-pink transition-colors"
                aria-label={showPw ? "Hide" : "Show"}>
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2 font-cyber text-[10px] tracking-widest uppercase"
              style={{ background: "rgba(233,30,140,0.08)", border: "1px solid rgba(233,30,140,0.4)", color: "#e91e8c" }}>
              <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="cyber-btn-filled w-full py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                AUTHENTICATING…
              </span>
            ) : "SIGN IN"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 neon-line opacity-30" />

        <p className="text-center font-cyber text-[9px] tracking-widest uppercase text-cyber-text-dim">
          No account?{" "}
          <Link href="/register" className="text-neon-pink hover:underline transition-colors"
            style={{ textShadow: "0 0 6px rgba(233,30,140,0.5)" }}>
            Register
          </Link>
        </p>
      </div>

      {/* Back link */}
      <Link href="/"
        className="relative z-10 mt-6 flex items-center gap-1.5 font-cyber text-[9px] tracking-widest uppercase text-cyber-text-dim hover:text-neon-pink transition-colors group">
        <svg className="transition-transform group-hover:-translate-x-0.5" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to home
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
