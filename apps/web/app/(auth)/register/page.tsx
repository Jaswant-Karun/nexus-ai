"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZapIcon } from "@/components/ui/Icons";

/* ── Password strength meter ─────────────────────────────────── */
const CHECKS = [
  { label: "8+ characters",    test: (p: string) => p.length >= 8 },
  { label: "Uppercase",        test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase",        test: (p: string) => /[a-z]/.test(p) },
  { label: "Number",           test: (p: string) => /\d/.test(p) },
  { label: "Special char",     test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_COLORS = [
  "bg-dark-700",
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

const STRENGTH_LABELS = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = CHECKS.filter((c) => c.test(password)).length;
  return (
    <div className="mt-2 space-y-1.5">
      {/* Bar */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? STRENGTH_COLORS[score] : "bg-dark-700"
            }`}
          />
        ))}
      </div>
      {/* Label + checks */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold ${
          score <= 1 ? "text-red-400" :
          score === 2 ? "text-orange-400" :
          score === 3 ? "text-amber-400" :
          score >= 4  ? "text-emerald-400" : "text-dark-500"
        }`}>
          {STRENGTH_LABELS[score]}
        </span>
        <span className="text-[11px] text-dark-500">{score}/5</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {CHECKS.map((c) => {
          const pass = c.test(password);
          return (
            <p key={c.label} className={`text-[10px] flex items-center gap-1 transition-colors ${pass ? "text-emerald-400" : "text-dark-500"}`}>
              <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                {pass ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
              </svg>
              {c.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
interface FormState {
  name:     string;
  email:    string;
  orgName:  string;
  password: string;
  confirm:  string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form,    setForm]    = useState<FormState>({ name: "", email: "", orgName: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [agreed,  setAgreed]  = useState(false);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, email, orgName, password, confirm } = form;

    if (!name.trim() || !email.trim() || !password) {
      setError("Full name, email, and password are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    name.trim(),
          email:   email.trim(),
          password,
          orgName: orgName.trim() || undefined,
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      // Cookie is already set by the API — go straight to dashboard
      router.replace("/dashboard");
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch = form.confirm.length > 0 && form.confirm !== form.password;

  return (
    <div className="min-h-screen bg-dark-950 flex">

      {/* ── Left branding panel ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(98,114,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(98,114,245,0.05) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }} />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-brand-600/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-48 w-48 rounded-full bg-cyan-600/8 blur-3xl" />

        <div className="relative z-10 max-w-sm w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-600/50">
              <ZapIcon size={20} className="text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-white">NEXUS</span>
              <span className="text-brand-400"> AI</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
            Start building your<br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-powered enterprise
            </span>
          </h2>
          <p className="text-dark-300 text-sm leading-relaxed mb-8">
            Join 500+ teams deploying autonomous agents, automating workflows,
            and unlocking their knowledge base with NEXUS AI.
          </p>

          {/* What you get */}
          <div className="space-y-3 mb-8">
            {[
              { icon: "🤖", title: "Autonomous AI Agents",     sub: "GPT-4o, Claude, Gemini & local LLMs" },
              { icon: "⚡", title: "Visual Workflow Builder",  sub: "Drag-and-drop multi-agent pipelines" },
              { icon: "🧠", title: "Adaptive Memory Engine",   sub: "Hybrid vector search & embeddings" },
              { icon: "☁️", title: "Intelligent File Storage", sub: "AI-powered OCR, summaries & search" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/[0.08] text-lg">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-[11px] text-dark-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
            <div className="flex -space-x-2">
              {["JK", "AM", "SR", "TC", "LP"].map((initials) => (
                <div key={initials}
                  className="h-7 w-7 rounded-full border-2 border-dark-950 bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-xs text-dark-400">
              <span className="font-semibold text-white">500+</span> teams · Rated 4.9★ on G2
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: register form ──────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 overflow-y-auto relative">
        {/* Back / Sign in links */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
          <Link href="/"
            className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors group">
            <svg className="transition-transform group-hover:-translate-x-0.5" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to home
          </Link>
          <p className="text-xs text-dark-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Mobile logo */}
        <div className="mb-7 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <ZapIcon size={17} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">NEXUS</span>
            <span className="text-brand-400"> AI</span>
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-white mb-1">Create your account</h1>
            <p className="text-sm text-dark-400">Free 14-day trial · No credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold text-dark-200 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name" type="text" required autoComplete="name" autoFocus
                value={form.name} onChange={set("name")}
                placeholder="Jaswant Karun"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-50"
              />
            </div>

            {/* Work email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-dark-200 uppercase tracking-wider">
                Work Email
              </label>
              <input
                id="email" type="email" required autoComplete="email"
                value={form.email} onChange={set("email")}
                placeholder="you@company.com"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-50"
              />
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label htmlFor="orgName" className="block text-xs font-semibold text-dark-200 uppercase tracking-wider">
                Organization{" "}
                <span className="normal-case font-normal text-dark-500">(optional)</span>
              </label>
              <input
                id="orgName" type="text" autoComplete="organization"
                value={form.orgName} onChange={set("orgName")}
                placeholder="Nexus Enterprise"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-dark-200 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" type={showPw ? "text" : "password"} required autoComplete="new-password"
                  value={form.password} onChange={set("password")}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-3 pr-12 text-sm text-white placeholder:text-dark-500 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-50"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors p-1"
                  aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw
                    ? <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-xs font-semibold text-dark-200 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirm" type={showPw ? "text" : "password"} required autoComplete="new-password"
                value={form.confirm} onChange={set("confirm")}
                placeholder="Repeat your password"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-dark-500 bg-dark-800/80 focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
                  passwordMismatch
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15"
                    : "border-white/10 focus:border-brand-500/70 focus:ring-brand-500/20"
                }`}
              />
              {passwordMismatch && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Passwords do not match
                </p>
              )}
              {form.confirm.length > 0 && !passwordMismatch && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <div className="relative mt-0.5 shrink-0">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only" />
                <div className={`h-4 w-4 rounded border transition-colors ${agreed ? "bg-brand-600 border-brand-600" : "bg-dark-800 border-white/20"} flex items-center justify-center`}>
                  {agreed && (
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-dark-400 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors" onClick={(e) => e.stopPropagation()}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
              </span>
            </label>

            {/* Error banner */}
            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-xs text-red-400">
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading || passwordMismatch}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating your account…
                </span>
              ) : (
                "Create Free Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-dark-950 px-3 text-[11px] text-dark-500">or sign up with</span>
            </div>
          </div>

          {/* Social providers */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "Google",
                icon: <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>,
              },
              {
                name: "GitHub",
                icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>,
              },
            ].map((p) => (
              <button key={p.name} type="button" disabled
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-dark-300 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {p.icon}
                {p.name}
                <span className="text-[9px] text-dark-600">(soon)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Legal footer */}
        <p className="mt-8 text-[10px] text-dark-600 text-center px-6 max-w-xs">
          By creating an account you agree to our{" "}
          <a href="#" className="hover:text-dark-400 transition-colors underline">Terms</a>
          {" and "}
          <a href="#" className="hover:text-dark-400 transition-colors underline">Privacy Policy</a>.
          We&apos;ll never share your data.
        </p>
      </div>
    </div>
  );
}
