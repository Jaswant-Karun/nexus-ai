import { AdminSection } from "@/components/AdminSection";

export default function PromptsPage() {
  return <AdminSection eyebrow="AI governance" title="Prompt registry" description="Review versioned system prompts and their rollout status." rows={[{ label: "Published prompts", value: "28", status: "Active" }, { label: "Draft revisions", value: "6" }, { label: "Last evaluation", value: "98.1% groundedness" }]} />;
}
