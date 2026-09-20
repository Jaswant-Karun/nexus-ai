export interface GraphSearchResult {
  entity: {
    id: string;
    label: string;
    category: string;
    source: string;
    confidence: number;
  };
  degree: number;
}

export async function searchKnowledgeGraph(query: string): Promise<GraphSearchResult[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/knowledge/search?query=${encodeURIComponent(query)}`,
  );
  if (!response.ok) throw new Error("Knowledge graph search failed.");
  return response.json() as Promise<GraphSearchResult[]>;
}