import { StatCard } from "@/components/cards/StatCard";
import { BotIcon, ZapIcon, BrainIcon, BarChart3Icon } from "@/components/ui/Icons";

interface Metric {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  accent?: "brand" | "green" | "amber" | "red" | "purple";
}

const defaultMetrics: Metric[] = [
  { title: "Active Autonomous Agents", value: "14",    trend: "+3 this week",    trendUp: true,  accent: "brand"  },
  { title: "Workflow Executions",       value: "142.8k", trend: "+12% throughput", trendUp: true,  accent: "purple" },
  { title: "Vector Search Latency",     value: "12.4ms", trend: "-4.1ms optimized",trendUp: true,  accent: "green"  },
  { title: "Total Embeddings",          value: "4.8M",  trend: "540 GB indexed",                   accent: "amber"  },
];

const icons = [<BotIcon size={16} key="bot" />, <ZapIcon size={16} key="zap" />, <BrainIcon size={16} key="brain" />, <BarChart3Icon size={16} key="bar" />];

interface MetricsGridProps {
  metrics?: Metric[];
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ metrics = defaultMetrics, columns = 4 }: MetricsGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-5 ${gridCols[columns]}`}>
      {metrics.map((m, i) => (
        <StatCard
          key={m.title}
          title={m.title}
          value={m.value}
          trend={m.trend}
          trendUp={m.trendUp}
          accent={m.accent}
          icon={icons[i % icons.length]}
        />
      ))}
    </div>
  );
}
