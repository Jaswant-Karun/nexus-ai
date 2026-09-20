import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to apps/web/.env.local"
    );
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Re-use across hot-reloads in development to prevent connection pool exhaustion
export const prisma: PrismaClient =
  globalThis._prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = prisma;
}
