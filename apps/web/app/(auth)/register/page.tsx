"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormState {
  name:     string;
  email:    string;
  orgName:  string;
  password: string;
  confirm:  string;
}

const CHECKS = [
  { label: "8+ chars",   test: (p: string) => p.length >= 8 },
  { label: "Uppercase",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",     test: (p: string) => /\d/.test(p) },
  { label: "Special",    test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState<FormState>({ name: "", email: "", orgName: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);

  const set = (f: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const score = CHECKS.filter((c) => c.test(form.password)).length;
  const strengthColors = ["#e91e8c", "#e91e8c", "#f5e642", "#39ff14", "#39ff14"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) { setError("ALL FIELDS REQUIRED"); return; }
    if (form.password !== form.confirm) { setError("PASSWORDS DO NOT MATCH"); return; }
    if (form.password.length < 8) { setError("PASSWORD MIN 8 CHARACTERS"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password, orgName: form.orgName.trim() || undefined }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!res.ok || !data.success) { setError(data.error?.toUpperCase() ?? "REGISTRATION FAILED"); return; }
      router.replace("/dashboard");
    } catch {
      setError("NETWORK ERROR — CHECK CONNECTION");
    } finally {
      setLoading(false);
    }
  };

  const mismatch = form.confirm.length > 0 && form.confirm !== form.password;

  return (
    <div className="relative min-h-screen cyber-bg flex flex-col items-center justify-center overflow-hidden py-10">
      <div className="scan-overlay" />
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(233,30,140,0.07) 0%, transparent 70%)" }} />

      {/* Yellow corners */}
      {[0,1,2,3].map((i) => (
        <div key={i} className={`pointer-events-none fixed z-20 ${["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"][i]}`}>
          <svg width="50" height="25" viewBox="0 0 50 25">
            {i===0 && <polyline points="50,0 0,0 0,25" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i===1 && <polyline points="0,0 50,0 50,25" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i===2 && <polyline points="50,25 0,25 0,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
            {i===3 && <polyline points="0,25 50,25 50,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.7"/>}
          </svg>
        </div>
      ))}

      {/* Logo */}
      <div className="relative z-10 mb-7 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 32 32">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#e91e8c" strokeWidth="1.5"/>
          </svg>
          <span className="font-cyber font-black text-xl tracking-[0.2em] uppercase text-white"
            style={{ textShadow: "0 0 15px rgba(233,30,140,0.4)" }}>
            NEX<span className="text-neon-pink">∞</span>S AI
          </span>
        </Link>
        <p className="font-cyber text-[9px] tracking-[0.4em] uppercase text-cyber-text-dim mt-1.5">
          Create Your Account
        </p>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm cyber-card cyber-corners p-8">
        <h1 className="font-cyber text-sm font-bold tracking-[0.25em] uppercase text-white mb-1">REGISTER</h1>
        <div className="neon-line mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label className="cyber-label">Full Name</label>
            <input type="text" required autoComplete="name" autoFocus
              value={form.name} onChange={set("name")}
              placeholder="Jaswant Karun"
              disabled={loading} className="cyber-input" />
          </div>

          {/* Email */}
          <div>
            <label className="cyber-label">Work Email</label>
            <input type="email" required autoComplete="email"
              value={form.email} onChange={set("email")}
              placeholder="you@company.com"
              disabled={loading} className="cyber-input" />
          </div>

          {/* Org */}
          <div>
            <label className="cyber-label">Organization <span className="normal-case font-normal">(optional)</span></label>
            <input type="text"
              value={form.orgName} onChange={set("orgName")}
              placeholder="Nexus Enterprise"
              disabled={loading} className="cyber-input" />
          </div>

          {/* Password */}
          <div>
            <label className="cyber-label">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required autoComplete="new-password"
                value={form.password} onChange={set("password")}
                placeholder="Min. 8 characters"
                disabled={loading} className="cyber-input pr-10" />
              <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-cyber text-[9px] tracking-widest text-neon-pink/50 hover:text-neon-pink transition-colors">
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>
            {/* Strength bar */}
            {form.password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i < score ? strengthColors[score] : "#2a2a2a" }} />
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {CHECKS.map((c) => (
                    <span key={c.label}
                      className="font-cyber text-[8px] tracking-widest uppercase flex items-center gap-1 transition-colors"
                      style={{ color: c.test(form.password) ? "#39ff14" : "#444" }}>
                      <svg width={7} height={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        {c.test(form.password)
                          ? <polyline points="20 6 9 17 4 12"/>
                          : <circle cx="12" cy="12" r="10"/>}
                      </svg>
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="cyber-label">Confirm Password</label>
            <input type={showPw ? "text" : "password"} required autoComplete="new-password"
              value={form.confirm} onChange={set("confirm")}
              placeholder="Repeat password"
              disabled={loading}
              className="cyber-input"
              style={mismatch ? { borderColor: "#e91e8c", boxShadow: "0 0 8px rgba(233,30,140,0.3)" } : {}} />
            {mismatch && (
              <p className="font-cyber text-[9px] tracking-widest uppercase mt-1" style={{ color: "#e91e8c" }}>
                ✕ Passwords do not match
              </p>
            )}
            {form.confirm.length > 0 && !mismatch && (
              <p className="font-cyber text-[9px] tracking-widest uppercase mt-1" style={{ color: "#39ff14" }}>
                ✓ Passwords match
              </p>
            )}
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
          <button type="submit" disabled={loading || mismatch}
            className="cyber-btn-filled w-full py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                CREATING ACCOUNT…
              </span>
            ) : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="my-5 neon-line opacity-30" />
        <p className="text-center font-cyber text-[9px] tracking-widest uppercase text-cyber-text-dim">
          Have an account?{" "}
          <Link href="/login" className="text-neon-pink hover:underline transition-colors"
            style={{ textShadow: "0 0 6px rgba(233,30,140,0.5)" }}>
            Sign In
          </Link>
        </p>
      </div>

      <Link href="/"
        className="relative z-10 mt-6 flex items-center gap-1.5 font-cyber text-[9px] tracking-widest uppercase text-cyber-text-dim hover:text-neon-pink transition-colors group">
        <svg className="group-hover:-translate-x-0.5 transition-transform" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to home
      </Link>
    </div>
  );
}
