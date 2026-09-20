import Link from "next/link";
import { ArrowLeftIcon, ZapIcon } from "@/components/ui/Icons";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />
      <div className="relative w-full max-w-md text-center">
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-3xl">✉️</div>
          <h1 className="mt-5 text-xl font-bold text-white">Verify your email</h1>
          <p className="mt-2 text-sm leading-relaxed text-dark-300">
            Check your inbox for the verification link. It may take a minute to arrive.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300">
            <ArrowLeftIcon size={14} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
