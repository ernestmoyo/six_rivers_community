/**
 * Idempotency helpers for API routes.
 *
 * Every submission carries a client-generated `clientSubmissionId` so that
 * offline-queue replays don't create duplicate rows. The API routes try to
 * insert with the id; if the unique constraint fires, we return the existing
 * row instead.
 *
 * The pattern degrades gracefully if the column hasn't been migrated yet —
 * the row is just inserted normally.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface IdempotentInsertResult<T> {
  row: T | null;
  duplicate: boolean;
  error: string | null;
}

/**
 * Insert a row, returning the existing row if the client_submission_id already
 * exists. Returns `{ duplicate: true }` when a duplicate was detected.
 */
export async function idempotentInsert<T extends Record<string, unknown>>(
  client: SupabaseClient,
  table: string,
  row: Record<string, unknown>,
  clientSubmissionId: string | null | undefined,
): Promise<IdempotentInsertResult<T>> {
  if (clientSubmissionId) {
    // Quick pre-check: if a row with this id already exists, return it.
    const { data: existing } = await client
      .from(table)
      .select("*")
      .eq("client_submission_id", clientSubmissionId)
      .maybeSingle();
    if (existing) {
      return { row: existing as T, duplicate: true, error: null };
    }
  }

  const payload = clientSubmissionId
    ? { ...row, client_submission_id: clientSubmissionId }
    : row;

  const { data, error } = await client.from(table).insert([payload]).select();
  if (error) {
    // Race: another replay inserted the same id between our pre-check and insert.
    if (error.code === "23505" && clientSubmissionId) {
      const { data: existing } = await client
        .from(table)
        .select("*")
        .eq("client_submission_id", clientSubmissionId)
        .maybeSingle();
      if (existing) {
        return { row: existing as T, duplicate: true, error: null };
      }
    }
    return { row: null, duplicate: false, error: error.message };
  }

  return { row: (data?.[0] ?? null) as T | null, duplicate: false, error: null };
}
