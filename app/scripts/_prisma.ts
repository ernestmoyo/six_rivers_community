/**
 * Shared Prisma client factory for the seed scripts. Each invocation is a
 * fresh tsx process so no global caching is needed — just construct the
 * driver adapter and return a fresh client.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

export function createSeedClient(): PrismaClient {
  // Prefer Supabase session pooler (IPv4); fall back to DATABASE_URL.
  const connectionString =
    process.env.SESSION_POOLER_URI ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Neither SESSION_POOLER_URI nor DATABASE_URL is set. Update app/.env to " +
        "point at your Supabase Postgres.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
