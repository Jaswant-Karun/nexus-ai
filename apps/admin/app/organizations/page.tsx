import { AdminSection } from "@/components/AdminSection";

export default function OrganizationsPage() {
  return <AdminSection eyebrow="Administration" title="Organizations" description="Manage tenant workspaces, plans, and isolation boundaries." rows={[{ label: "Active organizations", value: "184", status: "Healthy" }, { label: "Enterprise plan", value: "42" }, { label: "Pending invitations", value: "17" }]} />;
}
