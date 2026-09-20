import { AdminSection } from "@/components/AdminSection";

export default function SubscriptionsPage() {
  return <AdminSection eyebrow="Billing operations" title="Subscriptions" description="Review organization plans, quotas, and usage limits." rows={[{ label: "Enterprise organizations", value: "42" }, { label: "Plans requiring review", value: "4", status: "Review" }, { label: "Monthly AI usage", value: "68% of quota" }]} />;
}
