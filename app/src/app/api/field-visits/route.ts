import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface FieldVisitPayload {
  clientSubmissionId?: string;
  officerId?: string;
  userName?: string;
  villageId: number;
  villageName: string;
  visitDate: string;
  visitType: string;
  locationLat?: number | null;
  locationLng?: number | null;
  notes?: string;
  photos?: string[];
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("field_visits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as FieldVisitPayload;

    const result = await idempotentInsert(
      supabase,
      "field_visits",
      {
        user_name: body.userName || "Field Officer",
        officer_id: body.officerId ?? null,
        village_id: body.villageId,
        village_name: body.villageName,
        visit_date: body.visitDate,
        visit_type: body.visitType,
        location_lat: body.locationLat ?? null,
        location_lng: body.locationLng ?? null,
        notes: body.notes || "",
        photos: body.photos ?? [],
      },
      body.clientSubmissionId,
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ...(result.row ?? { success: true }), duplicate: result.duplicate });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
