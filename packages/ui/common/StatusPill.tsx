"use client";

type StatusPillProps = {
  children: any;
  tone?: "success" | "warning" | "neutral";
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>;
}