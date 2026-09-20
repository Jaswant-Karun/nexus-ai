"use client";

import { useEffect, useState } from "react";

type ApiHealth = { status: string; providers?: Record<string, boolean> };

export default function AdminDashboardPage() {
  const metrics = [
    ["Active users", "1,248", "+8.4%"],
    ["AI requests", "24,891", "+12.1%"],
    ["Workflow success", "97.8%", "+2.6%"],
    ["Open incidents", "3", "Needs review"],
  ];
  const [health, setHealth] = useState<ApiHealth | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/health`)
      .then((response) => response.json() as Promise<ApiHealth>)
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nexus AI Admin</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white">Platform operations</h1><p className="mt-2 text-sm text-slate-400">Monitor AI usage, workflow reliability, and service readiness.</p></header>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, delta]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#111521] p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-white">{value}</p><p className={`mt-2 text-xs ${delta === "Needs review" ? "text-amber-300" : "text-emerald-400"}`}>{delta}</p></div>)}</section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#111521] p-6"><div className="flex items-center justify-between"><h2 className="font-bold text-white">Service readiness</h2><span className={health?.status === "healthy" ? "text-xs text-emerald-400" : "text-xs text-amber-300"}>{health?.status === "healthy" ? "Live" : "Checking"}</span></div><div className="mt-5 space-y-3">{["Core API", "AI orchestration", "Memory service", "Knowledge graph"].map((service, index) => <div key={service} className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3"><span className="text-sm text-slate-300">{service}</span><span className={`flex items-center gap-2 text-xs ${index === 0 && health?.status === "healthy" ? "text-emerald-400" : "text-amber-300"}`}><span className="h-2 w-2 rounded-full bg-current" />{index === 0 && health?.status === "healthy" ? "Healthy" : "Configured"}</span></div>)}</div></div><div className="rounded-2xl border border-white/10 bg-[#111521] p-6"><h2 className="font-bold text-white">Provider readiness</h2><div className="mt-5 space-y-3">{Object.entries(health?.providers ?? { openai: false, anthropic: false, google: false }).map(([provider, configured]) => <div key={provider} className="flex items-center justify-between text-sm"><span className="capitalize text-slate-400">{provider}</span><span className={configured ? "text-emerald-400" : "text-slate-600"}>{configured ? "Configured" : "Not configured"}</span></div>)}</div></div></section>
      </div>
    </main>
  );
}
