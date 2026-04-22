import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface IGAUpdatePayload {
  groupId: number;
  groupName: string;
  currentCapitalTSh: number;
  revenueTSh: number;
  expenseTSh: number;
  status: "active" | "struggling" | "inactive";
  notes?: string | null;
  reportedBy?: string;
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const groupIdParam = req.nextUrl.searchParams.get("groupId");
  let query = supabase
    .from("iga_financial_updates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (groupIdParam) {
    const groupId = Number(groupIdParam);
    if (!Number.isNaN(groupId)) {
      query = query.eq("group_id", groupId);
    }
  }

  const { data, error } = await query;

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
    const body = (await req.json()) as IGAUpdatePayload;

    if (typeof body.groupId !== "number" || !body.groupName) {
      return NextResponse.json({ error: "groupId and groupName are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("iga_financial_updates")
      .insert([
        {
          group_id: body.groupId,
          group_name: body.groupName,
          current_capital_tsh: body.currentCapitalTSh,
          revenue_tsh: body.revenueTSh,
          expense_tsh: body.expenseTSh,
          status: body.status,
          notes: body.notes ?? null,
          reported_by: body.reportedBy ?? "Group Leader",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] ?? { success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
