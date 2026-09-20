"use client";

export interface InsightCardProps {
  title: string;
  metric?: string;
  description: string;
  accent?: string;
}

export function InsightCard({ title, metric, description, accent }: InsightCardProps) {
  return (
    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 shadow-lg relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        {accent && <span className="text-lg">{accent}</span>}
      </div>

      {metric && (
        <div className="text-3xl font-extrabold text-cyan-400 mb-2 tracking-tight">
          {metric}
        </div>
      )}

      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}