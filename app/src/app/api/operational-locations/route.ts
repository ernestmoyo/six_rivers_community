/**
 * GET    /api/operational-locations          — list with optional filter
 * POST   /api/operational-locations          — create
 *
 * The reconciliation admin tool (Edna/Lilian) calls these.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  OperationalLocationKind,
  ReconciliationStatus,
} from "@/generated/prisma/enums";

interface CreatePayload {
  kind: OperationalLocationKind;
  displayName: string;
  aliases?: string[];
  reconciliationStatus?: ReconciliationStatus;
  notes?: string;
  lat?: number | null;
  lng?: number | null;
  isOperational?: boolean;
  sector?: string | null;
  canonicalVillageId?: number | null;
  canonicalWardId?: number | null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") as ReconciliationStatus | null;
    const sector = url.searchParams.get("sector");
    const kind = url.searchParams.get("kind") as OperationalLocationKind | null;

    const rows = await prisma.operationalLocation.findMany({
      where: {
        reconciliationStatus: status ?? undefined,
        sector: sector ?? undefined,
        kind: kind ?? undefined,
      },
      include: {
        canonicalVillage: { include: { ward: true } },
        canonicalWard: { include: { district: true } },
      },
      orderBy: [{ sector: "asc" }, { displayName: "asc" }],
    });
    return NextResponse.json({ rows });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as CreatePayload;
    if (!body.displayName || !body.kind) {
      return NextResponse.json(
        { error: "displayName and kind are required" },
        { status: 400 },
      );
    }
    const row = await prisma.operationalLocation.create({
      data: {
        kind: body.kind,
        displayName: body.displayName,
        aliases: body.aliases ?? [],
        reconciliationStatus:
          body.reconciliationStatus ?? ReconciliationStatus.pending,
        notes: body.notes ?? null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        isOperational: body.isOperational ?? true,
        sector: body.sector ?? null,
        canonicalVillageId: body.canonicalVillageId ?? null,
        canonicalWardId: body.canonicalWardId ?? null,
      },
    });
    return NextResponse.json({ row });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

function errorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "Unknown error";
  const code =
    message.includes("DATABASE_URL") || message.includes("does not exist")
      ? 503
      : 500;
  return NextResponse.json({ error: message }, { status: code });
}
