type AdminSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  rows: Array<{ label: string; value: string; status?: string }>;
};

export function AdminSection({ eyebrow, title, description, rows }: AdminSectionProps) {
  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white">{title}</h1><p className="mt-2 text-sm text-slate-400">{description}</p></header>
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111521]"><div className="border-b border-white/[0.06] p-5"><h2 className="font-bold text-white">Current overview</h2></div><div className="divide-y divide-white/[0.06]">{rows.map((row) => <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><span className="text-sm text-slate-300">{row.label}</span><div className="flex items-center gap-4"><span className="text-sm font-semibold text-white">{row.value}</span>{row.status && <span className="text-xs text-emerald-400">{row.status}</span>}</div></div>)}</div></section>
      </div>
    </main>
  );
}
