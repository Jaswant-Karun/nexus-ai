"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ZapIcon } from "@/components/ui/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AppNavbarProps {
  brandName?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export function AppNavbar({
  brandName = "NEXUS AI",
  showBackButton = false,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  actions,
}: AppNavbarProps) {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setMenuOpen(false));

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-5 transition-colors dark:border-white/[0.06] dark:bg-dark-950/90">
      {/* Brand & Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-600/30 transition-shadow group-hover:shadow-brand-500/50">
            <ZapIcon size={13} className="text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            <span className="text-slate-900 dark:text-white">{brandName.split(" ")[0]}</span>
            {brandName.split(" ")[1] && (
              <span className="text-brand-600 dark:text-brand-400"> {brandName.split(" ")[1]}</span>
            )}
          </span>
        </Link>

        {showBackButton && (
          <Link
            href={backHref}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-brand-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            <span>{backLabel}</span>
          </Link>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5">
        {actions}
        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label="View notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-dark-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-dark-950" />
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-transparent p-1 sm:px-2.5 sm:py-1 hover:border-slate-200 hover:bg-slate-100 dark:hover:border-white/10 dark:hover:bg-white/[0.06] transition-all"
            aria-expanded={menuOpen}
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-bold text-white shadow-sm shrink-0">
              {loading ? "…" : user ? getInitials(user.name) : "JK"}
            </div>
            {/* Name + org */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-white leading-none">
                {loading ? "Loading…" : user?.name ?? "Jaswant Karun"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-dark-400 leading-none">
                {user?.organization?.name ?? "Nexus AI Labs"}
              </p>
            </div>
            <svg
              className={cn("h-3 w-3 text-slate-400 dark:text-dark-500 transition-transform", menuOpen && "rotate-180")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-xl dark:border-white/[0.08] dark:bg-dark-900/95 dark:text-white dark:shadow-2xl dark:shadow-black/50 overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shrink-0">
                    {user ? getInitials(user.name) : "JK"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name ?? "Jaswant Karun"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-dark-400 truncate">
                      {user?.email ?? "admin@nexus.ai"}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-dark-400">
                    {user?.organization?.name ?? "Nexus AI Global Labs"}
                  </span>
                  <span className="rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-0.5 text-[10px] font-semibold uppercase">
                    {user?.organization?.plan ?? "Enterprise"}
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {[
                  {
                    href: "/profile",
                    icon: (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                    label: "My Profile",
                  },
                  {
                    href: "/settings",
                    icon: (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    ),
                    label: "Settings",
                  },
                  {
                    href: "/billing",
                    icon: (
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    ),
                    label: "Billing",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-dark-200 dark:hover:bg-white/[0.05] dark:hover:text-white transition-colors"
                  >
                    <span className="text-slate-400 dark:text-dark-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div className="border-t border-slate-100 dark:border-white/[0.06] py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/[0.08] transition-colors"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
