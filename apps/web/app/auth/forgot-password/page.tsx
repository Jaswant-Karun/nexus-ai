import Link from "next/link";
import { ZapIcon, ArrowLeftIcon, MailIcon } from "@/components/ui/Icons";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/40">
            <ZapIcon size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">NEXUS</span>
            <span className="text-brand-400"> AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <MailIcon size={24} className="text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Reset your password</h1>
          <p className="text-sm text-dark-400 mb-8">
            Enter your email and we&apos;ll send a reset link.
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center mt-2">
              Send Reset Link
            </button>
          </form>

          <Link
            href="/auth/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
