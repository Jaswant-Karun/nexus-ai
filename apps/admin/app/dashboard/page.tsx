"use client";

import { useEffect, useState } from "react";

type Dependency = { name: string; status: string; latency_ms: number };
type ApiHealth  = {
  status:       string;
  providers?:   Record<string, boolean>;
  dependencies?: Dependency[];
};

const API_URL    = process.env.NEXT_PUBLIC_API_URL    ?? "http://127.0.0.1:8000";
const AI_SVC_URL = process.env.NEXT_PUBLIC_AI_SVC_URL ?? "http://127.0.0.1:8001";

const SERVICE_LABELS: Record<string, string> = {
  postgres:       "Core API / Database",
  redis:          "Cache / Session store",
  "vector-store": "Vector DB (Qdrant)",
  ai_service:     "AI Orchestration (port 8001)",
};

export default function AdminDashboardPage() {
  const metrics = [
    ["Active users",      "1,248",  "+8.4%"],
    ["AI requests",       "24,891", "+12.1%"],
    ["Workflow success",  "97.8%",  "+2.6%"],
    ["Open incidents",    "3",      "Needs review"],
  ];

  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [aiHealth,  setAiHealth]  = useState<ApiHealth | null>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const loadHealth = async () => {
      // 1 — Core API health (port 8000) — includes providers + dependencies
      try {
        const r = await fetch(`${API_URL}/v1/health`, { cache: "no-store" });
        if (r.ok) setApiHealth(await r.json() as ApiHealth);
      } catch { /* service offline */ }

      // 2 — AI service health (port 8001) — also returns providers
      try {
        const r = await fetch(`${AI_SVC_URL}/health`, { cache: "no-store" });
        if (r.ok) setAiHealth(await r.json() as ApiHealth);
      } catch { /* service offline */ }

      setLoading(false);
    };
    void loadHealth();
  }, []);

  // Merge providers from both services — either source saying "true" wins
  const mergedProviders: Record<string, boolean> = {
    openai:    false,
    anthropic: false,
    google:    false,
    xai:       false,
    deepseek:  false,
  };
  for (const [k, v] of Object.entries(apiHealth?.providers ?? {})) {
    if (v) mergedProviders[k] = true;
  }
  for (const [k, v] of Object.entries(aiHealth?.providers ?? {})) {
    if (v) mergedProviders[k] = true;
  }

  // Build service rows from dependencies
  const deps: Dependency[] = apiHealth?.dependencies ?? [];
  const aiOnline = aiHealth?.status === "online" || aiHealth?.status === "healthy";

  const serviceRows = [
    ...deps.map((d) => ({
      name:   SERVICE_LABELS[d.name] ?? d.name,
      status: d.status === "ready" ? "Healthy" : "Degraded",
      ok:     d.status === "ready",
    })),
    { name: "AI Orchestration (port 8001)", status: aiOnline ? "Online" : "Offline", ok: aiOnline },
  ];

  const overallOk = !loading && (apiHealth?.status === "healthy" || apiHealth?.status === "ok");

  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nexus AI Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Platform operations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor AI usage, workflow reliability, and service readiness.
          </p>
        </header>

        {/* KPI metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, delta]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#111521] p-5">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-white">{value}</p>
              <p className={`mt-2 text-xs ${delta === "Needs review" ? "text-amber-300" : "text-emerald-400"}`}>
                {delta}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">

          {/* ── Service Readiness ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-[#111521] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white">Service readiness</h2>
              <span className={`text-xs ${
                loading       ? "text-slate-500" :
                overallOk     ? "text-emerald-400" :
                apiHealth     ? "text-amber-300" : "text-red-400"
              }`}>
                {loading ? "Checking…" : overallOk ? "Live" : apiHealth ? "Degraded" : "Offline"}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="text-xs text-slate-500 animate-pulse">Loading service status…</p>
              ) : serviceRows.length > 0 ? (
                serviceRows.map((svc) => (
                  <div key={svc.name}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3">
                    <span className="text-sm text-slate-300">{svc.name}</span>
                    <span className={`flex items-center gap-2 text-xs ${svc.ok ? "text-emerald-400" : "text-amber-300"}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {svc.status}
                    </span>
                  </div>
                ))
              ) : (
                ["Core API", "AI orchestration", "Memory service", "Knowledge graph"].map((name) => (
                  <div key={name}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3">
                    <span className="text-sm text-slate-300">{name}</span>
                    <span className="flex items-center gap-2 text-xs text-amber-300">
                      <span className="h-2 w-2 rounded-full bg-current" />
                      Configured
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Provider Readiness ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-[#111521] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white">Provider readiness</h2>
              {!loading && (
                <span className="text-xs text-slate-500">
                  {Object.values(mergedProviders).filter(Boolean).length} / {Object.keys(mergedProviders).length} configured
                </span>
              )}
            </div>

            {loading ? (
              <p className="mt-5 text-xs text-slate-500 animate-pulse">Checking provider keys…</p>
            ) : (
              <div className="mt-5 space-y-3">
                {Object.entries(mergedProviders).map(([provider, configured]) => (
                  <div key={provider} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-300">{provider}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${configured ? "bg-emerald-400" : "bg-slate-600"}`} />
                      <span className={configured ? "text-emerald-400" : "text-slate-500"}>
                        {configured ? "Configured ✓" : "Not configured"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Help text when providers are missing */}
            {!loading && Object.values(mergedProviders).some((v) => !v) && (
              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-xs text-amber-400 font-semibold mb-1">Missing provider keys</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Add API keys to <code className="bg-white/10 px-1 rounded">apps/web/.env.local</code> and
                  restart the backend API server so it picks up the new environment variables.
                </p>
                <div className="mt-2 font-mono text-[10px] text-slate-500 space-y-0.5">
                  <p>OPENAI_API_KEY=sk-...</p>
                  <p>ANTHROPIC_API_KEY=sk-ant-...</p>
                  <p>GOOGLE_AI_API_KEY=AI...</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* API endpoints reference */}
        <div className="rounded-2xl border border-white/10 bg-[#111521] p-6">
          <h2 className="font-bold text-white mb-4">Service endpoints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Core API",      url: `${API_URL}/v1/health`,  status: apiHealth?.status },
              { label: "AI Service",    url: `${AI_SVC_URL}/health`,  status: aiHealth?.status  },
              { label: "API Docs",      url: `${AI_SVC_URL}/docs`,    status: aiHealth ? "online" : undefined },
            ].map((ep) => (
              <a key={ep.label} href={ep.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{ep.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{ep.url}</p>
                </div>
                <span className={`text-xs font-semibold ${
                  ep.status === "healthy" || ep.status === "online" || ep.status === "ok"
                    ? "text-emerald-400" : "text-slate-600"
                }`}>
                  {ep.status ?? "offline"}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
