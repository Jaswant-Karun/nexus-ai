import { cn } from "@/lib/utils";

type NodeKind = "trigger" | "agent" | "action" | "condition" | "output";

interface WorkflowNodeProps {
  id: string;
  kind: NodeKind;
  label: string;
  description?: string;
  selected?: boolean;
  hasError?: boolean;
  className?: string;
}

const kindStyles: Record<NodeKind, { bg: string; border: string; badge: string; icon: string }> = {
  trigger:   { bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   badge: "bg-cyan-500/20 text-cyan-400",    icon: "⚡" },
  agent:     { bg: "bg-brand-500/10",  border: "border-brand-500/30",  badge: "bg-brand-500/20 text-brand-400",  icon: "🤖" },
  action:    { bg: "bg-purple-500/10", border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-400",icon: "▶" },
  condition: { bg: "bg-amber-500/10",  border: "border-amber-500/30",  badge: "bg-amber-500/20 text-amber-400",  icon: "◆" },
  output:    { bg: "bg-emerald-500/10",border: "border-emerald-500/30",badge: "bg-emerald-500/20 text-emerald-400",icon: "✓" },
};

export function WorkflowNode({
  id,
  kind,
  label,
  description,
  selected,
  hasError,
  className,
}: WorkflowNodeProps) {
  const s = kindStyles[kind];

  return (
    <div
      data-node-id={id}
      className={cn(
        "group relative w-52 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer select-none",
        s.bg,
        s.border,
        selected && "ring-2 ring-brand-500/60 ring-offset-1 ring-offset-dark-950",
        hasError && "border-red-500/50 ring-2 ring-red-500/30 ring-offset-1 ring-offset-dark-950",
        "hover:brightness-110",
        className
      )}
    >
      {/* top connector dot */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-dark-900 bg-dark-600 group-hover:bg-brand-500 transition-colors" />

      <div className="flex items-start gap-2.5">
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base", s.badge)}>
          {s.icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white leading-tight truncate">{label}</p>
          <span className={cn("mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide", s.badge)}>
            {kind}
          </span>
          {description && <p className="mt-1 text-[10px] text-dark-400 leading-snug">{description}</p>}
        </div>
      </div>

      {/* bottom connector dot */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-dark-900 bg-dark-600 group-hover:bg-brand-500 transition-colors" />

      {hasError && (
        <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold shadow">!</div>
      )}
    </div>
  );
}
