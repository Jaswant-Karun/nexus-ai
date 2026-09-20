import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Status } from "@/types";

interface ReportCardProps {
  title: string;
  description?: string;
  status?: Status;
  generatedAt?: string;
  size?: string;
  format?: string;
  onDownload?: () => void;
  onView?: () => void;
  className?: string;
}

export function ReportCard({
  title,
  description,
  status = "success",
  generatedAt,
  size,
  format = "PDF",
  onDownload,
  onView,
  className,
}: ReportCardProps) {
  return (
    <div
      className={cn(
        "glass-dark rounded-2xl border border-white/[0.06] p-5 flex items-start justify-between gap-4 transition-all card-hover",
        className
      )}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-400 text-sm font-bold">
        {format}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <StatusBadge status={status} />
        </div>
        {description && <p className="text-xs text-dark-300 truncate">{description}</p>}
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-dark-400">
          {generatedAt && <span>Generated {generatedAt}</span>}
          {size && <span>· {size}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onView && (
          <button
            type="button"
            onClick={onView}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
          >
            View
          </button>
        )}
        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="rounded-lg bg-brand-600/15 px-3 py-1.5 text-xs font-medium text-brand-400 hover:bg-brand-600/25 transition-colors"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
}
