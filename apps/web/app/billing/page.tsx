"use client";

import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { cn } from "@/lib/utils";

interface BillingData {
  plan:          string;
  orgName:       string;
  usedStorageGB: number;
  quotaGB:       number;
  usedStorageBytes: number;
  quotaBytes:    number;
  storageFiles:  number;
  aiJobsDone:    number;
  agentCount:    number;
  conversationCount: number;
  docCount:      number;
}

function UsageBar({ label, used, max, unit = "" }: { label: string; used: number; max: number; unit?: string }) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const color = pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-brand-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-white">{label}</span>
        <span className="text-gray-400">{used.toLocaleString()}{unit} / {max.toLocaleString()}{unit}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-right text-[10px] text-gray-500">{pct.toFixed(1)}%</p>
    </div>
  );
}

const PLANS = [
  { name: "Starter",    price: "$49/mo",  highlight: false },
  { name: "Pro",        price: "$149/mo", highlight: false },
  { name: "Enterprise", price: "Custom",  highlight: false },
];

export default function BillingPage() {
  const [data,    setData]    = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: BillingData }) => {
        if (d.success && d.data) setData(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const plan     = data?.plan ?? "FREE";
  const plans    = PLANS.map((p) => ({ ...p, highlight: p.name.toUpperCase() === plan }));
  const isLoading = loading || !data;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Billing & Usage</h1>
            <p className="text-gray-400 mt-1">
              {isLoading ? "Loading…" : `${data.orgName} · ${data.plan} Plan`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { title: "Current Plan",     value: isLoading ? "—" : plan,                                    sub: "Active subscription",          accent: "brand"  },
              { title: "Storage Used",     value: isLoading ? "—" : `${data.usedStorageGB.toFixed(2)} GB`,   sub: `of ${data?.quotaGB ?? 1} GB`,   accent: "purple" },
              { title: "Total Files",      value: isLoading ? "—" : data.storageFiles,                       sub: "Uploaded to storage",           accent: "cyan"   },
              { title: "AI Jobs Done",     value: isLoading ? "—" : data.aiJobsDone,                         sub: "OCR + summarise + embed",       accent: "green"  },
            ].map((s) => (
              <div key={s.title}
                className={`rounded-2xl border bg-gradient-to-br p-5 ${
                  s.accent === "brand"  ? "from-brand-500/10  to-brand-700/5  border-brand-500/20"  :
                  s.accent === "purple" ? "from-purple-500/10 to-purple-700/5 border-purple-500/20" :
                  s.accent === "cyan"   ? "from-cyan-500/10   to-cyan-700/5   border-cyan-500/20"   :
                  "from-emerald-500/10 to-emerald-700/5 border-emerald-500/20"
                }`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">{s.title}</p>
                <p className={`text-3xl font-extrabold text-white ${isLoading ? "animate-pulse" : ""}`}>{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((p) => (
                <div key={p.name}
                  className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all ${
                    p.highlight
                      ? "border-brand-500/50 bg-brand-500/10 ring-1 ring-brand-500/30"
                      : "border-white/[0.06] bg-gray-900/60"
                  }`}>
                  {p.highlight && (
                    <span className="self-start rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Current Plan
                    </span>
                  )}
                  <div>
                    <p className="text-lg font-bold text-white">{p.name}</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{p.price}</p>
                  </div>
                  <button type="button"
                    className={`mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      p.highlight
                        ? "bg-brand-600 text-white hover:bg-brand-500"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    {p.highlight ? "Manage Plan" : "Upgrade"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Usage bars — real data from DB */}
          <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 space-y-5">
            <h2 className="text-base font-semibold text-white">Resource Usage</h2>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-800/60 rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                <UsageBar label="Storage"          used={Math.round(data.usedStorageGB * 100)} max={data.quotaGB * 100}       unit=" GB" />
                <UsageBar label="AI Agent Sessions" used={data.conversationCount}               max={Math.max(data.conversationCount * 3, 100)} />
                <UsageBar label="AI Jobs Processed" used={data.aiJobsDone}                      max={Math.max(data.aiJobsDone * 2, 50)}     />
                <UsageBar label="Knowledge Docs"    used={data.docCount}                        max={Math.max(data.docCount * 3, 20)}       />
              </>
            )}
          </div>

          {/* No invoices until connected to a real billing provider */}
          <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 p-6 text-center">
            <p className="text-gray-500 text-sm">
              Invoice history will appear here once connected to a billing provider.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
