"use client";

import { cn } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

interface ActivityChartProps {
  data: DataPoint[];
  title?: string;
  color?: "brand" | "green" | "purple";
  className?: string;
}

const colorMap = {
  brand: {
    bar: "bg-brand-500",
    glow: "shadow-brand-500/40",
    label: "text-brand-400",
  },
  green: {
    bar: "bg-emerald-500",
    glow: "shadow-emerald-500/40",
    label: "text-emerald-400",
  },
  purple: {
    bar: "bg-purple-500",
    glow: "shadow-purple-500/40",
    label: "text-purple-400",
  },
};

export function ActivityChart({ data, title, color = "brand", className }: ActivityChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const c = colorMap[color];

  return (
    <div className={cn("glass-dark rounded-2xl p-5 border border-white/[0.06]", className)}>
      {title && (
        <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      )}
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.label} className="group flex flex-1 flex-col items-center gap-1">
              {/* tooltip */}
              <span className="invisible group-hover:visible rounded bg-dark-700 px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap">
                {d.value}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-500",
                  c.bar,
                  `shadow-sm ${c.glow}`
                )}
                style={{ height: `${pct}%`, minHeight: "4px" }}
              />
              <span className="text-[9px] text-dark-400 truncate w-full text-center">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
