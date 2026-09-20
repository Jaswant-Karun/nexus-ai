"use client";

export interface NavBarProps {
  brandName?: string;
  userAvatar?: string;
  userName?: string;
  actions?: any;
}

export function NavBar({
  brandName = "NEXUS AI",
  userName = "Alex Morgan",
  actions,
}: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
          N
        </div>
        <span className="font-extrabold tracking-tight text-white text-lg">{brandName}</span>
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          v0.1.0-alpha
        </span>
      </div>

      <div className="flex items-center gap-4">
        {actions}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
            {userName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-300 hidden md:inline">{userName}</span>
        </div>
      </div>
    </header>
  );
}
