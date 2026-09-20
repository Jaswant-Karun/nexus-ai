"use client";

import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { cn } from "@/lib/utils";

const LOGS = [
  { id: "l1", action: "download", fileName: "Transformer_Architecture.pdf", user: "Jaswant Karun", ip: "49.36.x.x", userAgent: "Chrome/124 Windows", createdAt: "2026-07-30T08:32:00Z" },
  { id: "l2", action: "view",     fileName: "System_Architecture.png",      user: "Jaswant Karun", ip: "49.36.x.x", userAgent: "Chrome/124 Windows", createdAt: "2026-07-30T08:20:00Z" },
  { id: "l3", action: "share",    fileName: "Nexus_Pitch_Deck.pptx",        user: "Jaswant Karun", ip: "49.36.x.x", userAgent: "Chrome/124 Windows", createdAt: "2026-07-29T18:00:00Z" },
  { id: "l4", action: "delete",   fileName: "old_report_draft.docx",        user: "Jaswant Karun", ip: "49.36.x.x", userAgent: "Chrome/124 Windows", createdAt: "2026-07-28T12:00:00Z" },
  { id: "l5", action: "download", fileName: "Nexus_Pitch_Deck.pptx",        user: "External User", ip: "203.x.x.x", userAgent: "Safari/17 macOS",    createdAt: "2026-07-28T10:15:00Z" },
  { id: "l6", action: "view",     fileName: "System_Architecture.png",      user: "External User", ip: "185.x.x.x", userAgent: "Firefox/125 Linux",   createdAt: "2026-07-27T16:40:00Z" },
];

const ACTION_BADGE: Record<string, string> = {
  view:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  download: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  share:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  delete:   "bg-red-500/10 text-red-400 border-red-500/20",
  restore:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Security Center</h1>
            <p className="mt-1 text-sm text-dark-300">Access logs, encryption status, permissions, and compliance controls.</p>
          </div>

          {/* Security score */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Security Score",  value: "A+",   icon: "🔐", ok: true },
              { label: "Encrypted Files", value: "482",  icon: "🔒", ok: true },
              { label: "Infected Files",  value: "0",    icon: "🛡️", ok: true },
              { label: "Failed Scans",    value: "1",    icon: "⚠️", ok: false },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-2xl border p-5", s.ok ? "border-white/[0.06] bg-dark-900/60" : "border-amber-500/20 bg-amber-500/5")}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className={cn("text-2xl font-extrabold", s.ok ? "text-white" : "text-amber-400")}>{s.value}</p>
                <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Encryption / compliance */}
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
                  <span className={cn("text-lg", c.status ? "text-emerald-400" : "text-dark-500")}>{c.status ? "✓" : "○"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-dark-400">{c.desc}</p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    c.status ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-dark-700/60 text-dark-400 border-dark-600")}>
                    {c.status ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Access log */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Access Log</h2>
              <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Export CSV</button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {LOGS.map((log) => (
                <div key={log.id} className="grid grid-cols-[100px_1fr_140px_120px_160px] items-center gap-4 px-5 py-3 text-xs hover:bg-dark-800/30 transition-colors">
                  <span className={cn("rounded-full border px-2.5 py-0.5 font-semibold capitalize w-fit", ACTION_BADGE[log.action] ?? "bg-dark-700 text-dark-300")}>
                    {log.action}
                  </span>
                  <span className="text-dark-100 truncate">{log.fileName}</span>
                  <span className="text-dark-300 truncate">{log.user}</span>
                  <span className="text-dark-400 font-mono">{log.ip}</span>
                  <span className="text-dark-500">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
