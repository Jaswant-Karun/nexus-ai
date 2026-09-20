import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Nexus AI",
  description: "Secure sign-in to Nexus AI Enterprise Platform",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-950">
      {children}
    </div>
  );
}
