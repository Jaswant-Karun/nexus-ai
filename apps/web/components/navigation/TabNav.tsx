"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export function TabNav({ tabs, activeTab, onChange, variant = "underline", className }: TabNavProps) {
  if (variant === "pill") {
    return (
      <div className={cn("inline-flex items-center gap-1 rounded-xl bg-dark-800/80 p-1", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
              activeTab === tab.id
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "text-dark-300 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-dark-700 text-dark-300"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center border-b border-white/[0.06]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "text-brand-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-500 after:rounded-full"
              : "text-dark-300 hover:text-white"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              activeTab === tab.id ? "bg-brand-500/15 text-brand-400" : "bg-dark-700 text-dark-400"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
