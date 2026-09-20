import Link from "next/link";
import { cn } from "@/lib/utils";
import { BotIcon, ZapIcon, BrainIcon, BarChart3Icon, SettingsIcon, GitBranchIcon } from "@/components/ui/Icons";

const actions = [
  { label: "New Agent",    icon: <BotIcon size={18} />,       href: "/chat",      color: "text-brand-400  bg-brand-500/10  hover:bg-brand-500/20"  },
  { label: "New Workflow", icon: <ZapIcon size={18} />,       href: "/workflow",  color: "text-purple-400 bg-purple-500/10 hover:bg-purple-500/20" },
  { label: "Upload Docs",  icon: <BrainIcon size={18} />,     href: "/workspace", color: "text-cyan-400   bg-cyan-500/10   hover:bg-cyan-500/20"   },
  { label: "Analytics",    icon: <BarChart3Icon size={18} />, href: "/analytics", color: "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" },
  { label: "Reports",      icon: <GitBranchIcon size={18} />, href: "/reports",   color: "text-amber-400  bg-amber-500/10  hover:bg-amber-500/20"  },
  { label: "Settings",     icon: <SettingsIcon size={18} />,  href: "/settings",  color: "text-dark-300   bg-white/5       hover:bg-white/10"       },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-3 gap-3 sm:grid-cols-6", className)}>
      {actions.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-xs font-medium transition-colors",
            a.color
          )}
        >
          {a.icon}
          <span>{a.label}</span>
        </Link>
      ))}
    </div>
  );
}
