/**
 * PATCH  /api/operational-locations/[id]  — Edna/Lilian's reconciliation edit
 * DELETE /api/operational-locations/[id]  — remove an entry (admin-only intent)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  OperationalLocationKind,
  ReconciliationStatus,
} from "@/generated/prisma/enums";

const PatchSchema = z.object({
  displayName: z.string().min(1).optional(),
  aliases: z.array(z.string()).optional(),
  reconciliationStatus: z.nativeEnum(ReconciliationStatus).optional(),
  notes: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  isOperational: z.boolean().optional(),
  sector: z.string().nullable().optional(),
  canonicalVillageId: z.number().int().nullable().optional(),
  canonicalWardId: z.number().int().nullable().optional(),
  kind: z.nativeEnum(OperationalLocationKind).optional(),
  reviewedById: z.number().int().nullable().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const json = await req.json();
    const parsed = PatchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const reviewedById = parsed.data.reviewedById;
    const row = await prisma.operationalLocation.update({
      where: { id: numericId },
      data: {
        ...parsed.data,
        reviewedAt: reviewedById ? new Date() : undefined,
      },
    });
    return NextResponse.json({ row });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code =
      message.includes("DATABASE_URL") || message.includes("does not exist")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status: code });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await prisma.operationalLocation.delete({ where: { id: numericId } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
