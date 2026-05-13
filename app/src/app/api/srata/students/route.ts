import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface StudentPayload {
  clientSubmissionId?: string;
  officerId?: string;
  cohortId?: number | null;
  cohortName?: string | null;
  fullName: string;
  sex?: string;
  dateOfBirth?: string | null;
  district?: string;
  region?: string;
  educationLevel?: string;
  householdSize?: number | null;
  maritalStatus?: string;
  phone?: string;
  hasSmartphone?: boolean;
  hasEmail?: boolean;
  email?: string;
  employmentStatusBefore?: string;
  monthlyIncomeBeforeTSh?: number | null;
  englishLevelBefore?: string;
  computerLevelBefore?: string;
  hospitalityExperience?: boolean;
  careerGoal?: string;
  preferredPathway?: string;
  enrolledAt?: string;
  recordedBy?: string;
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const cohortIdParam = req.nextUrl.searchParams.get("cohortId");
  let q = supabase
    .from("srata_students")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
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
    const body = (await req.json()) as StudentPayload;
    if (!body.fullName) {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }
    const result = await idempotentInsert(
      supabase,
      "srata_students",
      {
        cohort_id: body.cohortId ?? null,
        cohort_name: body.cohortName ?? null,
        full_name: body.fullName,
        sex: body.sex ?? null,
        date_of_birth: body.dateOfBirth ?? null,
        district: body.district ?? null,
        region: body.region ?? null,
        education_level: body.educationLevel ?? null,
        household_size: body.householdSize ?? null,
        marital_status: body.maritalStatus ?? null,
        phone: body.phone ?? null,
        has_smartphone: body.hasSmartphone ?? false,
        has_email: body.hasEmail ?? false,
        email: body.email ?? null,
        employment_status_before: body.employmentStatusBefore ?? null,
        monthly_income_before_tsh: body.monthlyIncomeBeforeTSh ?? null,
        english_level_before: body.englishLevelBefore ?? null,
        computer_level_before: body.computerLevelBefore ?? null,
        hospitality_experience: body.hospitalityExperience ?? false,
        career_goal: body.careerGoal ?? null,
        preferred_pathway: body.preferredPathway ?? null,
        enrolled_at: body.enrolledAt ?? new Date().toISOString().slice(0, 10),
        status: "enrolled",
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
