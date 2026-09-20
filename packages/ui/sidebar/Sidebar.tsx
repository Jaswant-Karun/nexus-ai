"use client";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: any;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
}

export function Sidebar({ items, currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-[calc(100vh-57px)] bg-gray-950 border-r border-gray-800 p-4 flex flex-col justify-between shrink-0">
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = item.active || currentPath === item.href;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.href)}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/60"
              }`}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-xs text-gray-400">
        <p className="font-semibold text-gray-300">Nexus Platform Engine</p>
        <p className="mt-1 text-gray-500">Connected to local cluster</p>
      </div>
    </aside>
  );
}
