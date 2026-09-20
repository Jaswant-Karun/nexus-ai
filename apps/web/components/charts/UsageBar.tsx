import { cn } from "@/lib/utils";

interface UsageBarProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
  color?: "brand" | "green" | "amber" | "red";
  className?: string;
}

const colorMap = {
  brand: "bg-brand-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

function getAutoColor(pct: number): "brand" | "green" | "amber" | "red" {
  if (pct < 50) return "green";
  if (pct < 75) return "brand";
  if (pct < 90) return "amber";
  return "red";
}

export function UsageBar({ label, used, total, unit = "", color, className }: UsageBarProps) {
  const pct = Math.min((used / total) * 100, 100);
  const resolvedColor = color ?? getAutoColor(pct);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-white">{label}</span>
        <span className="text-dark-300">
          {used.toLocaleString()}{unit} / {total.toLocaleString()}{unit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-dark-700 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorMap[resolvedColor]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-[10px] text-dark-400">{pct.toFixed(1)}% used</p>
    </div>
  );
}
