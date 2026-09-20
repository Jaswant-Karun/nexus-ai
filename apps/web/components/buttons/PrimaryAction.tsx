import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface PrimaryActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function PrimaryAction({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: PrimaryActionProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:ring-brand-500",
    secondary:
      "border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0 focus:ring-white/20",
    ghost:
      "text-dark-300 hover:text-white hover:bg-white/5 focus:ring-white/10",
    danger:
      "bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 hover:-translate-y-0.5 active:translate-y-0 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
