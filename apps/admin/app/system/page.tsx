import { AdminSection } from "@/components/AdminSection";

export default function SystemPage() {
  return <AdminSection eyebrow="Platform operations" title="System configuration" description="Review runtime configuration and deployment readiness." rows={[{ label: "Environment", value: "Development" }, { label: "Database", value: "PostgreSQL", status: "Connected" }, { label: "Cache", value: "Redis", status: "Configured" }, { label: "Vector store", value: "Qdrant", status: "Configured" }]} />;
}
