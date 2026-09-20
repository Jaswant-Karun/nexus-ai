"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZapIcon, SettingsIcon, SearchIcon } from "@/components/ui/Icons";
import { Avatar } from "@/components/common/Avatar";

interface AppNavbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  className?: string;
}

function BellIcon2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function AppNavbar({
  userName = "Admin User",
  userEmail = "admin@nexus.ai",
  notificationCount = 0,
  className,
}: AppNavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <header
      className={cn(
        "glass-dark sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] px-6",
        className
      )}
    >
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/40 transition-shadow group-hover:shadow-brand-500/60">
          <ZapIcon size={15} className="text-white" />
        </div>
        <span className="text-base font-bold tracking-tight">
          <span className="text-white">NEXUS</span>
          <span className="text-brand-400"> AI</span>
        </span>
      </Link>

      {/* Search */}
      <div className="relative hidden max-w-sm flex-1 mx-8 md:flex items-center">
        <SearchIcon size={14} className="absolute left-3 text-dark-400" />
        <input
          type="text"
          placeholder="Search agents, workflows, docs..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-dark-400 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-dark-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <BellIcon2 />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <SettingsIcon size={18} />
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors"
            aria-expanded={dropdownOpen}
          >
            <Avatar name={userName} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{userName}</p>
              <p className="mt-0.5 text-[10px] text-dark-300 leading-none">{userEmail}</p>
            </div>
            <svg className={cn("h-3.5 w-3.5 text-dark-400 transition-transform", dropdownOpen && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="m6 9 6 6 6-6" /></svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/[0.08] bg-dark-800/95 backdrop-blur-md shadow-xl shadow-black/40 py-1 z-50">
              <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-200 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                <Avatar name={userName} size="xs" /> My Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-200 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setDropdownOpen(false)}>
                <SettingsIcon size={14} /> Settings
              </Link>
              <div className="my-1 border-t border-white/[0.06]" />
              <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
