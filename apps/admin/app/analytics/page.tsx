import { AdminSection } from "@/components/AdminSection";

export default function AnalyticsPage() {
  return <AdminSection eyebrow="Platform analytics" title="Usage analytics" description="Track requests, latency, workflow outcomes, and estimated model cost." rows={[{ label: "Requests today", value: "24,891" }, { label: "Median latency", value: "842 ms" }, { label: "Estimated daily cost", value: "$18.42" }]} />;
}
