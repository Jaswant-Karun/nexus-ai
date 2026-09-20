import { AdminSection } from "@/components/AdminSection";

export default function MonitoringPage() {
  return <AdminSection eyebrow="Observability" title="Monitoring" description="Monitor service health, latency, and workflow failure signals." rows={[{ label: "API availability", value: "99.98%", status: "Healthy" }, { label: "Median AI latency", value: "842 ms" }, { label: "Workflow failures", value: "2.2%", status: "Within threshold" }]} />;
}
