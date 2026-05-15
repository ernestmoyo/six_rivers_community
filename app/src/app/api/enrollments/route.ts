/**
 * GET   /api/enrollments      — list with filters
 * POST  /api/enrollments      — create (idempotent on unique constraint)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { apiError } from "@/lib/api-errors";

const CreateSchema = z
  .object({
    activityCode: z.string().min(1),
    cohortYear: z.number().int().min(2000).max(2100),
    personId: z.number().int().optional(),
    groupId: z.number().int().optional(),
    schoolId: z.number().int().optional(),
    status: z.nativeEnum(EnrollmentStatus).optional(),
    startedAt: z.string().datetime().optional(),
    exitReason: z.string().optional(),
    exitReasonCategory: z.string().optional(),
    metaJson: z.record(z.string(), z.unknown()).optional(),
  })
  .refine(
    (b) =>
      (b.personId ? 1 : 0) + (b.groupId ? 1 : 0) + (b.schoolId ? 1 : 0) === 1,
    {
      message: "Exactly one of personId, groupId, schoolId is required",
    },
  );

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const activityCode = url.searchParams.get("activityCode");
    const cohortYear = url.searchParams.get("cohortYear");
    const status = url.searchParams.get("status") as EnrollmentStatus | null;
    const sector = url.searchParams.get("sector");
    const personId = url.searchParams.get("personId");
    const groupId = url.searchParams.get("groupId");

    const activity = activityCode
      ? await prisma.activity.findUnique({ where: { code: activityCode } })
      : null;
    if (activityCode && !activity) {
      return NextResponse.json(
        { error: `Activity '${activityCode}' not found` },
        { status: 404 },
      );
    }

    const rows = await prisma.enrollment.findMany({
      where: {
        activityId: activity?.id,
        cohortYear: cohortYear ? Number(cohortYear) : undefined,
        status: status ?? undefined,
        personId: personId ? Number(personId) : undefined,
        groupId: groupId ? Number(groupId) : undefined,
        activity: sector
          ? { OR: [{ sectorScope: sector as never }, { sectorScope: "both" }] }
          : undefined,
      },
      include: {
        activity: { select: { code: true, name: true, sectorScope: true } },
        person: {
          select: {
            id: true,
            fullName: true,
            sex: true,
            age: true,
            schoolClass: true,
            operationalLocation: { select: { id: true, displayName: true } },
          },
        },
        group: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
      },
      orderBy: [{ cohortYear: "desc" }, { createdAt: "desc" }],
      take: 500,
    });

    return NextResponse.json({ rows });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const json = await req.json();
    const parsed = CreateSchema.safeParse(json);
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

    // Manual idempotency: the unique constraint
    // (activityId, cohortYear, personId, groupId, schoolId) means a duplicate
    // submission silently returns the existing row.
    const existing = await prisma.enrollment.findFirst({
      where: {
        activityId: activity.id,
        cohortYear: b.cohortYear,
        personId: b.personId ?? null,
        groupId: b.groupId ?? null,
        schoolId: b.schoolId ?? null,
      },
    });
    if (existing) {
      return NextResponse.json({ row: existing, duplicate: true });
    }

    const row = await prisma.enrollment.create({
      data: {
        activityId: activity.id,
        cohortYear: b.cohortYear,
        personId: b.personId ?? null,
        groupId: b.groupId ?? null,
        schoolId: b.schoolId ?? null,
        status: b.status ?? EnrollmentStatus.enrolled,
        startedAt: b.startedAt ? new Date(b.startedAt) : undefined,
        exitReason: b.exitReason ?? null,
        exitReasonCategory: b.exitReasonCategory ?? null,
        metaJson: b.metaJson
          ? (b.metaJson as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });
    return NextResponse.json({ row });
  } catch (e) {
    return apiError(e);
  }
}
