import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface SurvivalCheckPayload {
  clientSubmissionId?: string;
  officerId?: string;
  distributionId?: number | null;
  plotId?: number | null;
  farmerName?: string | null;
  villageName?: string | null;
  checkDate: string;
  survivingCount: number;
  totalCount?: number | null;
  notes?: string | null;
  photoUrls?: string[];
  recordedBy?: string;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("survival_check_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = (await req.json()) as SurvivalCheckPayload;
    const rate =
      body.totalCount && body.totalCount > 0
        ? Math.round((body.survivingCount / body.totalCount) * 100)
        : null;
    const result = await idempotentInsert(
      supabase,
      "survival_check_submissions",
      {
        distribution_id: body.distributionId ?? null,
        plot_id: body.plotId ?? null,
        farmer_name: body.farmerName ?? null,
        village_name: body.villageName ?? null,
        check_date: body.checkDate,
        surviving_count: body.survivingCount,
        total_count: body.totalCount ?? null,
        survival_rate: rate,
        notes: body.notes ?? null,
        photo_urls: body.photoUrls ?? [],
        officer_id: body.officerId ?? null,
        recorded_by: body.recordedBy ?? "Field Officer",
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
