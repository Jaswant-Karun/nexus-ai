import Link from "next/link";
import { ZapIcon } from "@/components/ui/Icons";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 py-12">
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
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-dark-400 mb-8">Start building with Nexus AI for free</p>

          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Last name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-colors"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center mt-2">
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-dark-500">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-dark-400 hover:text-white transition-colors">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-dark-400 hover:text-white transition-colors">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-dark-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
