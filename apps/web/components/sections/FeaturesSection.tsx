import { FeatureCard } from "@/components/cards/FeatureCard";
import { BotIcon, BrainIcon, ZapIcon, ShieldIcon, SearchIcon, BarChart3Icon } from "@/components/ui/Icons";

const features = [
  {
    icon: <BotIcon size={20} />,
    title: "Autonomous AI Agents",
    description:
      "Deploy specialised agents with tool execution, memory recall, and dynamic prompt tuning across GPT-4o, Claude, Gemini, and local LLMs.",
    badge: "Core",
  },
  {
    icon: <ZapIcon size={20} />,
    title: "Visual Workflow Engine",
    description:
      "Build drag-and-drop multi-node DAGs to automate data pipelines, webhooks, and multi-agent collaboration — no code required.",
    badge: "No-code",
  },
  {
    icon: <BrainIcon size={20} />,
    title: "Adaptive Memory Engine",
    description:
      "Sub-millisecond hybrid vector retrieval (BM25 + Qdrant dense embeddings) for context-grounded AI responses at any scale.",
    badge: "RAG",
  },
  {
    icon: <SearchIcon size={20} />,
    title: "Semantic Search",
    description:
      "Unified search across all your knowledge sources — documents, databases, APIs — powered by dense vector embeddings.",
  },
  {
    icon: <ShieldIcon size={20} />,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified. RBAC, SSO/SAML 2.0, AES-256 encryption at rest, full audit trails, and GDPR compliance mode.",
  },
  {
    icon: <BarChart3Icon size={20} />,
    title: "Real-time Analytics",
    description:
      "Live dashboards for agent performance, workflow throughput, cost per request, and knowledge retrieval accuracy.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding" id="features">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-400">
            Everything in one platform
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Built for intelligent enterprises
          </h2>
          <p className="mt-4 text-dark-300 max-w-xl mx-auto">
            From autonomous agents to workflow orchestration and knowledge retrieval — Nexus AI
            provides every layer of the modern AI stack.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
