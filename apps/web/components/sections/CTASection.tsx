import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600/30 via-dark-800/80 to-purple-600/20 border border-white/[0.08] px-8 py-16 text-center">
          {/* glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-brand-600/5 to-transparent" />

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-400">
            Get started today
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Ready to build your AI-powered enterprise?
          </h2>
          <p className="mt-4 text-dark-300 max-w-xl mx-auto">
            Join 500+ teams using Nexus AI to automate workflows, deploy agents, and unlock the
            full power of your knowledge base.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="btn-primary">
              Start Free Trial <ArrowRightIcon size={14} />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              View Live Demo
            </Link>
          </div>

          <p className="mt-6 text-xs text-dark-400">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
