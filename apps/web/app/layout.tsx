import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "NEXUS AI — Universal Adaptive Intelligence Platform",
  description: "Build intelligent workflows, AI Agents, automation, and knowledge systems.",
  keywords:    ["AI agents", "workflow automation", "knowledge systems", "memory engine", "LLM platform"],
  openGraph: {
    title:       "NEXUS AI",
    description: "Universal Adaptive Intelligence Platform",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Cyberpunk fonts: Orbitron (headings) + Share Tech Mono (body mono) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-cyber-black text-cyber-text antialiased">
        {children}
      </body>
    </html>
  );
}
