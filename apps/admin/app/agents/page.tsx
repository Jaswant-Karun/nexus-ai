import { AdminSection } from "@/components/AdminSection";

export default function AgentsPage() {
  return <AdminSection eyebrow="Agent management" title="Agent registry" description="Enable, configure, and review specialized AI workers." rows={[{ label: "Registered agents", value: "13", status: "Available" }, { label: "Active executions", value: "28" }, { label: "Average success rate", value: "96.4%" }]} />;
}
