/**
 * Shared error envelope for the new Prisma-backed API routes.
 *
 * Wraps Prisma errors so the UI can distinguish:
 *   - 503  DATABASE_URL is not set / DB unreachable     → show "setup required"
 *   - 400  Bad input                                    → show validation
 *   - 409  Unique-constraint conflict                   → caller knows it's a dup
 *   - 500  Unexpected error                             → generic fallback
 */
import { NextResponse } from "next/server";

interface KnownError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

export function isPrismaError(error: unknown): error is KnownError {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

export function apiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (
    message.includes("DATABASE_URL") ||
    message.includes("Can't reach database") ||
    message.includes("Authentication failed against the database")
  ) {
    return NextResponse.json(
      { error: "Database not configured", message },
      { status: 503 },
    );
  }

  if (isPrismaError(error)) {
    // P2002 = unique constraint
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Conflict — already exists", message, meta: error.meta },
        { status: 409 },
      );
    }
    // P2025 = record not found
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found", message }, { status: 404 });
    }
    // P2003 = foreign key violation
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Foreign key violation", message },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ error: message }, { status: 500 });
}
