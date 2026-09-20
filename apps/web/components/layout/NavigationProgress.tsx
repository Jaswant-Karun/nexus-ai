"use client";

/**
 * Thin top progress bar that shows on page navigation.
 * Appears instantly when a link is clicked — gives users
 * immediate visual feedback that something is happening.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProgressBar() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [progress,   setProgress]   = useState(0);
  const [visible,    setVisible]    = useState(false);
  const prevPath     = useRef(pathname + searchParams.toString());
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    if (currentPath !== prevPath.current) {
      // New navigation — shoot the bar to ~80% then complete
      setVisible(true);
      setProgress(15);
      const t1 = setTimeout(() => setProgress(50),  80);
      const t2 = setTimeout(() => setProgress(80),  200);
      const t3 = setTimeout(() => {
        setProgress(100);
        const t4 = setTimeout(() => setVisible(false), 300);
        timerRef.current = t4;
      }, 350);
      timerRef.current = t3;
      prevPath.current = currentPath;
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
      style={{
        background: "linear-gradient(90deg, #6272f5, #a855f7)",
        width:     `${progress}%`,
        transition: progress === 100 ? "width 0.1s ease, opacity 0.3s ease" : "width 0.4s ease",
        boxShadow:  "0 0 8px rgba(98,114,245,0.8)",
      }}
    />
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
