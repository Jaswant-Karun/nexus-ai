import type { ReactNode } from "react";
import { PrimaryButton, StatusPill } from "@nexus/ui";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <section className="app-shell">
      <aside className="app-shell__rail">
        <div>
          <p className="app-shell__eyebrow">NEXUS AI</p>
          <h2>Command Center</h2>
          <p>Coordinate agents, inspect system health, and ship decisions with a single view.</p>
        </div>

        <div className="app-shell__rail-card">
          <StatusPill tone="success">All cores synced</StatusPill>
          <strong>Routing is green</strong>
          <p>Planner, critic, search, and memory services are aligned to the latest run.</p>
        </div>

        <div className="app-shell__rail-actions">
          <PrimaryButton>Open analytics</PrimaryButton>
          <PrimaryButton variant="ghost">View backlog</PrimaryButton>
        </div>
      </aside>

      <div className="app-shell__content">{children}</div>
    </section>
  );
}
