/**
 * Shared Prisma client for Six Rivers Community Platform.
 *
 * Prisma 7 requires a driver adapter at runtime — DATABASE_URL is not read
 * directly by the client anymore. We construct the adapter once on first
 * access (lazy) so that:
 *   - Modules that *import* prisma but never hit the DB (e.g. tests of pure
 *     derivation registries) don't trip the env-var check at import time.
 *   - Next.js hot reload doesn't leak connections (Proxy caches per process
 *     via globalThis).
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

function getPrisma(): PrismaClient {
  if (!globalThis.__sr_prisma) {
    globalThis.__sr_prisma = createPrisma();
  }
  return globalThis.__sr_prisma;
}

// A lazy proxy: any property access creates the real client on first use.
// Importing this module is now side-effect free — the DATABASE_URL check
// fires only when something actually queries the DB.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma() as object, prop, receiver);
  },
}) as PrismaClient;
