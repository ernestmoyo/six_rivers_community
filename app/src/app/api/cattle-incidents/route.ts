import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface CattleIncidentPayload {
  villageId?: number | null;
  villageName?: string | null;
  incidentType: string;
  severity: string;
  date: string;
  estimatedHerdSize?: number | null;
  description?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
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

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from("cattle_incidents")
      .insert([
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
          reported_by: body.reportedBy ?? "Field Officer",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Fire email notification (best-effort — don't fail the insert if email breaks)
    let emailStatus: { sent: boolean; error?: string } = { sent: false };
    if (body.notifyEmail !== false) {
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
          // Mark email_sent=true in DB
          const inserted = data?.[0];
          if (inserted?.id) {
            await supabase
              .from("cattle_incidents")
              .update({ email_sent: true })
              .eq("id", inserted.id);
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
      incident: data?.[0] ?? null,
      email: emailStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
