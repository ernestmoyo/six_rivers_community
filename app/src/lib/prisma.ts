/**
 * Shared Prisma client for Six Rivers Community Platform.
 *
 * Prisma 7 requires a driver adapter at runtime — DATABASE_URL is not read
 * directly by the client anymore. We construct the adapter here once and
 * reuse the same PrismaClient across the app to avoid leaking connections
 * during Next.js hot reload.
 *
 * Server-only — never import this from a client component.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var __sr_prisma: PrismaClient | undefined;
}

function createPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in app/.env to point at your " +
        "Supabase Postgres project.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalThis.__sr_prisma ?? (globalThis.__sr_prisma = createPrisma());
