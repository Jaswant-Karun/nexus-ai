"use client";

export interface NavBarProps {
  brandName?: string;
  userAvatar?: string;
  userName?: string;
  actions?: any;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
}

export function NavBar({
  brandName = "NEXUS AI",
  userName = "Alex Morgan",
  actions,
  showBackButton = true,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  onBack,
}: NavBarProps) {
  const handleBack = (e: React.MouseEvent) => {
    if (onBack) {
      e.preventDefault();
      onBack();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Clickable Brand */}
        <a
          href={backHref}
          onClick={handleBack}
          className="flex items-center gap-3 group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            N
          </div>
          <span className="font-extrabold tracking-tight text-white text-lg">{brandName}</span>
        </a>

        <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hidden sm:inline-block">
          v0.1.0-alpha
        </span>

        {/* Dedicated Back Button */}
        {showBackButton && (
          <a
            href={backHref}
            onClick={handleBack}
            className="ml-3 flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white shadow-md transition-all hover:border-cyan-500/60"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>{backLabel}</span>
          </a>
        )}
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
