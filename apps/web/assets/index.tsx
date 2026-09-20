/** ─── Brand assets & constants ─────────────────────────────────────────────── */

export const BRAND = {
  name:      "NEXUS AI",
  tagline:   "Universal Adaptive Intelligence Platform",
  url:       "https://nexus.ai",
  logoColor: "#6272f5",
  accent:    "#a855f7",
} as const;

/**
 * Inline SVG string for the Nexus AI logo (the ⚡ zap bolt icon).
 * Use `dangerouslySetInnerHTML` or an SVG component when rendering.
 */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#6272f5"/>
  <polygon points="19,4 9,18 16,18 13,28 23,14 16,14" fill="white"/>
</svg>`;

/** React component version — zero external dependencies */
export function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#6272f5" />
      <polygon points="19,4 9,18 16,18 13,28 23,14 16,14" fill="white" />
    </svg>
  );
}

/** Favicon / OG image paths (relative to /public) */
export const ASSET_PATHS = {
  favicon:    "/favicon.ico",
  appleTouchIcon: "/apple-touch-icon.png",
  ogImage:    "/og-image.png",
  logo:       "/logo.svg",
} as const;

/** Brand gradient strings (for inline styles) */
export const GRADIENTS = {
  brand:   "linear-gradient(135deg, #6272f5 0%, #a855f7 100%)",
  hero:    "radial-gradient(ellipse at 50% 0%, rgba(98,114,245,0.25) 0%, rgba(8,8,16,0) 70%)",
  card:    "linear-gradient(135deg, rgba(98,114,245,0.08) 0%, rgba(168,85,247,0.04) 100%)",
  overlay: "linear-gradient(180deg, transparent 0%, rgba(8,8,16,0.9) 100%)",
} as const;

/** Social links */
export const SOCIAL = {
  twitter:  "https://twitter.com/nexusai",
  github:   "https://github.com/nexus-ai",
  linkedin: "https://linkedin.com/company/nexus-ai",
} as const;
