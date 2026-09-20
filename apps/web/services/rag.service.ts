export interface RetrievalResult {
  chunk_id: string;
  document_id: string;
  text: string;
  source: string;
  relevance: number;
}

export async function searchIndexedKnowledge(query: string, limit = 5): Promise<RetrievalResult[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/v1/rag/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
    },
  );

  if (!response.ok) {
    throw new Error("Indexed knowledge search failed.");
  }

  return response.json() as Promise<RetrievalResult[]>;
}