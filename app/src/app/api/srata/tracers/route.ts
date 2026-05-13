import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface TracerPayload {
  clientSubmissionId?: string;
  officerId?: string;
  studentId: number;
  cohortId?: number;
  traceWindow: string;
  traceDate: string;
  contactedVia?: string;
  employed: boolean;
  employer?: string;
  jobTitle?: string;
  sector?: string;
  hospitalityRelated?: boolean;
  monthlyIncomeTSh?: number | null;
  jobRetention?: boolean;
  promoted?: boolean;
  selfEmployed?: boolean;
  businessType?: string;
  furtherEducation?: boolean;
  notes?: string;
  recordedBy?: string;
}

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const studentParam = req.nextUrl.searchParams.get("studentId");
  let q = supabase.from("srata_graduate_traces").select("*").order("trace_date", { ascending: false }).limit(500);
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
    const body = (await req.json()) as TracerPayload;
    const result = await idempotentInsert(
      supabase,
      "srata_graduate_traces",
      {
        student_id: body.studentId,
        cohort_id: body.cohortId ?? null,
        trace_window: body.traceWindow,
        trace_date: body.traceDate,
        contacted_via: body.contactedVia ?? null,
        employed: body.employed,
        employer: body.employer ?? null,
        job_title: body.jobTitle ?? null,
        sector: body.sector ?? null,
        hospitality_related: body.hospitalityRelated ?? null,
        monthly_income_tsh: body.monthlyIncomeTSh ?? null,
        job_retention: body.jobRetention ?? null,
        promoted: body.promoted ?? null,
        self_employed: body.selfEmployed ?? null,
        business_type: body.businessType ?? null,
        further_education: body.furtherEducation ?? null,
        notes: body.notes ?? null,
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
