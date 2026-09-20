import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, badge, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6 backdrop-blur-sm transition-all duration-300 card-hover",
        "hover:border-brand-500/30 hover:bg-dark-800/60",
        className
      )}
    >
      {/* glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 glow-sm" />

      <div className="relative">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400 group-hover:bg-brand-600/25 transition-colors">
          {icon}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold text-white">{title}</h3>
          {badge && (
            <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-400">
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-dark-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
