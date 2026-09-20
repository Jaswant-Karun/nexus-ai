"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ── Animated circuit dots ─────────────────────────────────── */
function CircuitDots() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-neon-pink/40 animate-particle"
          style={{
            left:           `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${10 + Math.random() * 8}s`,
          }}
        />
      ))}
      {/* Pink dot nodes on circuit lines */}
      {[
        { top: "18%", left: "12%" }, { top: "35%", left: "88%" },
        { top: "72%", left: "6%"  }, { top: "55%", left: "94%" },
        { top: "85%", left: "50%" }, { top: "22%", left: "65%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-neon-pink"
          style={{ ...pos, boxShadow: "0 0 6px rgba(233,30,140,0.9)" }}
        />
      ))}
    </div>
  );
}

/* ── Top logos row ──────────────────────────────────────────── */
function TopBar() {
  return (
    <div className="relative z-20 flex items-center justify-between px-8 pt-5 pb-4">
      {/* NEXUS logo left */}
      <div className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none" stroke="#e91e8c" strokeWidth="1.5"
            style={{ boxShadow: "0 0 10px rgba(233,30,140,0.8)" }} />
          <text x="50%" y="56%" textAnchor="middle" fill="#e91e8c"
            fontFamily="Orbitron,monospace" fontSize="7" fontWeight="900">NX</text>
        </svg>
        <span className="font-cyber text-sm font-black tracking-[0.2em] uppercase text-white/80">
          NEX<span className="text-neon-pink">∞</span>S AI
        </span>
      </div>

      {/* Right badge icons */}
      <div className="flex items-center gap-3 opacity-60">
        {["🏛️", "⚡", "75"].map((badge, i) => (
          <div key={i}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/60">
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen cyber-bg overflow-hidden flex flex-col">
      {/* Scan lines */}
      <div className="scan-overlay" />

      {/* Circuit dots */}
      <CircuitDots />

      {/* Ambient glow centre */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(233,30,140,0.07) 0%, transparent 70%)",
        }}
      />

      <TopBar />

      {/* Main hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 pb-24">
        {/* Subtitle above */}
        <p
          className="font-cyber text-xs font-bold tracking-[0.35em] uppercase mb-6"
          style={{ color: "#cccccc", letterSpacing: "0.4em" }}
        >
          Computer Science and Engineering Association
        </p>
        <p
          className="font-cyber text-xs font-bold tracking-[0.5em] uppercase mb-8"
          style={{ color: "#cccccc", letterSpacing: "0.5em" }}
        >
          Presents
        </p>

        {/* Giant title */}
        <h1
          className={`font-cyber font-black uppercase transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            letterSpacing: "0.12em",
            color: "#ffffff",
            textShadow:
              "0 0 30px rgba(233,30,140,0.5), 0 0 60px rgba(233,30,140,0.25), 2px 2px 0 rgba(233,30,140,0.2)",
            lineHeight: 1,
          }}
        >
          NEXUS AI
        </h1>

        {/* Yellow subtitle */}
        <p
          className="font-cyber font-bold uppercase mt-6 mb-8 tracking-[0.3em]"
          style={{
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            color: "#f5e642",
            textShadow: "0 0 12px rgba(245,230,66,0.7)",
            letterSpacing: "0.35em",
          }}
        >
          Universal Adaptive Intelligence Platform
        </p>

        {/* Date */}
        <p
          className="font-cyber font-black tracking-[0.15em] mb-10"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "#ffffff",
            textShadow: "0 0 20px rgba(255,255,255,0.25)",
          }}
        >
          NEXUS AI · 2026
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link href="/login">
            <button
              type="button"
              className="cyber-btn-filled font-cyber text-xs tracking-widest px-8 py-3"
            >
              GET STARTED
            </button>
          </Link>
          <Link href="/login">
            <button
              type="button"
              className="cyber-btn font-cyber text-xs tracking-widest px-8 py-3"
            >
              SIGN IN
            </button>
          </Link>
        </div>

        {/* "Powered by" */}
        <p
          className="font-cyber text-[10px] tracking-[0.5em] uppercase"
          style={{ color: "#444", letterSpacing: "0.5em" }}
        >
          Powered by &nbsp;
          <span style={{ color: "#e91e8c" }}>NEXUS AI PLATFORM</span>
        </p>
      </div>

      {/* Yellow corner decorators */}
      <div className="pointer-events-none fixed top-4 left-4 z-20">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="60,0 0,0 0,30" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
      <div className="pointer-events-none fixed top-4 right-4 z-20">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="0,0 60,0 60,30" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
      <div className="pointer-events-none fixed bottom-4 left-4 z-20">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="60,30 0,30 0,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-20">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <polyline points="0,30 60,30 60,0" fill="none" stroke="#f5e642" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
}
