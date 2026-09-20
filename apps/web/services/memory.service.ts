export interface MemoryItem {
  id: string;
  content: string;
  scope: string;
  namespace: string;
  importance: number;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function listMemories(namespace = "local"): Promise<MemoryItem[]> {
  const response = await fetch(`${API_URL}/v1/memory?namespace=${encodeURIComponent(namespace)}`);
  if (!response.ok) throw new Error("Memory service unavailable.");
  return response.json() as Promise<MemoryItem[]>;
}

export async function saveMemory(content: string, scope = "conversation", namespace = "local"): Promise<MemoryItem> {
  const response = await fetch(`${API_URL}/v1/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, scope, namespace, importance: 60 }),
  });
  if (!response.ok) throw new Error("Memory could not be saved.");
  return response.json() as Promise<MemoryItem>;
}