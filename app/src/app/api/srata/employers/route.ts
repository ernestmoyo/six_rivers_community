import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface EmployerPayload {
  clientSubmissionId?: string;
  officerId?: string;
  name: string;
  sector?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  district?: string;
  partnerType?: string;
  repeatRecruitment?: boolean;
  notes?: string;
  recordedBy?: string;
}

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const { data, error } = await supabase
    .from("srata_employers")
    .select("*")
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as EmployerPayload;
    const result = await idempotentInsert(
      supabase,
      "srata_employers",
      {
        name: body.name,
        sector: body.sector ?? null,
        contact_person: body.contactPerson ?? null,
        phone: body.phone ?? null,
        email: body.email ?? null,
        district: body.district ?? null,
        partner_type: body.partnerType ?? "internship",
        repeat_recruitment: body.repeatRecruitment ?? false,
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
