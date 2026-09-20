"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ChatInput({
  onSend,
  placeholder = "Ask Nexus AI anything…",
  disabled = false,
  loading = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled && !loading;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div
      className={cn(
        "flex items-end gap-3 rounded-2xl border border-white/10 bg-dark-800/80 px-4 py-3 focus-within:border-brand-500/50 focus-within:ring-1 focus-within:ring-brand-500/20 transition",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-dark-400 focus:outline-none min-h-[24px] max-h-40"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all",
          canSend
            ? "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/30"
            : "bg-dark-700 text-dark-500 cursor-not-allowed"
        )}
      >
        {loading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        )}
      </button>
    </div>
  );
}
