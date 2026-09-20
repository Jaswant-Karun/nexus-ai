"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

/* ── Yellow diagonal corner decorators ─────────────────────── */
function PageCorners() {
  return (
    <>
      {/* Top-left */}
      <div className="fixed top-4 left-4 pointer-events-none z-10">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="60,0 0,0 0,30" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
          <line x1="20" y1="0" x2="30" y2="-10" stroke="#f5e642" strokeWidth="1" opacity="0.4"/>
        </svg>
      </div>
      {/* Top-right */}
      <div className="fixed top-4 right-4 pointer-events-none z-10">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="0,0 60,0 60,30" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
      {/* Bottom-left */}
      <div className="fixed bottom-4 left-4 pointer-events-none z-10">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="60,30 0,30 0,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
      {/* Bottom-right */}
      <div className="fixed bottom-4 right-4 pointer-events-none z-10">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="0,30 60,30 60,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
    </>
  );
}

/* ── NEXUS AI Logo ─────────────────────────────────────────── */
function NexusLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <svg width="28" height="28" viewBox="0 0 32 32" className="text-neon-pink">
        <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="#e91e8c" strokeWidth="1.5"/>
        <polygon points="16,6 26,11 26,21 16,26 6,21 6,11" fill="none" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
        <line x1="16" y1="2" x2="16" y2="30" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
        <line x1="2" y1="10" x2="30" y2="22" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
        <line x1="30" y1="10" x2="2" y2="22" stroke="#e91e8c" strokeWidth="0.8" opacity="0.5"/>
      </svg>
      <span className="font-cyber font-black text-lg tracking-[0.2em] uppercase text-white group-hover:neon-text transition-all">
        NEX<span className="text-neon-pink" style={{textShadow:"0 0 10px rgba(233,30,140,0.8)"}}>∞</span>S AI
      </span>
    </Link>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────── */
interface CyberNavbarProps {
  showLogout?: boolean;
}

export function CyberNavbar({ showLogout = true }: CyberNavbarProps) {
  const { logout } = useAuth();

  return (
    <header className="relative z-40 flex items-center justify-between px-8 py-4 border-b border-neon-pink/10">
      {/* Left — sound icon placeholder */}
      <div className="w-24 flex items-center gap-3">
        <button type="button"
          className="p-2 border border-neon-pink/30 text-neon-pink/60 hover:text-neon-pink hover:border-neon-pink/60 transition-all"
          title="Toggle sound">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>
      </div>

      {/* Center — Logo */}
      <NexusLogo />

      {/* Right — Logout */}
      <div className="w-24 flex justify-end">
        {showLogout && (
          <button type="button" onClick={logout} className="cyber-btn text-xs">
            LOGOUT
          </button>
        )}
      </div>
    </header>
  );
}

export { PageCorners };
