import { cn } from "@/lib/utils";

type Status = "active" | "paused" | "error" | "pending" | "success" | "inactive";

interface StatusBadgeProps {
  status: Status;
  label?: string;
  dot?: boolean;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  active:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  success:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
  pending:  "bg-amber-500/10  text-amber-400  border-amber-500/20",
  error:    "bg-red-500/10    text-red-400    border-red-500/20",
  inactive: "bg-dark-700/60   text-dark-300   border-dark-600/40",
};

const dotStyles: Record<Status, string> = {
  active:   "bg-emerald-400",
  success:  "bg-emerald-400",
  paused:   "bg-amber-400",
  pending:  "bg-amber-400",
  error:    "bg-red-400",
  inactive: "bg-dark-400",
};

export function StatusBadge({ status, label, dot = true, className }: StatusBadgeProps) {
  const display = label ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])} />
      )}
      {display}
    </span>
  );
}
