import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  metric: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function InsightCard({ title, metric, description, icon, className }: InsightCardProps) {
  return (
    <div
      className={cn(
        "glass-dark rounded-2xl p-6 border border-white/[0.06] bg-dark-900/60 transition-all duration-300 card-hover",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400">
          {icon}
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wider text-dark-300">{title}</p>
      <p className="mt-2 text-4xl font-extrabold text-white tracking-tight">{metric}</p>
      <p className="mt-2 text-sm text-dark-300 leading-relaxed">{description}</p>
    </div>
  );
}
