import { AdminSection } from "@/components/AdminSection";

export default function SettingsPage() {
  return <AdminSection eyebrow="Configuration" title="Admin settings" description="Configure operational defaults and governance policies." rows={[{ label: "Environment", value: "Development" }, { label: "Audit logging", value: "Enabled", status: "Active" }, { label: "Rate limiting", value: "Configured" }]} />;
}
