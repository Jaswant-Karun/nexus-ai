"use client";

import type { ReactNode } from "react";
import Link from "next/link";

const NAVIGATION = [
  ["Dashboard", "/dashboard"],
  ["Users", "/users"],
  ["Organizations", "/organizations"],
  ["Agents", "/agents"],
  ["AI Models", "/ai-models"],
  ["Analytics", "/analytics"],
  ["Logs", "/logs"],
  ["Security", "/security"],
  ["Settings", "/settings"],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090b12] text-slate-100 lg:flex">
      <aside className="border-b border-white/10 bg-[#0d101a] p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <Link href="/dashboard" className="block text-lg font-black tracking-tight text-white">NEXUS <span className="text-cyan-400">ADMIN</span></Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Operations console</p>
        <nav className="mt-8 grid grid-cols-2 gap-1 lg:block lg:space-y-1">
          {NAVIGATION.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white">{label}</Link>)}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
