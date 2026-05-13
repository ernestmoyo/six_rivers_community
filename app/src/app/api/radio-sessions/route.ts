import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { idempotentInsert } from "@/lib/idempotency";

interface RadioSessionPayload {
  clientSubmissionId?: string;
  officerId?: string;
  sessionDate: string;
  hostName?: string | null;
  topic?: string | null;
  durationMinutes?: number | null;
  estimatedListeners?: number | null;
  notes?: string | null;
  recordedBy?: string;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("radio_sessions")
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
    const body = (await req.json()) as RadioSessionPayload;
    const result = await idempotentInsert(
      supabase,
      "radio_sessions",
      {
        session_date: body.sessionDate,
        host_name: body.hostName ?? null,
        topic: body.topic ?? null,
        duration_minutes: body.durationMinutes ?? null,
        estimated_listeners: body.estimatedListeners ?? null,
        notes: body.notes ?? null,
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
