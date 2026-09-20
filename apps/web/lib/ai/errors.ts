/**
 * NEXUS AI — Provider error types.
 *
 * Thrown by provider implementations and inspected by the fallback engine to
 * decide whether to retry on the next model in the chain.
 */

export type RetryableReason =
  | "rate_limit"
  | "server_error"
  | "timeout"
  | "connection"
  | "unknown";

export class ProviderError extends Error {
  readonly status: number;
  readonly retryable: boolean;
  readonly reason: RetryableReason;

  constructor(status: number, message: string, reason?: RetryableReason) {
    super(message);
    this.name = "ProviderError";
    this.status = status;

    // Classify whether the fallback engine should try the next model.
    if (reason) {
      this.reason = reason;
    } else if (status === 429) {
      this.reason = "rate_limit";
    } else if (status >= 500) {
      this.reason = "server_error";
    } else if (status === 408) {
      this.reason = "timeout";
    } else {
      this.reason = "unknown";
    }

    // Retry on rate-limit, 5xx, timeout, and connection issues.
    // Don't retry on auth (401/403) or bad-request (400) — those are config errors.
    this.retryable =
      this.reason === "rate_limit" ||
      this.reason === "server_error" ||
      this.reason === "timeout" ||
      this.reason === "connection";
  }
}

/** Convenience: wrap a thrown fetch error into a ProviderError. */
export function wrapFetchError(err: unknown): ProviderError {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed") || msg.includes("connect")) {
    return new ProviderError(503, `Connection failed: ${msg}`, "connection");
  }
  if (msg.includes("timeout") || msg.includes("abort") || msg.includes("Timeout")) {
    return new ProviderError(408, `Request timed out: ${msg}`, "timeout");
  }
  return new ProviderError(500, msg, "unknown");
}
