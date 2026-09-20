import { AppShell } from "../components/common/AppShell";
import { InsightCard, PrimaryButton, StatCard, StatusPill } from "@nexus/ui";

const metrics = [
  { label: "Active workflows", value: "24", detail: "+18% week over week" },
  { label: "Agents online", value: "08", detail: "Planner, critic, search, and memory" },
  { label: "Knowledge sync", value: "99.2%", detail: "Vector and graph stores aligned" },
  { label: "Response latency", value: "142 ms", detail: "Median service response across the mesh" },
];

const initiatives = [
  {
    title: "Workflow orchestration",
    description: "Coordinate research, validation, and delivery across a staged execution path with explicit ownership.",
    accent: "Cohort routing",
  },
  {
    title: "Knowledge operations",
    description: "Ingest, normalize, and score platform signals before they reach the planning layer.",
    accent: "Freshness policy",
  },
  {
    title: "Decision analytics",
    description: "Surface leading indicators, completion risk, and service health in one command surface.",
    accent: "Risk watch",
  },
];

const activity = [
  "Planner selected a multi-step route for the current initiative.",
  "Validator confirmed schema integrity across API and AI services.",
  "Search and memory layers were synchronized to the latest index.",
];

export default function HomePage() {
  return (
    <AppShell>
      <main className="dashboard">
        <section className="hero">
          <div className="hero__copy">
            <StatusPill tone="success">Platform stable</StatusPill>
            <h1>Command the agent mesh from one focused operating surface.</h1>
            <p>
              NEXUS AI brings orchestration, search, validation, and reporting into a single dashboard designed for fast decisions and
              clear handoffs.
            </p>
            <div className="hero__actions">
              <PrimaryButton>Launch workflow</PrimaryButton>
              <PrimaryButton variant="ghost">Review health</PrimaryButton>
            </div>
          </div>
          <div className="hero__panel">
            <p className="hero__panel-label">Execution pulse</p>
            <strong>Planning, validation, and publishing are in sync.</strong>
            <ul>
              {activity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <div>
              <p className="section__eyebrow">Operational snapshot</p>
              <h2>Live system metrics</h2>
            </div>
            <StatusPill tone="warning">2 services warming up</StatusPill>
          </div>
          <div className="metric-grid">
            {metrics.map((metric) => (
              <StatCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <div>
              <p className="section__eyebrow">Design system</p>
              <h2>Reusable cards for the dashboard</h2>
            </div>
          </div>
          <div className="insight-grid">
            {initiatives.map((initiative) => (
              <InsightCard
                key={initiative.title}
                title={initiative.title}
                description={initiative.description}
                accent={initiative.accent}
              />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
