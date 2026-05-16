// Prisma 7 datasource config.
//
// On Supabase, the direct connection (db.<ref>.supabase.co:5432) is IPv6-only
// and doesn't route from many networks. We prefer the session pooler when it
// is available; the direct DATABASE_URL stays as a fallback for environments
// that do have IPv6.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["SESSION_POOLER_URI"] ?? process.env["DATABASE_URL"],
  },
});
