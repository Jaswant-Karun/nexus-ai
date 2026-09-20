"use client";

import { Modal } from "./Modal";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  loading?: boolean;
}

const variantStyles = {
  danger:  "bg-red-600 hover:bg-red-500 focus:ring-red-500/40 shadow-red-600/25",
  warning: "bg-amber-600 hover:bg-amber-500 focus:ring-amber-500/40 shadow-amber-600/25",
  default: "bg-brand-600 hover:bg-brand-500 focus:ring-brand-500/40 shadow-brand-600/25",
};

const variantIcons = {
  danger:  "🗑️",
  warning: "⚠️",
  default: "✔️",
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-800 text-2xl">
          {variantIcons[variant]}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {description && <p className="mt-1.5 text-sm text-dark-300">{description}</p>}
        </div>
        <div className="flex w-full gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 transition-all disabled:opacity-50",
              variantStyles[variant]
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing…
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
