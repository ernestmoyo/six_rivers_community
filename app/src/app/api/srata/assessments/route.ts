import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface AssessmentPayload {
  clientSubmissionId?: string;
  officerId?: string;
  studentId: number;
  cohortId?: number;
  kind: string;
  score: number;
  maxScore?: number;
  assessmentDate: string;
  notes?: string;
  recordedBy?: string;
}

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const studentParam = req.nextUrl.searchParams.get("studentId");
  let q = supabase.from("srata_assessments").select("*").order("assessment_date", { ascending: false }).limit(500);
  if (studentParam) {
    const id = Number(studentParam);
    if (!Number.isNaN(id)) q = q.eq("student_id", id);
  }
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as AssessmentPayload;
    const result = await idempotentInsert(
      supabase,
      "srata_assessments",
      {
        student_id: body.studentId,
        cohort_id: body.cohortId ?? null,
        kind: body.kind,
        score: body.score,
        max_score: body.maxScore ?? 100,
        assessment_date: body.assessmentDate,
        notes: body.notes ?? null,
        officer_id: body.officerId ?? null,
        recorded_by: body.recordedBy ?? "Trainer",
      },
      body.clientSubmissionId,
    );
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ...(result.row ?? { success: true }), duplicate: result.duplicate });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
