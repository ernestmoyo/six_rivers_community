import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface CattleIncidentPayload {
  clientSubmissionId?: string;
  officerId?: string;
  villageId?: number | null;
  villageName?: string | null;
  incidentType: string;
  severity: string;
  date: string;
  estimatedHerdSize?: number | null;
  description?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  photoUrls?: string[];
  reportedBy?: string;
  notifyEmail?: boolean;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("cattle_incidents")
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
    const body = (await req.json()) as CattleIncidentPayload;

    const result = await idempotentInsert<{ id: number }>(
      supabase,
      "cattle_incidents",
      {
        village_id: body.villageId ?? null,
        village_name: body.villageName ?? null,
        incident_type: body.incidentType,
        severity: body.severity,
        incident_date: body.date,
        estimated_herd: body.estimatedHerdSize ?? null,
        description: body.description ?? null,
        location_lat: body.locationLat ?? null,
        location_lng: body.locationLng ?? null,
        photo_urls: body.photoUrls ?? [],
        officer_id: body.officerId ?? null,
        reported_by: body.reportedBy ?? "Field Officer",
      },
      body.clientSubmissionId,
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Fire email notification only for fresh inserts (don't re-email replays).
    let emailStatus: { sent: boolean; error?: string } = { sent: false };
    if (!result.duplicate && body.notifyEmail !== false) {
      try {
        const origin = req.nextUrl.origin;
        const emailRes = await fetch(`${origin}/api/cattle-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            villageName: body.villageName,
            incidentType: body.incidentType,
            severity: body.severity,
            estimatedHerdSize: body.estimatedHerdSize,
            description: body.description,
            reportedBy: body.reportedBy ?? "Field Officer",
            date: body.date,
          }),
        });
        if (emailRes.ok) {
          emailStatus = { sent: true };
          if (result.row?.id) {
            await supabase
              .from("cattle_incidents")
              .update({ email_sent: true })
              .eq("id", result.row.id);
          }
        } else {
          const emailErr = await emailRes.json().catch(() => ({ error: "Unknown" }));
          emailStatus = { sent: false, error: emailErr.error };
        }
      } catch (e) {
        emailStatus = { sent: false, error: e instanceof Error ? e.message : "Email failed" };
      }
    }

    return NextResponse.json({
      incident: result.row,
      email: emailStatus,
      duplicate: result.duplicate,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
