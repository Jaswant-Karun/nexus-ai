import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus AI — Universal Adaptive Intelligence Platform",
  description:
    "Build intelligent workflows, AI Agents, automation, and knowledge systems — all in one platform.",
  keywords: [
    "AI agents",
    "workflow automation",
    "knowledge systems",
    "memory engine",
    "LLM platform",
  ],
  openGraph: {
    title: "Nexus AI",
    description: "Universal Adaptive Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
