"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAV } from "@/constants/navigation";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const navItems: NavItem[] = APP_NAV.map((item) => ({
  ...item,
  icon: <span aria-hidden="true">{item.icon}</span>,
}));

const bottomItems: NavItem[] = [
  { id: "profile", label: "My Profile", href: "/profile", icon: <span aria-hidden="true">👤</span> },
  { id: "settings", label: "Platform Settings", href: "/settings", icon: <span aria-hidden="true">⚙️</span> },
];

interface AppSidebarProps {
  className?: string;
  activeNav?: string;
}

export function AppSidebar({ className, activeNav }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-white/[0.06] dark:bg-dark-900/80",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="ml-auto mr-2 mt-3 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-dark-400 dark:hover:bg-white/5 dark:hover:text-white"
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
          const active = activeNav === item.id || pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-50 text-brand-600 font-semibold dark:bg-brand-600/15 dark:text-brand-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-dark-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <span className={cn("shrink-0", active ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-dark-400")}>{item.icon}</span>
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
      <div className="px-2 pb-4 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
        {bottomItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-50 text-brand-600 font-semibold dark:bg-brand-600/15 dark:text-brand-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-dark-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <span className={cn("shrink-0", active ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-dark-400")}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
