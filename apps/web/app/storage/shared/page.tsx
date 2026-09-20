"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { cn } from "@/lib/utils";

interface ShareItem {
  id: string; fileId: string; fileName: string; mimeType?: string;
  token: string; shareUrl: string; permission: string; isPublic: boolean;
  expiresAt?: string; downloadLimit?: number; downloadCount: number; createdAt: string;
}

const permColor: Record<string, string> = {
  view:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  download: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  edit:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function isExpired(exp?: string) { return exp ? new Date(exp) < new Date() : false; }

export default function SharedFilesPage() {
  const [shares,  setShares]  = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/storage/share")
      .then((r) => r.json())
      .then((d: { success: boolean; data?: ShareItem[] }) => {
        if (d.success && d.data) setShares(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revoke = async (id: string) => {
    await fetch("/api/storage/share", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    }).catch(() => {});
    setShares((prev) => prev.filter((s) => s.id !== id));
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  };

  const activeCount   = shares.filter((s) => !isExpired(s.expiresAt)).length;
  const totalDownloads = shares.reduce((a, s) => a + s.downloadCount, 0);
  const publicCount   = shares.filter((s) => s.isPublic).length;

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Shared Files</h1>
              <p className="mt-1 text-sm text-dark-300">Manage your active share links and access permissions.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Links",    value: loading ? "…" : activeCount },
              { label: "Total Downloads", value: loading ? "…" : totalDownloads },
              { label: "Public Links",    value: loading ? "…" : publicCount },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 text-center">
                <p className={cn("text-2xl font-extrabold text-white", loading && "animate-pulse")}>{s.value}</p>
                <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Shares table */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_100px_100px_auto] items-center gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-dark-400">
              <span className="w-8" /><span>File</span><span>Permission</span><span>Downloads</span><span>Actions</span>
            </div>
            {loading ? (
              <div className="p-5 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-dark-800/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : shares.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-dark-400 text-sm">No shared files yet.</p>
                <p className="text-dark-600 text-xs mt-1">Share links appear here when you share a file from the File Manager.</p>
              </div>
            ) : (
              shares.map((s) => {
                const expired = isExpired(s.expiresAt);
                return (
                  <div key={s.id}
                    className={cn("grid grid-cols-[auto_1fr_100px_100px_auto] items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 transition-colors",
                      expired ? "opacity-50" : "hover:bg-dark-800/30")}>
                    <FileIcon mimeType={s.mimeType ?? "application/octet-stream"} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{s.fileName}</p>
                      <p className="text-xs text-dark-400 mt-0.5 font-mono truncate">{s.shareUrl}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-dark-500">
                        <span>{s.isPublic ? "🌐 Public" : "🔒 Private"}</span>
                        {s.expiresAt && <span>· Expires {new Date(s.expiresAt).toLocaleDateString()}</span>}
                        {s.downloadLimit && <span>· Limit {s.downloadLimit}</span>}
                      </div>
                    </div>
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize w-fit",
                      permColor[s.permission] ?? "bg-dark-700 text-dark-300 border-dark-600")}>
                      {s.permission}
                    </span>
                    <span className="text-sm text-dark-200">{s.downloadCount}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => copyLink(s.shareUrl, s.id)}
                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors">
                        {copied === s.id ? "✓ Copied" : "Copy"}
                      </button>
                      <button type="button" onClick={() => revoke(s.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors">
                        Revoke
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
