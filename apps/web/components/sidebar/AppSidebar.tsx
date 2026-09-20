"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  BotIcon,
  ZapIcon,
  BrainIcon,
  SettingsIcon,
  BarChart3Icon,
  GitBranchIcon,
  FolderOpenIcon,
  MessageSquareIcon,
} from "@/components/ui/Icons";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

function CloudIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { id: "dashboard",  label: "Dashboard",        href: "/dashboard",  icon: <LayoutDashboardIcon size={18} /> },
  { id: "chat",       label: "AI Agent Studio",   href: "/chat",       icon: <BotIcon size={18} /> },
  { id: "workflow",   label: "Workflow Builder",  href: "/workflow",   icon: <ZapIcon size={18} /> },
  { id: "workspace",  label: "Knowledge Engine",  href: "/workspace",  icon: <BrainIcon size={18} /> },
  { id: "storage",    label: "Storage",           href: "/storage",    icon: <CloudIcon size={18} /> },
  { id: "analytics",  label: "Analytics",         href: "/analytics",  icon: <BarChart3Icon size={18} /> },
  { id: "reports",    label: "Reports",           href: "/reports",    icon: <GitBranchIcon size={18} /> },
  { id: "projects",   label: "Projects",          href: "/projects",   icon: <FolderOpenIcon size={18} /> },
  { id: "messages",   label: "Messages",          href: "/messages",   icon: <MessageSquareIcon size={18} />, badge: 3 },
];

const bottomItems: NavItem[] = [
  { id: "settings", label: "Platform Settings", href: "/settings", icon: <SettingsIcon size={18} /> },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/[0.06] bg-dark-900/80 backdrop-blur-md transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="ml-auto mr-2 mt-3 flex h-7 w-7 items-center justify-center rounded-lg text-dark-400 hover:bg-white/5 hover:text-white transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          {collapsed
            ? <><path d="m9 18 6-6-6-6" /></>
            : <><path d="m15 18-6-6 6-6" /></>
          }
        </svg>
      </button>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 pt-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-600/15 text-brand-400"
                  : "text-dark-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className={cn("shrink-0", active && "text-brand-400")}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pb-4 pt-2 border-t border-white/[0.06]">
        {bottomItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-600/15 text-brand-400"
                  : "text-dark-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
