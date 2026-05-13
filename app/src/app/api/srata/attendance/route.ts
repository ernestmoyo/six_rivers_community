import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface AttendancePayload {
  clientSubmissionId?: string;
  officerId?: string;
  cohortId?: number;
  sessionDate: string;
  entries: { studentId: number; present: boolean; notes?: string }[];
  recordedBy?: string;
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const cohortIdParam = req.nextUrl.searchParams.get("cohortId");
  let q = supabase
    .from("srata_attendance")
    .select("*")
    .order("session_date", { ascending: false })
    .limit(500);
  if (cohortIdParam) {
    const cid = Number(cohortIdParam);
    if (!Number.isNaN(cid)) q = q.eq("cohort_id", cid);
  }
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as AttendancePayload;
    if (!Array.isArray(body.entries) || !body.entries.length) {
      return NextResponse.json({ error: "entries required" }, { status: 400 });
    }
    let inserted = 0;
    let duplicates = 0;
    for (const entry of body.entries) {
      const result = await idempotentInsert(
        supabase,
        "srata_attendance",
        {
          student_id: entry.studentId,
          cohort_id: body.cohortId ?? null,
          session_date: body.sessionDate,
          present: entry.present,
          notes: entry.notes ?? null,
          officer_id: body.officerId ?? null,
          recorded_by: body.recordedBy ?? "Trainer",
        },
        body.clientSubmissionId ? `${body.clientSubmissionId}:${entry.studentId}` : undefined,
      );
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      if (result.duplicate) duplicates++;
      else inserted++;
    }
    return NextResponse.json({ inserted, duplicates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
