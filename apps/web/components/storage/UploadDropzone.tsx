"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export type UploadDropzoneProps = {
  onFiles: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
};

export function UploadDropzone(props: UploadDropzoneProps): React.JSX.Element {
  const {
    onFiles,
    accept,
    maxSizeMB = 500,
    multiple = true,
    disabled = false,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const validate = useCallback(
    (files: File[]): File[] => {
      setError("");
      const maxBytes = maxSizeMB * 1024 * 1024;
      const validFiles: File[] = [];
      for (const f of files) {
        if (f.size > maxBytes) {
          setError(`"${f.name}" exceeds the ${maxSizeMB} MB limit`);
          continue;
        }
        validFiles.push(f);
      }
      return validFiles;
    },
    [maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const files = validate(Array.from(e.dataTransfer.files));
      if (files.length > 0) {
        onFiles(files);
      }
    },
    [disabled, validate, onFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = validate(Array.from(e.target.files ?? []));
    if (files.length > 0) {
      onFiles(files);
    }
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);
  };

  const handleClick = (): void => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 cursor-pointer transition-all",
          dragging
            ? "border-brand-500 bg-brand-500/10 scale-[1.01]"
            : "border-white/15 bg-dark-900/40 hover:border-brand-500/50 hover:bg-dark-800/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity",
            "bg-gradient-to-b from-brand-500/5 to-transparent",
            dragging && "opacity-100"
          )}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/15 text-4xl mb-5 group-hover:bg-brand-600/25 transition-colors">
          ☁️
        </div>
        <p className="text-base font-semibold text-white">
          {dragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="mt-1.5 text-sm text-dark-300">
          or <span className="text-brand-400 font-medium">browse to choose files</span>
        </p>
        <p className="mt-3 text-xs text-dark-500">
          Max {maxSizeMB} MB per file · {accept ?? "All file types supported"}
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          aria-label="Upload files"
        />
      </div>
      {error !== "" && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
