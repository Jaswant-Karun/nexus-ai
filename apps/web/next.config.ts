import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ── Packages to transpile ──────────────────────────────────────────────────
  transpilePackages: ["lucide-react", "@nexus/ui"],

  // ── Compiler optimisations ─────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production (keeps warnings/errors)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Image domains ──────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ── Bundle analysis & size reduction ──────────────────────────────────────
  experimental: {
    // Optimise package imports — prevents importing entire icon library
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@nexus/ui",
    ],
    // Faster server startup by pre-bundling
    serverComponentsExternalPackages: ["pg", "@prisma/adapter-pg"],
  },

  // ── HTTP headers — aggressive caching for static assets ───────────────────
  async headers() {
    return [
      {
        // Cache _next/static forever (they're content-hashed)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache public folder assets for 7 days
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        // API routes — no cache by default (override per-route as needed)
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy /auth/* → /login etc.
      { source: "/auth/login",    destination: "/login",          permanent: true },
      { source: "/auth/register", destination: "/register",       permanent: true },
      { source: "/auth/logout",   destination: "/api/auth/logout", permanent: false },
    ];
  },
};

export default nextConfig;
