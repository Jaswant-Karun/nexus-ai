import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "NEXUS AI | Command Center",
  description: "Adaptive intelligence dashboard for coordinating agents, workflows, and insight delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
