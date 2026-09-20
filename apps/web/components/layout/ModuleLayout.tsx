"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { cn } from "@/lib/utils";
import { APP_NAV } from "@/constants/navigation";

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

export const MAIN_NAV_ITEMS = APP_NAV;

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
        <AppSidebar activeNav={activeNav} className="hidden xl:flex" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav
            aria-label="Platform modules"
            className="flex xl:hidden gap-1 overflow-x-auto border-b border-white/[0.06] bg-dark-950/90 px-4 py-2"
          >
            {APP_NAV.map((item) => {
              const isActive =
                activeNav === item.id ||
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-dark-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

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
