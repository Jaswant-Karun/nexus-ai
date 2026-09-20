export interface AppConfig {
  env: "development" | "staging" | "production" | "test";
  port: number;
  apiGatewayUrl: string;
  aiServiceUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
}

export function loadConfig(): AppConfig {
  return {
    env: (process.env.NODE_ENV as AppConfig["env"]) || "development",
    port: Number.parseInt(process.env.PORT || "3000", 10),
    apiGatewayUrl: process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000",
    aiServiceUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001",
    databaseUrl: process.env.DATABASE_URL || "postgresql://nexus:nexus_pass@localhost:5432/nexus_db",
    jwtSecret: process.env.JWT_SECRET || "nexus-super-secret-key-change-in-production",
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  };
}

export const config = loadConfig();
