/**
 * POST /api/indicators/[id]/period
 *
 * Manually set actual + target for a given (periodKind, periodKey).
 * Used for indicators with computation='manual' or to override a derived
 * value. Marks source='manual'.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { IndicatorSource } from "@/generated/prisma/enums";
import { apiError } from "@/lib/api-errors";

const ManualSchema = z.object({
  periodKind: z.enum(["year", "quarter", "month"]),
  periodKey: z.string().min(1),
  target: z.number().nullable().optional(),
  actual: z.number().nullable().optional(),
  updatedByOfficerId: z.string().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const parsed = ManualSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const row = await prisma.indicatorPeriod.upsert({
      where: {
        indicatorId_periodKind_periodKey: {
          indicatorId: numericId,
          periodKind: b.periodKind,
          periodKey: b.periodKey,
        },
      },
      create: {
        indicatorId: numericId,
        periodKind: b.periodKind,
        periodKey: b.periodKey,
        target: b.target ?? null,
        actual: b.actual ?? null,
        source: IndicatorSource.manual,
        updatedByOfficerId: b.updatedByOfficerId ?? null,
      },
      update: {
        target: b.target ?? undefined,
        actual: b.actual ?? undefined,
        source: IndicatorSource.manual,
        updatedByOfficerId: b.updatedByOfficerId ?? undefined,
      },
    });
    return NextResponse.json({ row });
  } catch (e) {
    return apiError(e);
  }
}
