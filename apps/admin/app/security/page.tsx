import { AdminSection } from "@/components/AdminSection";

export default function SecurityPage() {
  return <AdminSection eyebrow="Governance" title="Security center" description="Monitor authentication, authorization, and platform protection signals." rows={[{ label: "Authentication status", value: "Protected", status: "Healthy" }, { label: "Failed sign-ins today", value: "12" }, { label: "Open security alerts", value: "0", status: "Clear" }]} />;
}
