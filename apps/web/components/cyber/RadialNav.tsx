"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  id:    string;
  label: string;
  href:  string;
  icon:  React.ReactNode;
  angle: number; // degrees, 0 = top
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home", label: "HOME", href: "/dashboard", angle: 240,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: "profile", label: "PROFILE", href: "/profile", angle: 300,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    id: "events", label: "EVENTS", href: "/storage", angle: 0,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    id: "schedule", label: "SCHEDULE", href: "/workflow", angle: 60,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    id: "workshops", label: "WORKSHOPS", href: "/workspace", angle: 120,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    id: "papers", label: "PAPERS", href: "/storage/ai", angle: 180,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    id: "about", label: "ABOUT", href: "/settings", angle: 195,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
  {
    id: "game", label: "GAME", href: "/chat", angle: 285,
    icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M7 12h.01"/><path d="M17 12h.01"/><path d="M12 7v10"/></svg>,
  },
];

const RADIUS = 105; // px from center to icon center
const SIZE   = 310; // overall wheel diameter

function polarToCartesian(angle: number, r: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: SIZE / 2 + r * Math.cos(rad),
    y: SIZE / 2 + r * Math.sin(rad),
  };
}

interface RadialNavProps {
  onClose?: () => void;
}

export function RadialNav({ onClose }: RadialNavProps) {
  const router   = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (href: string) => {
    onClose?.();
    router.push(href);
  };

  return (
    <div
      className="relative select-none"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* SVG ring */}
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      >
        {/* Outer ring */}
        <circle cx={SIZE/2} cy={SIZE/2} r={RADIUS + 28}
          fill="none" stroke="rgba(233,30,140,0.15)" strokeWidth="1"/>
        {/* Middle ring */}
        <circle cx={SIZE/2} cy={SIZE/2} r={RADIUS}
          fill="none" stroke="rgba(233,30,140,0.08)" strokeWidth="60"/>
        {/* Separator lines */}
        {NAV_ITEMS.map((item) => {
          const a1 = ((item.angle - 22.5 - 90) * Math.PI) / 180;
          const x1 = SIZE/2 + (RADIUS - 30) * Math.cos(a1);
          const y1 = SIZE/2 + (RADIUS - 30) * Math.sin(a1);
          const x2 = SIZE/2 + (RADIUS + 28) * Math.cos(a1);
          const y2 = SIZE/2 + (RADIUS + 28) * Math.sin(a1);
          return (
            <line key={item.id} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(233,30,140,0.2)" strokeWidth="1"/>
          );
        })}
        {/* Inner ring */}
        <circle cx={SIZE/2} cy={SIZE/2} r={RADIUS - 30}
          fill="rgba(8,8,8,0.95)" stroke="rgba(233,30,140,0.3)" strokeWidth="1.5"/>
        {/* Center circle */}
        <circle cx={SIZE/2} cy={SIZE/2} r={28}
          fill="rgba(233,30,140,0.15)" stroke="#e91e8c" strokeWidth="1.5"/>
      </svg>

      {/* Segment hover fills */}
      <svg width={SIZE} height={SIZE} className="absolute inset-0" style={{ zIndex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isHov = hovered === item.id;
          const startAngle = item.angle - 22;
          const endAngle   = item.angle + 22;
          const innerR = RADIUS - 29;
          const outerR = RADIUS + 27;

          const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
          const sx1 = SIZE/2 + outerR * Math.cos(toRad(startAngle));
          const sy1 = SIZE/2 + outerR * Math.sin(toRad(startAngle));
          const ex1 = SIZE/2 + outerR * Math.cos(toRad(endAngle));
          const ey1 = SIZE/2 + outerR * Math.sin(toRad(endAngle));
          const sx2 = SIZE/2 + innerR * Math.cos(toRad(endAngle));
          const sy2 = SIZE/2 + innerR * Math.sin(toRad(endAngle));
          const ex2 = SIZE/2 + innerR * Math.cos(toRad(startAngle));
          const ey2 = SIZE/2 + innerR * Math.sin(toRad(startAngle));

          return (
            <path
              key={item.id}
              d={`M ${sx1} ${sy1} A ${outerR} ${outerR} 0 0 1 ${ex1} ${ey1} L ${sx2} ${sy2} A ${innerR} ${innerR} 0 0 0 ${ex2} ${ey2} Z`}
              fill={isHov ? "rgba(233,30,140,0.25)" : "transparent"}
              style={{ transition: "fill 0.15s ease", cursor: "pointer" }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(item.href)}
            />
          );
        })}
      </svg>

      {/* Icons + labels */}
      {NAV_ITEMS.map((item) => {
        const pos   = polarToCartesian(item.angle, RADIUS);
        const isHov = hovered === item.id;
        const isProfile = item.id === "profile";
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.href)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "absolute flex flex-col items-center gap-0.5 transition-all duration-200",
              isHov ? "scale-110" : "scale-100"
            )}
            style={{
              left:      pos.x - 26,
              top:       pos.y - 26,
              width:     52,
              height:    52,
              zIndex:    2,
              transform: `scale(${isHov ? 1.15 : 1})`,
            }}
            aria-label={item.label}
          >
            {/* Icon circle */}
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
              isProfile
                ? "bg-neon-pink text-white shadow-neon-pink"
                : isHov
                  ? "text-neon-pink"
                  : "text-cyber-text"
            )}
            style={isProfile ? { boxShadow: "0 0 12px rgba(233,30,140,0.8)" } : {}}>
              {item.icon}
            </div>
            {/* Label */}
            <span className={cn(
              "font-cyber text-[8px] font-bold tracking-widest uppercase",
              isHov || isProfile ? "text-neon-pink" : "text-cyber-text-dim",
            )}
            style={isHov ? { textShadow: "0 0 6px rgba(233,30,140,0.8)" } : {}}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Center X button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute flex items-center justify-center rounded-full bg-neon-pink/20 border border-neon-pink text-neon-pink hover:bg-neon-pink/40 transition-all duration-200"
        style={{
          left:  SIZE/2 - 20,
          top:   SIZE/2 - 20,
          width: 40, height: 40,
          zIndex: 3,
          boxShadow: "0 0 12px rgba(233,30,140,0.6)",
        }}
        aria-label="Close menu"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  );
}
