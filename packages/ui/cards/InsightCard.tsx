type InsightCardProps = {
  title: string;
  description: string;
  accent: string;
};

export function InsightCard({ title, description, accent }: InsightCardProps) {
  return (
    <article className="insight-card">
      <span className="insight-card__accent">{accent}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}