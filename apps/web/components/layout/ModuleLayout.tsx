"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { cn } from "@/lib/utils";

export interface SubnavItem {
  label: string;
  href: string;
  badge?: string | number;
}

export interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  subnav?: SubnavItem[];
  children: ReactNode;
  activeNav?: string;
}

export const MAIN_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
  { id: "agents", label: "AI Agents", href: "/agents", icon: "🤖" },
  { id: "workflows", label: "Workflows", href: "/workflows", icon: "⚡" },
  { id: "chat", label: "AI Chat", href: "/chat", icon: "💬" },
  { id: "projects", label: "Projects", href: "/projects", icon: "📁" },
  { id: "storage", label: "Storage", href: "/storage", icon: "☁️" },
  { id: "search", label: "Search", href: "/search", icon: "🔍" },
  { id: "knowledge-graph", label: "Knowledge Graph", href: "/knowledge-graph", icon: "🕸️" },
  { id: "memory", label: "AI Memory", href: "/memory", icon: "🧠" },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "📈" },
  { id: "reports", label: "Reports", href: "/reports", icon: "📑" },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: "📅" },
  { id: "integrations", label: "Integrations", href: "/integrations", icon: "🔌" },
  { id: "organization", label: "Organization", href: "/organization", icon: "🏢" },
  { id: "admin", label: "Admin Portal", href: "/admin", icon: "🛡️" },
  { id: "developer", label: "Developer", href: "/developer", icon: "💻" },
  { id: "help", label: "Help Center", href: "/help", icon: "❓" },
  { id: "settings", label: "Settings", href: "/settings", icon: "⚙️" },
];

export function ModuleLayout({
  title,
  subtitle,
  badge,
  actions,
  subnav,
  children,
  activeNav,
}: ModuleLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-brand-500/30">
      {/* Top Universal Navbar */}
      <AppNavbar brandName="NEXUS AI" />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Navigation Sidebar */}
        <aside className="w-64 border-r border-white/[0.06] bg-dark-950/80 backdrop-blur-md hidden xl:flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-dark-500 mb-2">
              Platform Modules
            </p>
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                activeNav === item.id ||
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm"
                      : "text-dark-300 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick System Badge */}
          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-[11px] text-dark-300 space-y-1">
              <div className="flex items-center justify-between text-white font-bold">
                <span>NEXUS Engine</span>
                <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  v1.0 Live
                </span>
              </div>
              <p className="text-[10px] text-dark-400">
                Multi-agent DAG orchestrator with distributed memory & vector storage.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header & Sub-navigation Strip */}
          <header className="border-b border-white/[0.06] bg-dark-900/40 backdrop-blur-md px-6 py-5 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {title}
                  </h1>
                  {badge && (
                    <span className="rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wide">
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-xs lg:text-sm text-dark-300 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2.5">{actions}</div>}
            </div>

            {/* Sub-navigation tabs */}
            {subnav && subnav.length > 0 && (
              <div className="max-w-7xl mx-auto mt-4 pt-2 border-t border-white/[0.04] flex items-center gap-1 overflow-x-auto pb-1">
                {subnav.map((tab) => {
                  const isCurrent = pathname === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                        isCurrent
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                          : "text-dark-400 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && (
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                            isCurrent
                              ? "bg-white/20 text-white"
                              : "bg-white/10 text-dark-400"
                          )}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </header>

          {/* Body Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ModuleLayout;
