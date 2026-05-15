/**
 * Shared Prisma client factory for the seed scripts. Each invocation is a
 * fresh tsx process so no global caching is needed — just construct the
 * driver adapter and return a fresh client.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

export function createSeedClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Update app/.env to point at your Supabase Postgres.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
