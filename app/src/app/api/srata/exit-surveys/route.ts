import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface ExitPayload {
  clientSubmissionId?: string;
  officerId?: string;
  studentId: number;
  cohortId?: number;
  surveyDate: string;
  selfRatedEnglish?: string;
  selfRatedComputer?: string;
  confidenceLevel?: string;
  jobReadiness?: string;
  preferredEmployerType?: string;
  immediatePlan?: string;
  notes?: string;
  recordedBy?: string;
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as ExitPayload;
    const result = await idempotentInsert(
      supabase,
      "srata_graduate_traces",
      {
        student_id: body.studentId,
        cohort_id: body.cohortId ?? null,
        trace_window: "exit",
        trace_date: body.surveyDate,
        contacted_via: "in_person",
        employed: false,
        notes: [
          body.selfRatedEnglish && `English: ${body.selfRatedEnglish}`,
          body.selfRatedComputer && `Computer: ${body.selfRatedComputer}`,
          body.confidenceLevel && `Confidence: ${body.confidenceLevel}`,
          body.jobReadiness && `Job readiness: ${body.jobReadiness}`,
          body.preferredEmployerType && `Preferred employer: ${body.preferredEmployerType}`,
          body.immediatePlan && `Plan: ${body.immediatePlan}`,
          body.notes,
        ]
          .filter(Boolean)
          .join(" · "),
        officer_id: body.officerId ?? null,
        recorded_by: body.recordedBy ?? "M&E Specialist",
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
