"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ZapIcon } from "@/components/ui/Icons";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AppNavbarProps {
  brandName?: string;
}

export function AppNavbar({ brandName = "NEXUS AI" }: AppNavbarProps) {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setMenuOpen(false));

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-dark-950/90 backdrop-blur-xl px-5">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40 transition-shadow group-hover:shadow-brand-500/60">
          <ZapIcon size={13} className="text-white" />
        </div>
        <span className="text-sm font-extrabold tracking-tight">
          <span className="text-white">{brandName.split(" ")[0]}</span>
          {brandName.split(" ")[1] && (
            <span className="text-brand-400"> {brandName.split(" ")[1]}</span>
          )}
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link href="/notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-dark-400 hover:bg-white/[0.06] hover:text-white transition-colors">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-500 ring-1 ring-dark-950" />
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button type="button" onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/[0.06] transition-colors"
            aria-expanded={menuOpen}>
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-bold text-white shrink-0">
              {loading ? "…" : user ? getInitials(user.name) : "?"}
            </div>
            {/* Name + org */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">
                {loading ? "Loading…" : user?.name ?? "Guest"}
              </p>
              <p className="mt-0.5 text-[10px] text-dark-400 leading-none">
                {user?.organization?.name ?? ""}
              </p>
            </div>
            <svg className={cn("h-3 w-3 text-dark-500 transition-transform", menuOpen && "rotate-180")}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[0.08] bg-dark-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shrink-0">
                    {user ? getInitials(user.name) : "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.name ?? "Guest"}</p>
                    <p className="text-[11px] text-dark-400 truncate">{user?.email ?? ""}</p>
                  </div>
                </div>
                {user?.organization && (
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-dark-500">{user.organization.name}</span>
                    <span className="rounded-full bg-brand-500/15 text-brand-400 px-2 py-0.5 text-[10px] font-semibold uppercase">
                      {user.organization.plan}
                    </span>
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {[
                  { href: "/profile",  icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: "My Profile" },
                  { href: "/settings", icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: "Settings" },
                  { href: "/billing",  icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: "Billing" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:bg-white/[0.05] hover:text-white transition-colors">
                    <span className="text-dark-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div className="border-t border-white/[0.06] py-1.5">
                <button type="button" onClick={() => { setMenuOpen(false); logout(); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
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
