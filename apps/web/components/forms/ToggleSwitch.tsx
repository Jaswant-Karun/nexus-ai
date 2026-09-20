"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = "md",
  className,
}: ToggleSwitchProps) {
  const trackSize = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumbSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const thumbTranslate = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-dark-300 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-dark-900",
          "disabled:cursor-not-allowed disabled:opacity-50",
          trackSize,
          checked ? "bg-brand-500" : "bg-dark-600"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-md transition-transform duration-200",
            thumbSize,
            checked ? thumbTranslate : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
