"use client";

/**
 * AppShell — persistent layout wrapper.
 *
 * Wraps every authenticated page so the Navbar + Sidebar are mounted ONCE
 * and stay alive across client-side navigations (no full re-mount = no flicker).
 *
 * Usage:
 *   <AppShell activeNav="chat">
 *     <YourPageContent />
 *   </AppShell>
 */

import { AppNavbar }  from "@/components/layout/AppNavbar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

interface AppShellProps {
  children:   React.ReactNode;
  activeNav?: string;
  /** If true the sidebar is hidden (e.g. full-screen canvas pages) */
  hideSidebar?: boolean;
}

export function AppShell({ children, activeNav, hideSidebar = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <AppNavbar brandName="NEXUS AI" />
      <div className="flex flex-1 overflow-hidden">
        {!hideSidebar && <AppSidebar activeNav={activeNav} />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
