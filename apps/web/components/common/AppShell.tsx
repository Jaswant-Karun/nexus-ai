import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <section className="app-shell">
      <aside className="app-shell__rail">
        <div>
          <p className="app-shell__eyebrow">NEXUS AI</p>
          <h2>Command Center</h2>
          <p>
            Coordinate agents, inspect system health, and ship decisions with a single view.
          </p>
        </div>

        <div className="app-shell__rail-card">
          <span className="text-emerald-400 text-sm">All cores synced</span>
          <strong>Routing is green</strong>
          <p>
            Planner, critic, search, and memory services are aligned to the latest run.
          </p>
        </div>

        <div className="app-shell__rail-actions">
          <button type="button">Open analytics</button>
          <button type="button">View backlog</button>
        </div>
      </aside>

      <div className="app-shell__content">{children}</div>
    </section>
  );
}
