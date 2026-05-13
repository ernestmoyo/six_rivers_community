import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface InternshipPayload {
  clientSubmissionId?: string;
  officerId?: string;
  studentId: number;
  cohortId?: number;
  hostInstitution: string;
  department?: string;
  startDate: string;
  endDate?: string | null;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  completionStatus?: string;
  recordedBy?: string;
}

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const { data, error } = await supabase
    .from("srata_internships")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as InternshipPayload;
    const result = await idempotentInsert(
      supabase,
      "srata_internships",
      {
        student_id: body.studentId,
        cohort_id: body.cohortId ?? null,
        host_institution: body.hostInstitution,
        department: body.department ?? null,
        start_date: body.startDate,
        end_date: body.endDate ?? null,
        supervisor_name: body.supervisorName ?? null,
        supervisor_phone: body.supervisorPhone ?? null,
        supervisor_email: body.supervisorEmail ?? null,
        completion_status: body.completionStatus ?? "in_progress",
        officer_id: body.officerId ?? null,
        recorded_by: body.recordedBy ?? "Internship Coordinator",
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
