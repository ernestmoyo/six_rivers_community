/**
 * POST /api/enrollments/[id]/exit
 *
 * Records an exit — dropout, graduation, transfer, or withdrawal. This is
 * how dropouts become first-class data; the cohort view filters off the
 * resulting status + endedAt.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@/generated/prisma/enums";
import { apiError } from "@/lib/api-errors";

const ExitSchema = z.object({
  status: z
    .enum([
      EnrollmentStatus.dropped_out,
      EnrollmentStatus.graduated,
      EnrollmentStatus.transferred,
      EnrollmentStatus.withdrawn,
    ])
    .default(EnrollmentStatus.dropped_out),
  endedAt: z.string().date().optional(),
  exitReason: z.string().optional(),
  exitReasonCategory: z.string().optional(),
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
    const parsed = ExitSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const row = await prisma.enrollment.update({
      where: { id: numericId },
      data: {
        status: b.status,
        endedAt: b.endedAt ? new Date(b.endedAt) : new Date(),
        exitReason: b.exitReason ?? undefined,
        exitReasonCategory: b.exitReasonCategory ?? undefined,
      },
    });
    return NextResponse.json({ row });
  } catch (e) {
    return apiError(e);
  }
}
