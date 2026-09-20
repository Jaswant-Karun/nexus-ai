"use client";

import { useState } from "react";
import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/storage";

const MOCK_SHARES = [
  { id: "s1", fileId: "file1", fileName: "Transformer_Architecture.pdf",  mimeType: "application/pdf", sizeBytes: 4_200_000, permission: "view",     isPublic: true,  expiresAt: "2026-08-15T00:00:00Z", downloadLimit: null, downloadCount: 8,  shareUrl: "https://nexus.ai/share/abc123", createdAt: "2026-07-25T10:00:00Z" },
  { id: "s2", fileId: "file6", fileName: "Nexus_Pitch_Deck.pptx",         mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", sizeBytes: 22_000_000, permission: "download", isPublic: false, expiresAt: "2026-07-31T00:00:00Z", downloadLimit: 5, downloadCount: 3, shareUrl: "https://nexus.ai/share/def456", createdAt: "2026-07-27T09:00:00Z" },
  { id: "s3", fileId: "file3", fileName: "System_Architecture.png",       mimeType: "image/png",       sizeBytes: 2_400_000, permission: "view",     isPublic: true,  expiresAt: null,                   downloadLimit: null, downloadCount: 21, shareUrl: "https://nexus.ai/share/ghi789", createdAt: "2026-07-26T14:00:00Z" },
];

const permColor: Record<string, string> = {
  view:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  download: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  edit:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function SharedFilesPage() {
  const [shares, setShares] = useState(MOCK_SHARES);
  const [copied, setCopied] = useState<string | null>(null);

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const revoke = (id: string) => setShares((prev) => prev.filter((s) => s.id !== id));

  const isExpired = (exp?: string | null) => exp ? new Date(exp) < new Date() : false;

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Shared Files</h1>
              <p className="mt-1 text-sm text-dark-300">Manage all your active share links and access permissions.</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Links",   value: shares.filter((s) => !isExpired(s.expiresAt)).length },
              { label: "Total Downloads",value: shares.reduce((a, s) => a + s.downloadCount, 0) },
              { label: "Public Links",   value: shares.filter((s) => s.isPublic).length },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4 text-center">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Shares table */}
          <div className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_100px_100px_auto] items-center gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-dark-400">
              <span className="w-8" />
              <span>File</span>
              <span>Permission</span>
              <span>Downloads</span>
              <span>Actions</span>
            </div>
            {shares.map((s) => {
              const expired = isExpired(s.expiresAt);
              return (
                <div key={s.id} className={cn("grid grid-cols-[auto_1fr_100px_100px_auto] items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 transition-colors", expired && "opacity-50")}>
                  <FileIcon mimeType={s.mimeType} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.fileName}</p>
                    <p className="text-xs text-dark-400 mt-0.5 font-mono truncate">{s.shareUrl}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-dark-500">
                      <span>{s.isPublic ? "🌐 Public" : "🔒 Private"}</span>
                      {s.expiresAt && <span>· Expires {new Date(s.expiresAt).toLocaleDateString()}</span>}
                      {s.downloadLimit && <span>· Limit {s.downloadLimit}</span>}
                    </div>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize w-fit", permColor[s.permission])}>
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
            })}
          </div>
        </StorageLayout>
      </div>
    </div>
  );
}
