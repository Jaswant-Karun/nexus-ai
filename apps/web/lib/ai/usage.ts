/**
 * NEXUS AI — Usage Tracking Store
 *
 * Records per-request usage (provider, model, tokens, cost, success/failure)
 * so the dashboard can show:
 *
 *   AI Usage → Cost → Provider → Model → Tokens → Requests
 *
 * The default implementation is an in-memory ring buffer (production should
 * swap in a database-backed store — see `UsageStore` interface).
 */

import type { ProviderId, UsageRecord, UsageSummary } from "./types";

export interface UsageStore {
  record(entry: UsageRecord): void;
  getSummary(): UsageSummary[];
  getRecent(limit?: number): UsageRecord[];
  clear(): void;
}

// ─── In-memory implementation ─────────────────────────────────────────────────
// Keeps the last N records to avoid unbounded memory growth.

const MAX_RECORDS = 10_000;

class InMemoryUsageStore implements UsageStore {
  private records: UsageRecord[] = [];

  record(entry: UsageRecord): void {
    this.records.push(entry);
    if (this.records.length > MAX_RECORDS) {
      this.records = this.records.slice(-MAX_RECORDS);
    }
  }

  getSummary(): UsageSummary[] {
    const byProvider = new Map<ProviderId, UsageSummary>();

    for (const r of this.records) {
      let summary = byProvider.get(r.provider);
      if (!summary) {
        summary = {
          provider: r.provider,
          requests: 0,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          costUsd: 0,
          successCount: 0,
          failureCount: 0,
          models: [],
        };
        byProvider.set(r.provider, summary);
      }

      summary.requests++;
      summary.promptTokens += r.promptTokens;
      summary.completionTokens += r.completionTokens;
      summary.totalTokens += r.totalTokens;
      summary.costUsd += r.costUsd;
      if (r.success) summary.successCount++;
      else summary.failureCount++;

      // Aggregate per-model stats within a provider.
      let modelStat = summary.models.find((m) => m.model === r.model);
      if (!modelStat) {
        modelStat = { model: r.model, requests: 0, totalTokens: 0 };
        summary.models.push(modelStat);
      }
      modelStat.requests++;
      modelStat.totalTokens += r.totalTokens;
    }

    return Array.from(byProvider.values()).sort(
      (a, b) => b.requests - a.requests,
    );
  }

  getRecent(limit = 50): UsageRecord[] {
    return this.records.slice(-limit).reverse();
  }

  clear(): void {
    this.records = [];
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
// Module-level singleton — shared across all requests in the same server process.

let store: UsageStore | null = null;

export function getUsageStore(): UsageStore {
  if (!store) store = new InMemoryUsageStore();
  return store;
}

/** Allow tests or a DB-backed store to override the default. */
export function setUsageStore(s: UsageStore): void {
  store = s;
}
