import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  accent?: "brand" | "green" | "amber" | "red" | "purple";
  className?: string;
}

const accentMap = {
  brand: "from-brand-500/10 to-brand-700/5 border-brand-500/20 text-brand-400",
  green: "from-emerald-500/10 to-emerald-700/5 border-emerald-500/20 text-emerald-400",
  amber: "from-amber-500/10 to-amber-700/5 border-amber-500/20 text-amber-400",
  red: "from-red-500/10 to-red-700/5 border-red-500/20 text-red-400",
  purple: "from-purple-500/10 to-purple-700/5 border-purple-500/20 text-purple-400",
};

export function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  accent = "brand",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-dark rounded-2xl p-5 bg-gradient-to-br border transition-all duration-300 card-hover",
        accentMap[accent],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-dark-300 uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-current">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1.5 text-xs font-medium",
            trendUp === true && "text-emerald-400",
            trendUp === false && "text-red-400",
            trendUp === undefined && "text-dark-300"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
