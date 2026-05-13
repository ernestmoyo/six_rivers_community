import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface CohortPayload {
  name: string;
  startDate: string;
  endDate?: string | null;
  intakeSize?: number;
  status?: string;
  notes?: string;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("srata_cohorts")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as CohortPayload;
    const { data, error } = await supabase
      .from("srata_cohorts")
      .insert([
        {
          name: body.name,
          start_date: body.startDate,
          end_date: body.endDate ?? null,
          intake_size: body.intakeSize ?? null,
          status: body.status ?? "in_training",
          notes: body.notes ?? null,
        },
      ])
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] ?? { success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
