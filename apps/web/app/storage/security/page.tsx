"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { cn } from "@/lib/utils";

interface Log {
  id: string; action: string; fileName: string; user: string;
  ipAddress: string; createdAt: string;
}
interface SecuritySummary {
  totalFiles: number; encryptedFiles: number; infectedFiles: number; failedScans: number;
}
interface SecurityData { summary: SecuritySummary; logs: Log[]; }

const ACTION_BADGE: Record<string, string> = {
  view:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  download: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  share:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  delete:   "bg-red-500/10 text-red-400 border-red-500/20",
  restore:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function SecurityPage() {
  const [data,    setData]    = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/storage/security")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: SecurityData }) => {
        if (d.success && d.data) setData(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = data?.summary;

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Security Center</h1>
            <p className="mt-1 text-sm text-dark-300">Live access logs, encryption status, and compliance controls.</p>
          </div>

          {/* KPI cards — real data */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-5 h-20 animate-pulse" />
              ))}
            </div>
          ) : s && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: "Security Score",  value: s.infectedFiles === 0 ? "A+" : "B", icon: "🔐", ok: s.infectedFiles === 0 },
                { label: "Encrypted Files", value: s.encryptedFiles, icon: "🔒", ok: true },
                { label: "Infected Files",  value: s.infectedFiles,  icon: "🛡️", ok: s.infectedFiles === 0 },
                { label: "Pending Scans",   value: s.failedScans,    icon: "⚠️", ok: s.failedScans === 0 },
              ].map((stat) => (
                <div key={stat.label} className={cn("rounded-2xl border p-5",
                  stat.ok ? "border-white/[0.06] bg-dark-900/60" : "border-amber-500/20 bg-amber-500/5")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className={cn("text-2xl font-extrabold", stat.ok ? "text-white" : "text-amber-400")}>{stat.value}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Security controls (static — platform configuration, not DB-driven) */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Security Controls</h2>
            <div className="space-y-3">
              {[
                { label: "AES-256 Encryption at Rest",   status: true,  desc: "All files encrypted before storage" },
                { label: "TLS 1.3 in Transit",           status: true,  desc: "All uploads/downloads encrypted in transit" },
                { label: "Virus Scan on Upload",         status: true,  desc: "ClamAV scans every uploaded file" },
                { label: "SHA-256 Checksum Validation",  status: true,  desc: "File integrity verified on every access" },
                { label: "Access Log Retention (90d)",   status: true,  desc: "Full audit trail kept for 90 days" },
                { label: "IP Allowlisting",              status: false, desc: "Configure IP restrictions in settings" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
                  <span className={cn("text-lg", c.status ? "text-emerald-400" : "text-dark-500")}>
                    {c.status ? "✓" : "○"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-dark-400">{c.desc}</p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    c.status ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-dark-700/60 text-dark-400 border-dark-600")}>
                    {c.status ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Access log — real data from DB */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">
                Access Log {data ? `(${data.logs.length} entries)` : ""}
              </h2>
            </div>
            {loading ? (
              <div className="p-5 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-dark-800/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !data?.logs.length ? (
              <div className="px-5 py-8 text-center text-dark-400 text-sm">
                No access logs yet. Logs appear when files are viewed, downloaded, shared, or deleted.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {data.logs.map((log) => (
                  <div key={log.id}
                    className="grid grid-cols-[100px_1fr_140px_120px_160px] items-center gap-4 px-5 py-3 text-xs hover:bg-dark-800/30 transition-colors">
                    <span className={cn("rounded-full border px-2.5 py-0.5 font-semibold capitalize w-fit",
                      ACTION_BADGE[log.action] ?? "bg-dark-700 text-dark-300")}>
                      {log.action}
                    </span>
                    <span className="text-dark-100 truncate">{log.fileName}</span>
                    <span className="text-dark-300 truncate">{log.user}</span>
                    <span className="text-dark-400 font-mono">{log.ipAddress}</span>
                    <span className="text-dark-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
