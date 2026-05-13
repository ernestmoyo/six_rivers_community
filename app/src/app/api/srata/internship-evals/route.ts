import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface EvalPayload {
  clientSubmissionId?: string;
  officerId?: string;
  internshipId: number;
  competencyScore?: number;
  punctualityScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  professionalBehaviour?: number;
  completionStatus: string;
  transitionedToEmployment?: boolean;
  supervisorFeedback?: string;
  endDate?: string | null;
  recordedBy?: string;
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as EvalPayload;
    const update: Record<string, unknown> = {
      competency_score: body.competencyScore ?? null,
      punctuality_score: body.punctualityScore ?? null,
      communication_score: body.communicationScore ?? null,
      teamwork_score: body.teamworkScore ?? null,
      professional_behaviour: body.professionalBehaviour ?? null,
      completion_status: body.completionStatus,
      transitioned_to_employment: body.transitionedToEmployment ?? null,
      supervisor_feedback: body.supervisorFeedback ?? null,
    };
    if (body.endDate) update.end_date = body.endDate;
    const { data, error } = await supabase
      .from("srata_internships")
      .update(update)
      .eq("id", body.internshipId)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] ?? { success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
