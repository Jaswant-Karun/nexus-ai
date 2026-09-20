export const APP_NAME    = "Nexus AI";
export const APP_TAGLINE = "Universal Adaptive Intelligence Platform";
export const APP_URL     = "https://nexus.ai";
export const APP_VERSION = "1.0.0";

export const SUPPORT_EMAIL = "support@nexus.ai";
export const DOCS_URL      = "https://docs.nexus.ai";
export const STATUS_URL    = "https://status.nexus.ai";

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE     = 100;

/** Chat */
export const MAX_MESSAGE_LENGTH  = 8000;
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS  = 4096;

/** Uploads */
export const MAX_UPLOAD_SIZE_MB  = 50;
export const ALLOWED_MIME_TYPES  = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "application/json",
] as const;

/** Feature flags (flip in .env.local) */
export const FEATURES = {
  billing:        process.env.NEXT_PUBLIC_FEATURE_BILLING   !== "false",
  analytics:      process.env.NEXT_PUBLIC_FEATURE_ANALYTICS !== "false",
  localModels:    process.env.NEXT_PUBLIC_FEATURE_LOCAL_AI  === "true",
} as const;
