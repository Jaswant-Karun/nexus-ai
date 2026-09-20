"use client";

import { Polyhedron } from "./Polyhedron";
import { cn } from "@/lib/utils";

interface UserCardProps {
  name:       string;
  userId:     string;
  level?:     string;
  rank?:      string;
  plan?:      string;
  email?:     string;
  className?: string;
}

export function UserCard({
  name,
  userId,
  level = "LEVEL 2",
  rank  = "PRISM",
  plan  = "Paid",
  email,
  className,
}: UserCardProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "cyber-card cyber-corners relative overflow-hidden p-5 w-64 flex-shrink-0 flex flex-col gap-3",
        className
      )}
    >
      {/* Avatar + name */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-cyber font-black text-base text-white"
          style={{
            background: "rgba(233,30,140,0.18)",
            border:     "2px solid #e91e8c",
            boxShadow:  "0 0 14px rgba(233,30,140,0.5)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-cyber text-sm font-bold tracking-widest uppercase text-white leading-tight">
            {name}
          </p>
          <p className="font-mono text-[10px] text-neon-pink/80 mt-0.5 tracking-wider">
            ID: {userId}
          </p>
          <span
            className="mt-1.5 inline-flex items-center gap-1 font-cyber text-[9px] font-bold tracking-widest uppercase px-2 py-0.5"
            style={{
              background: "rgba(57,255,20,0.1)",
              border:     "1px solid rgba(57,255,20,0.35)",
              color:      "#39ff14",
              textShadow: "0 0 6px rgba(57,255,20,0.6)",
            }}
          >
            <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
            Verified
          </span>
        </div>
      </div>

      {/* Plan tag + email */}
      <div>
        <span
          className="font-cyber text-[9px] font-bold tracking-widest uppercase px-2 py-0.5"
          style={{
            background: "rgba(233,30,140,0.08)",
            border:     "1px solid rgba(233,30,140,0.35)",
            color:      "#e91e8c",
          }}
        >
          + {plan}
        </span>
        {email && (
          <p className="font-mono text-[9px] text-cyber-text-dim mt-1.5 truncate">
            {email}
          </p>
        )}
      </div>

      {/* Neon separator */}
      <div className="neon-line" />

      {/* Status */}
      <div>
        <p className="font-cyber text-[9px] font-bold tracking-widest uppercase text-cyber-text-dim mb-1">
          STATUS:
        </p>
        <span className="status-online">ONLINE</span>
      </div>

      <p className="font-cyber text-[9px] tracking-widest text-cyber-text-dim">
        {level} {"//"} {rank}
      </p>

      {/* Polyhedron */}
      <div className="flex justify-center pt-2">
        <Polyhedron size={120} />
      </div>
    </div>
  );
}
