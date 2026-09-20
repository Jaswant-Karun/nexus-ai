"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";

const TIERS = [
  {
    name: "Starter",
    price: "$49",
    period: "per month",
    desc: "Perfect for early developers and individual builders experimenting with multi-agent workflows.",
    features: [
      "Up to 5 Active AI Agents",
      "100 Workflow Runs / month",
      "2 GB Storage Quota",
      "Standard Vector Search (PgVector)",
      "Community Support & Discord",
      "Single Organization Member",
    ],
    cta: "Start with Starter",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$149",
    period: "per month",
    desc: "Designed for fast-growing startups and autonomous operations scaling production workflows.",
    features: [
      "Up to 25 Active AI Agents",
      "5,000 Workflow Runs / month",
      "15 GB Storage Quota",
      "Hybrid Semantic & Keyword Search",
      "Real-time n8n Webhook Triggers",
      "Up to 10 Team Members",
      "Priority SLA Support",
    ],
    cta: "Upgrade to Pro",
    href: "/billing",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual billing",
    desc: "Dedicated clusters, custom model fine-tuning, HIPAA/SOC2 compliance, and unlimited multi-agent DAGs.",
    features: [
      "Unlimited AI Agents & Pipelines",
      "Unlimited Storage & Custom Quotas",
      "Dedicated Private PgVector Clusters",
      "Custom Model Endpoints (Ollama, vLLM)",
      "Granular RBAC & Audit Trails",
      "Dedicated Solutions Architect",
      "99.99% Uptime Guarantee",
    ],
    cta: "Contact Enterprise",
    href: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold border border-purple-500/30 uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable Plans for Every Stage
          </h1>
          <p className="text-dark-300 max-w-2xl mx-auto text-sm sm:text-base">
            Simple, token-efficient pricing. Scale from single-agent experiments to global autonomous workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-200 ${
                tier.popular
                  ? "bg-dark-900 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 scale-[1.02]"
                  : "bg-dark-900/60 border border-white/[0.08] hover:border-white/20 shadow-xl"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-dark-300 mt-1">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-xs text-dark-400">/{tier.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs text-dark-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-white/[0.06]">
                <Link
                  href={tier.href}
                  className={`w-full block text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tier.popular
                      ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
