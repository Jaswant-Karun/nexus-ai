"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` when the viewport matches the given CSS media query.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isDark   = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Convenience breakpoint hooks
export const useIsMobile  = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet  = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
