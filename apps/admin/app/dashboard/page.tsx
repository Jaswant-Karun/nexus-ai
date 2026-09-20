export default function AdminDashboardPage() {
  const metrics = [
    ["Active users", "1,248", "+8.4%"],
    ["AI requests", "24,891", "+12.1%"],
    ["Workflow success", "97.8%", "+2.6%"],
    ["Open incidents", "3", "Needs review"],
  ];

  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Nexus AI Admin</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white">Platform operations</h1><p className="mt-2 text-sm text-slate-400">Monitor AI usage, workflow reliability, and service readiness.</p></header>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, delta]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#111521] p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-white">{value}</p><p className={`mt-2 text-xs ${delta === "Needs review" ? "text-amber-300" : "text-emerald-400"}`}>{delta}</p></div>)}</section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#111521] p-6"><h2 className="font-bold text-white">Service readiness</h2><div className="mt-5 space-y-3">{["Core API", "AI orchestration", "Memory service", "Knowledge graph"].map((service) => <div key={service} className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3"><span className="text-sm text-slate-300">{service}</span><span className="flex items-center gap-2 text-xs text-emerald-400"><span className="h-2 w-2 rounded-full bg-current" />Ready</span></div>)}</div></div><div className="rounded-2xl border border-white/10 bg-[#111521] p-6"><h2 className="font-bold text-white">Admin navigation</h2><div className="mt-5 grid grid-cols-2 gap-2">{[["Users", "/users"], ["Agents", "/agents"], ["AI Models", "/ai-models"], ["Analytics", "/analytics"], ["Logs", "/logs"], ["Security", "/security"]].map(([label, href]) => <a key={href} href={href} className="rounded-xl border border-white/[0.06] px-3 py-3 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white">{label}</a>)}</div></div></section>
      </div>
    </main>
  );
}
