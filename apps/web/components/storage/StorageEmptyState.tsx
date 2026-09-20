import { cn } from "@/lib/utils";

interface StorageEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function StorageEmptyState({
  icon = "📂",
  title,
  description,
  action,
  className,
}: StorageEmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-dark-900/30 px-8 py-20 text-center",
      className
    )}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-800 text-3xl">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-dark-300 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
