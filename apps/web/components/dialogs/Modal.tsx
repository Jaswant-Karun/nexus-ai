"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm:  "max-w-sm",
  md:  "max-w-md",
  lg:  "max-w-lg",
  xl:  "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "relative w-full rounded-2xl border border-white/[0.08] bg-dark-900/95 shadow-2xl shadow-black/50 flex flex-col",
          sizeMap[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              {title && <h2 id="modal-title" className="text-base font-semibold text-white">{title}</h2>}
              {description && <p className="mt-1 text-sm text-dark-300">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 flex h-7 w-7 items-center justify-center rounded-lg text-dark-400 hover:bg-white/5 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
