import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface CropCyclePayload {
  clientSubmissionId?: string;
  officerId?: string;
  farmerId?: number | null;
  farmerName?: string | null;
  villageId?: number | null;
  villageName?: string | null;
  cropType: string;
  plantingDate: string;
  expectedHarvestDate?: string | null;
  areaHectares?: number | null;
  expectedYieldKg?: number | null;
  photoUrls?: string[];
  notes?: string | null;
  recordedBy?: string;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("crop_cycles")
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
    const body = (await req.json()) as CropCyclePayload;
    const result = await idempotentInsert(
      supabase,
      "crop_cycles",
      {
        farmer_id: body.farmerId ?? null,
        farmer_name: body.farmerName ?? null,
        village_id: body.villageId ?? null,
        village_name: body.villageName ?? null,
        crop_type: body.cropType,
        planting_date: body.plantingDate,
        expected_harvest_date: body.expectedHarvestDate ?? null,
        area_hectares: body.areaHectares ?? null,
        expected_yield_kg: body.expectedYieldKg ?? null,
        photo_urls: body.photoUrls ?? [],
        notes: body.notes ?? null,
        status: "planted",
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
