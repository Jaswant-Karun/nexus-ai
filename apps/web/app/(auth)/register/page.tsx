"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZapIcon } from "@/components/ui/Icons";

interface FormState {
  name: string;
  email: string;
  orgName: string;
  password: string;
  confirm: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",      pass: password.length >= 8 },
    { label: "Uppercase letter",    pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter",    pass: /[a-z]/.test(password) },
    { label: "Number",              pass: /\d/.test(password) },
    { label: "Special character",   pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? colors[score] : "bg-dark-700"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map((c) => (
          <p key={c.label} className={`text-[10px] flex items-center gap-1 ${c.pass ? "text-emerald-400" : "text-dark-400"}`}>
            <span>{c.pass ? "✓" : "○"}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "", email: "", orgName: "", password: "", confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, email, orgName, password, confirm } = form;

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          orgName: orgName.trim() || undefined,
        }),
      });

      const data = await res.json() as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      // Redirect to dashboard (cookie already set by API)
      router.replace("/dashboard");
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "name",     label: "Full Name",           type: "text",     placeholder: "Jaswant Karun",     autoComplete: "name" },
    { id: "email",    label: "Work Email",           type: "email",    placeholder: "you@company.com",   autoComplete: "email" },
    { id: "orgName",  label: "Organization (optional)", type: "text", placeholder: "Nexus Enterprise",  autoComplete: "organization" },
  ] as const;

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
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
            <p className="text-sm text-dark-300 mt-0.5">Create your enterprise account</p>
          </div>
        </div>

        <div className="glass-dark rounded-2xl border border-white/[0.06] p-8 animate-fade-in-up animation-delay-100">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label htmlFor={f.id} className="block text-xs font-medium text-dark-200">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  placeholder={f.placeholder}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition disabled:opacity-50"
                />
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-dark-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-dark-800/80 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors text-xs"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-xs font-medium text-dark-200">
                Confirm Password
              </label>
              <input
                id="confirm"
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Repeat your password"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder:text-dark-400 bg-dark-800/80 focus:outline-none focus:ring-1 transition disabled:opacity-50 ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                    : "border-white/10 focus:border-brand-500/60 focus:ring-brand-500/30"
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-dark-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
