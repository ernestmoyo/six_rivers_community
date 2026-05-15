/**
 * GET  /api/groups   — list groups with optional filters
 * POST /api/groups   — create a group
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { GroupStatus } from "@/generated/prisma/enums";
import { apiError } from "@/lib/api-errors";

const CreateSchema = z.object({
  activityCode: z.string().min(1),
  name: z.string().min(1),
  operationalLocationId: z.number().int().nullable().optional(),
  formedAt: z.string().date().optional(),
  status: z.nativeEnum(GroupStatus).optional(),
  sector: z.string().nullable().optional(),
  leaderPersonId: z.number().int().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const activityCode = url.searchParams.get("activityCode");
    const status = url.searchParams.get("status") as GroupStatus | null;
    const sector = url.searchParams.get("sector");

    const activity = activityCode
      ? await prisma.activity.findUnique({ where: { code: activityCode } })
      : null;
    if (activityCode && !activity) {
      return NextResponse.json(
        { error: `Activity '${activityCode}' not found` },
        { status: 404 },
      );
    }

    const rows = await prisma.group.findMany({
      where: {
        activityId: activity?.id,
        status: status ?? undefined,
        sector: sector ?? undefined,
      },
      include: {
        activity: { select: { code: true, name: true } },
        operationalLocation: { select: { id: true, displayName: true } },
        _count: { select: { memberships: true, transactions: true } },
      },
      orderBy: [{ name: "asc" }],
    });
    return NextResponse.json({ rows });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const activity = await prisma.activity.findUnique({
      where: { code: b.activityCode },
    });
    if (!activity) {
      return NextResponse.json(
        { error: `Activity '${b.activityCode}' not found` },
        { status: 404 },
      );
    }
    const row = await prisma.group.create({
      data: {
        activityId: activity.id,
        name: b.name,
        operationalLocationId: b.operationalLocationId ?? null,
        formedAt: b.formedAt ? new Date(b.formedAt) : null,
        status: b.status ?? GroupStatus.active,
        sector: b.sector ?? null,
        leaderPersonId: b.leaderPersonId ?? null,
        notes: b.notes ?? null,
      },
    });
    return NextResponse.json({ row });
  } catch (e) {
    return apiError(e);
  }
}
