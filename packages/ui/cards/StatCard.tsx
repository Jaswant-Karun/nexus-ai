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
    <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 shadow-lg hover:border-cyan-500/40 transition-all">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {cardTitle}
      </span>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {cardDetail && (
          <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            {cardDetail}
          </span>
        )}
      </div>
    </div>
  );
}
