"use client";

/**
 * NEXUS AI — Model Selector
 *
 * A grouped dropdown that shows:
 *
 *   ┌──────────────────────────────┐
 *   │ ⚡ Nexus Auto                 │  ← always at top
 *   ├──────────────────────────────┤
 *   │ Gemini ✓                      │  ← provider header
 *   │   Gemini 2.5 Pro              │
 *   │   Gemini 2.5 Flash            │
 *   ├──────────────────────────────┤
 *   │ OpenAI ✓                      │
 *   │   GPT-5                       │
 *   │   GPT-5 mini                  │
 *   ├──────────────────────────────┤
 *   │ ...                           │
 *   └──────────────────────────────┘
 *
 * Fetches the catalog from /api/models.  Unavailable providers (no API key)
 * are shown but dimmed.
 */

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  available: boolean;
}

interface ProviderGroup {
  id: string;
  name: string;
  available: boolean;
  models: ModelOption[];
}

interface ModelsResponse {
  anyAvailable: boolean;
  providers: ProviderGroup[];
}

const PROVIDER_ICONS: Record<string, string> = {
  gemini: "✦",
  openai: "◎",
  anthropic: "✶",
  grok: "✕",
  deepseek: "◆",
};

export function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderGroup[]>([]);
  const [anyAvailable, setAnyAvailable] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data: ModelsResponse) => {
        setProviders(data.providers);
        setAnyAvailable(data.anyAvailable);
      })
      .catch(() => {});
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Determine display label for the button
  const label =
    value === "auto"
      ? "Nexus Auto"
      : (() => {
          for (const p of providers) {
            const m = p.models.find((m) => m.id === value);
            if (m) return m.name;
          }
          return value;
        })();

  const isAuto = value === "auto";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
          isAuto
            ? "border-brand-500/40 bg-brand-500/10 text-brand-300"
            : "border-white/10 bg-dark-800/80 text-white hover:border-white/20",
        )}
      >
        <span className="text-sm">{isAuto ? "⚡" : "🤖"}</span>
        <span className="max-w-[140px] truncate">{label}</span>
        <svg
          width={10}
          height={10}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-dark-900/95 shadow-2xl backdrop-blur-xl">
          {/* Nexus Auto */}
          <button
            type="button"
            onClick={() => {
              onChange("auto");
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2 px-4 py-3 text-left transition-colors",
              isAuto
                ? "bg-brand-500/15 text-brand-300"
                : "text-white hover:bg-white/5",
            )}
          >
            <span className="text-base">⚡</span>
            <div className="flex-1">
              <p className="text-xs font-bold">Nexus Auto</p>
              <p className="text-[10px] text-dark-400">
                Intelligently routes to the best model
              </p>
            </div>
            {isAuto && (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>

          <div className="h-px bg-white/[0.06]" />

          {/* Provider groups */}
          {providers.map((p) => (
            <div key={p.id}>
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="text-xs">{PROVIDER_ICONS[p.id] ?? "●"}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                  {p.name}
                </span>
                {p.available ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ) : (
                  <span className="text-[9px] text-dark-600">no key</span>
                )}
              </div>

              {p.models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={!m.available}
                  onClick={() => {
                    if (m.available) {
                      onChange(m.id);
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 py-2 pl-8 pr-4 text-left text-xs transition-colors",
                    value === m.id
                      ? "bg-brand-500/10 text-brand-300"
                      : m.available
                        ? "text-dark-100 hover:bg-white/5"
                        : "cursor-not-allowed text-dark-600",
                  )}
                >
                  <span className="flex-1 truncate">{m.name}</span>
                  {value === m.id && (
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))}

              <div className="h-px bg-white/[0.04]" />
            </div>
          ))}

          {!anyAvailable && (
            <div className="px-4 py-3 text-[10px] text-amber-400/80">
              ⚠ No API keys configured. Add keys to <code className="font-mono">.env.local</code>.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
