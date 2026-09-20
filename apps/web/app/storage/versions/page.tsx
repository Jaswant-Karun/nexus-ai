"use client";

import { NavBar } from "@nexus/ui";
import { StorageLayout } from "@/components/storage/StorageLayout";
import { FileIcon } from "@/components/storage/FileIcon";
import { formatBytes, MOCK_FILES } from "@/lib/storage";
import { cn } from "@/lib/utils";

const MOCK_VERSIONS = [
  { id: "v3", fileId: "file1", fileName: "Transformer_Architecture.pdf", mimeType: "application/pdf", versionNumber: 3, sizeBytes: 4_200_000, changeNote: "Added appendix on BERT variants", createdBy: "Jaswant Karun", createdAt: "2026-07-29T14:00:00Z", isCurrent: true },
  { id: "v2", fileId: "file1", fileName: "Transformer_Architecture.pdf", mimeType: "application/pdf", versionNumber: 2, sizeBytes: 3_900_000, changeNote: "Revised Section 3 — Attention Mechanism", createdBy: "Jaswant Karun", createdAt: "2026-07-25T10:00:00Z", isCurrent: false },
  { id: "v1", fileId: "file1", fileName: "Transformer_Architecture.pdf", mimeType: "application/pdf", versionNumber: 1, sizeBytes: 3_600_000, changeNote: "Initial upload", createdBy: "Jaswant Karun", createdAt: "2026-07-20T10:00:00Z", isCurrent: false },
  { id: "v5", fileId: "file6", fileName: "Nexus_Pitch_Deck.pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", versionNumber: 5, sizeBytes: 22_000_000, changeNote: "Updated financials and roadmap slide", createdBy: "Jaswant Karun", createdAt: "2026-07-29T10:00:00Z", isCurrent: true },
  { id: "v4", fileId: "file6", fileName: "Nexus_Pitch_Deck.pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", versionNumber: 4, sizeBytes: 21_500_000, changeNote: "Added product demo slides", createdBy: "Jaswant Karun", createdAt: "2026-07-27T14:00:00Z", isCurrent: false },
];

export default function VersionsPage() {
  const grouped = MOCK_VERSIONS.reduce<Record<string, typeof MOCK_VERSIONS>>((acc, v) => {
    (acc[v.fileId] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        <StorageLayout>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Version History</h1>
            <p className="mt-1 text-sm text-dark-300">View, compare, and restore previous versions of your files.</p>
          </div>

          {Object.entries(grouped).map(([fileId, versions]) => {
            const f = MOCK_FILES.find((x) => x.id === fileId)!;
            return (
              <div key={fileId} className="rounded-2xl border border-white/[0.06] bg-dark-900/60 overflow-hidden">
                {/* File header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.06] bg-dark-800/40">
                  <FileIcon mimeType={f.mimeType} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-white">{f.name}</p>
                    <p className="text-xs text-dark-400">{versions.length} versions</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="divide-y divide-white/[0.04]">
                  {versions.map((v, idx) => (
                    <div key={v.id} className="flex items-start gap-5 px-5 py-4">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center pt-1 shrink-0">
                        <div className={cn("h-3 w-3 rounded-full border-2", v.isCurrent ? "bg-brand-500 border-brand-500" : "bg-dark-700 border-dark-500")} />
                        {idx < versions.length - 1 && <div className="w-px flex-1 bg-dark-700 mt-1 h-8" />}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-white">Version {v.versionNumber}</p>
                          {v.isCurrent && (
                            <span className="rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20 px-2 py-0.5 text-[10px] font-bold">CURRENT</span>
                          )}
                        </div>
                        <p className="text-xs text-dark-300">{v.changeNote}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-dark-500">
                          <span>{v.createdBy}</span>
                          <span>·</span>
                          <span>{new Date(v.createdAt).toLocaleString()}</span>
                          <span>·</span>
                          <span>{formatBytes(v.sizeBytes)}</span>
                        </div>
                      </div>
                      {!v.isCurrent && (
                        <button type="button" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors shrink-0">
                          Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </StorageLayout>
      </div>
    </div>
  );
}
