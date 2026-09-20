"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatBytes, MOCK_FOLDERS, buildFolderTree } from "@/lib/storage";
import type { FolderTreeNode } from "@/types/storage";

const USED_BYTES  = 42_400_000_000;
const QUOTA_BYTES = 50_000_000_000;

interface SidebarSection {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

function HomeIcon()    { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function UploadIcon()  { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function FolderIcon()  { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function ShareIcon()   { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>; }
function ClockIcon()   { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function StarIcon()    { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function TrashIcon()   { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>; }
function BotIcon()     { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>; }
function SearchIcon()  { return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
function SettingsIcon(){ return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }

const TOP_NAV: SidebarSection[] = [
  { id: "overview",  label: "Dashboard",       href: "/storage",          icon: <HomeIcon /> },
  { id: "upload",    label: "Upload",           href: "/storage/upload",   icon: <UploadIcon /> },
  { id: "files",     label: "My Files",         href: "/storage/files",    icon: <FolderIcon /> },
  { id: "shared",    label: "Shared with me",   href: "/storage/shared",   icon: <ShareIcon /> },
  { id: "recent",    label: "Recent",           href: "/storage/files",    icon: <ClockIcon /> },
  { id: "starred",   label: "Starred",          href: "/storage/files?starred=true", icon: <StarIcon /> },
  { id: "trash",     label: "Trash",            href: "/storage/trash",    icon: <TrashIcon /> },
];

const AI_NAV: SidebarSection[] = [
  { id: "ai",        label: "AI Analyzer",      href: "/storage/ai",       icon: <BotIcon /> },
  { id: "search",    label: "Smart Search",     href: "/storage/search",   icon: <SearchIcon /> },
  { id: "settings",  label: "Settings",         href: "/storage/settings", icon: <SettingsIcon /> },
];

function FolderTree({ nodes, depth = 0 }: { nodes: FolderTreeNode[]; depth?: number }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  return (
    <>
      {nodes.map((node) => {
        const isActive = pathname.includes(`folder=${node.id}`);
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded.has(node.id);
        return (
          <div key={node.id}>
            <div className="flex items-center group">
              {hasChildren && (
                <button type="button" onClick={() => setExpanded((s) => { const n = new Set(s); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; })}
                  className="ml-1 mr-0.5 h-4 w-4 flex items-center justify-center text-dark-500 hover:text-white transition-colors shrink-0">
                  <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    {isExpanded ? <path d="m6 9 6 6 6-6"/> : <path d="m9 18 6-6-6-6"/>}
                  </svg>
                </button>
              )}
              <Link href={`/storage/files?folder=${node.id}`}
                style={{ paddingLeft: depth * 12 + (hasChildren ? 0 : 20) }}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-lg py-1.5 pr-3 text-xs transition-colors min-w-0",
                  isActive ? "bg-brand-600/15 text-brand-400" : "text-dark-300 hover:bg-white/5 hover:text-white"
                )}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill={node.color ?? "#6272f5"} fillOpacity={0.8} stroke="none">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span className="truncate">{node.name}</span>
              </Link>
            </div>
            {isExpanded && hasChildren && (
              <FolderTree nodes={node.children} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </>
  );
}

export function StorageSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const folderTree = buildFolderTree(MOCK_FOLDERS);
  const usedPct = (USED_BYTES / QUOTA_BYTES) * 100;

  const isActive = (href: string) => {
    if (href === "/storage") return pathname === "/storage";
    const base = href.split("?")[0];
    return pathname === base;
  };

  return (
    <aside className={cn(
      "flex flex-col w-60 shrink-0 h-full border-r border-white/[0.06] bg-dark-900/80 backdrop-blur-sm overflow-y-auto",
      className
    )}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">NexusStorage</p>
            <p className="text-[10px] text-dark-400 mt-0.5">Smart File Management</p>
          </div>
        </div>
        <Link href="/storage/upload"
          className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-brand-600/25">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4-4 4 4"/>
          </svg>
          Create New
        </Link>
      </div>

      {/* Main nav */}
      <nav className="px-3 py-3 space-y-0.5">
        {TOP_NAV.map((item) => (
          <Link key={item.id} href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-brand-600/15 text-brand-400"
                : "text-dark-300 hover:bg-white/[0.06] hover:text-white"
            )}>
            <span className={cn("shrink-0", isActive(item.href) ? "text-brand-400" : "text-dark-400")}>
              {item.icon}
            </span>
            {item.label}
            {item.badge !== undefined && (
              <span className="ml-auto rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Folders tree */}
      <div className="px-3 pb-2">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-dark-500">My Files</p>
        <div className="space-y-0.5">
          <FolderTree nodes={folderTree} />
        </div>
      </div>

      {/* AI & bottom nav */}
      <div className="px-3 pt-3 border-t border-white/[0.06] space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-dark-500">AI Tools</p>
        {AI_NAV.map((item) => (
          <Link key={item.id} href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              isActive(item.href) ? "bg-brand-600/15 text-brand-400" : "text-dark-300 hover:bg-white/[0.06] hover:text-white"
            )}>
            <span className={cn("shrink-0", isActive(item.href) ? "text-brand-400" : "text-dark-400")}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Storage gauge */}
      <div className="mx-3 mt-auto mb-4 pt-4">
        <div className="rounded-2xl border border-white/[0.06] bg-dark-800/60 p-4">
          {/* Gauge ring */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-14 w-14 shrink-0">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
                <circle cx="28" cy="28" r="22" fill="none"
                  stroke="url(#storageGrad)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 22}`}
                  strokeDashoffset={`${2 * Math.PI * 22 * (1 - usedPct / 100)}`}/>
                <defs>
                  <linearGradient id="storageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6272f5"/>
                    <stop offset="50%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#ef4444"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold text-white">{usedPct.toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{formatBytes(USED_BYTES)}</p>
              <p className="text-[10px] text-dark-400">of {formatBytes(QUOTA_BYTES)} capacity</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { label: "Videos",    size: "16.2 GB", color: "bg-red-500" },
              { label: "Photos",    size: "12.1 GB", color: "bg-emerald-500" },
              { label: "Documents", size: "9 GB",    color: "bg-blue-500" },
              { label: "Other",     size: "5.1 GB",  color: "bg-amber-500" },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-dark-300">
                  <span className={cn("h-2 w-2 rounded-full", c.color)} />
                  {c.label}
                </span>
                <span className="font-semibold text-white">{c.size}</span>
              </div>
            ))}
          </div>
          <button type="button" className="mt-3 w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-2 text-xs font-semibold text-white transition-colors">
            Upgrade to PRO
          </button>
        </div>
      </div>
    </aside>
  );
}
