import Link from "next/link";
import { ZapIcon } from "@/components/ui/Icons";

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-dark-400 mb-8">Sign in to your Nexus AI account</p>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-dark-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center mt-2">
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Get started free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-dark-500">
          <Link href="/privacy" className="hover:text-dark-300 transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-dark-300 transition-colors">Terms</Link>
        </p>
      </div>
    </div>
  );
}
