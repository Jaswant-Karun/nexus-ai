import { AdminSection } from "@/components/AdminSection";

export default function AiModelsPage() {
  return <AdminSection eyebrow="AI configuration" title="Model providers" description="Review provider readiness, model capabilities, and routing policy." rows={[{ label: "Configured providers", value: "0", status: "Awaiting keys" }, { label: "Default model", value: "gpt-4o-mini" }, { label: "Fallback policy", value: "Enabled" }]} />;
}
