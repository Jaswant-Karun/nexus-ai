"use client";

export interface StatCardProps {
  title?: string;
  label?: string;
  value: string;
  trend?: string;
  detail?: string;
}

export function StatCard({ title, label, value, trend, detail }: StatCardProps) {
  const cardTitle = title || label || "Metric";
  const cardDetail = trend || detail;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-500/40 transition-all dark:bg-gray-900 dark:border-gray-800 dark:shadow-lg dark:hover:border-cyan-500/40">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
        {cardTitle}
      </span>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
        {cardDetail && (
          <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20">
            {cardDetail}
          </span>
        )}
      </div>
    </div>
  );
}

