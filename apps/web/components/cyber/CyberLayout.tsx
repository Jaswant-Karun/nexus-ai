"use client";

import { useState } from "react";
import { CyberNavbar, PageCorners } from "./CyberNavbar";
import { RadialNav } from "./RadialNav";
import { cn } from "@/lib/utils";

interface CyberLayoutProps {
  children:    React.ReactNode;
  className?:  string;
  showNavBtn?: boolean;
}

export function CyberLayout({ children, className, showNavBtn = true }: CyberLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen cyber-bg text-cyber-text overflow-x-hidden">
      {/* Scan-line overlay */}
      <div className="scan-overlay" />

      {/* Yellow corner decorators */}
      <PageCorners />

      {/* Top navbar */}
      <CyberNavbar />

      {/* Pink neon line below navbar */}
      <div className="neon-line mx-8 opacity-30" />

      {/* Main content */}
      <main className={cn("relative z-10 px-8 py-6", className)}>
        {children}
      </main>

      {/* Bottom sound + nav toggle */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          type="button"
          title="Sound"
          className="flex h-9 w-9 items-center justify-center border border-neon-pink/30 text-neon-pink/60 hover:text-neon-pink hover:border-neon-pink transition-all"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
      </div>

      {/* Radial nav trigger */}
      {showNavBtn && (
        <div className="fixed bottom-6 right-6 z-50">
          {navOpen ? (
            /* Wheel */
            <div className="relative">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setNavOpen(false)}
              />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <RadialNav onClose={() => setNavOpen(false)} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all animate-pulse-pink"
              style={{
                background: "rgba(233,30,140,0.2)",
                border:     "1.5px solid #e91e8c",
                boxShadow:  "0 0 14px rgba(233,30,140,0.6)",
              }}
              aria-label="Open navigation menu"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth={2}>
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                <circle cx="5" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
;
