import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Cyberpunk palette ───────────────────────────── */
        neon: {
          pink:    "#e91e8c",
          "pink-dim": "#b01568",
          "pink-glow": "rgba(233,30,140,0.35)",
          cyan:    "#00ffff",
          "cyan-dim": "#00b3b3",
          yellow:  "#f5e642",
          green:   "#39ff14",
          orange:  "#ff6b00",
          purple:  "#9d00ff",
        },
        cyber: {
          black:   "#080808",
          "black-2": "#0d0d0d",
          "black-3": "#111111",
          "black-4": "#1a1a1a",
          gray:    "#2a2a2a",
          "gray-2": "#3a3a3a",
          "text":  "#cccccc",
          "text-dim": "#888888",
          "text-faint": "#444444",
        },
        /* ── Legacy brand (keep for non-cyber pages) ────── */
        brand: {
          50: "#f0f4ff", 100: "#e0e9ff", 200: "#c7d7fe", 300: "#a5bbfd",
          400: "#8196fa", 500: "#6272f5", 600: "#4f52ea", 700: "#4341cf",
          800: "#3737a7", 900: "#323484", 950: "#1e1d4e",
        },
        dark: {
          50: "#f6f6f7", 100: "#e1e2e6", 200: "#c3c4ce", 300: "#9b9dae",
          400: "#73758d", 500: "#585a72", 600: "#46485d", 700: "#3a3c4d",
          800: "#1a1b27", 900: "#0f0f1a", 950: "#080810",
        },
      },
      fontFamily: {
        cyber:  ["Orbitron", "monospace"],
        mono:   ["Share Tech Mono", "JetBrains Mono", "monospace"],
        sans:   ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        /* Circuit grid pattern */
        "circuit-grid": `
          linear-gradient(rgba(233,30,140,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(233,30,140,0.07) 1px, transparent 1px),
          linear-gradient(rgba(233,30,140,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(233,30,140,0.03) 1px, transparent 1px)
        `,
        "hero-gradient":
          "radial-gradient(ellipse at 50% 0%, rgba(98,114,245,0.25) 0%, rgba(15,15,26,0) 70%)",
        "cyber-glow":
          "radial-gradient(ellipse at center, rgba(233,30,140,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "circuit-grid": "64px 64px, 64px 64px, 16px 16px, 16px 16px",
      },
      boxShadow: {
        "neon-pink":   "0 0 10px rgba(233,30,140,0.8), 0 0 30px rgba(233,30,140,0.4), 0 0 60px rgba(233,30,140,0.15)",
        "neon-pink-sm":"0 0 5px rgba(233,30,140,0.6), 0 0 15px rgba(233,30,140,0.3)",
        "neon-cyan":   "0 0 10px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.4)",
        "neon-green":  "0 0 10px rgba(57,255,20,0.8), 0 0 30px rgba(57,255,20,0.4)",
        "neon-yellow": "0 0 10px rgba(245,230,66,0.8), 0 0 30px rgba(245,230,66,0.4)",
        "cyber-card":  "0 0 0 1px rgba(233,30,140,0.2), 0 4px 24px rgba(0,0,0,0.6)",
        "cyber-card-hover": "0 0 0 1px rgba(233,30,140,0.5), 0 0 20px rgba(233,30,140,0.15), 0 4px 32px rgba(0,0,0,0.7)",
      },
      animation: {
        "pulse-pink":  "pulsePink 2s ease-in-out infinite",
        "flicker":     "flicker 4s linear infinite",
        "scan-line":   "scanLine 3s linear infinite",
        "glitch":      "glitch 3s infinite",
        "float-slow":  "float 8s ease-in-out infinite",
        "spin-slow":   "spin 20s linear infinite",
        "fade-in-up":  "fadeInUp 0.6s ease-out forwards",
        "fade-in":     "fadeIn 0.8s ease-out forwards",
        "draw-circuit":"drawCircuit 2s ease-out forwards",
        particle:      "particle 15s linear infinite",
      },
      keyframes: {
        pulsePink: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(233,30,140,0.6), 0 0 20px rgba(233,30,140,0.3)" },
          "50%":      { boxShadow: "0 0 15px rgba(233,30,140,0.9), 0 0 40px rgba(233,30,140,0.5)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%":      { opacity: "1" },
          "93%":      { opacity: "0.4" },
          "94%":      { opacity: "1" },
          "96%":      { opacity: "0.6" },
          "97%":      { opacity: "1" },
        },
        scanLine: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glitch: {
          "0%, 85%, 100%": { transform: "translate(0)", clipPath: "none" },
          "86%": { transform: "translate(-3px, 1px)", clipPath: "polygon(0 20%, 100% 20%, 100% 40%, 0 40%)" },
          "87%": { transform: "translate(3px, -1px)", clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)" },
          "88%": { transform: "translate(0)", clipPath: "none" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        drawCircuit: {
          "0%":   { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        particle: {
          "0%":   { transform: "translateY(100vh) translateX(0px)", opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "1" },
          "100%": { transform: "translateY(-100px) translateX(100px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
