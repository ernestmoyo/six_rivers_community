/**
 * GET /api/indicators
 *
 * Returns the indicator catalog with the latest IndicatorPeriod per
 * indicator, joined to programme/activity/tocNode.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-errors";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const programmeCode = url.searchParams.get("programmeCode");
    const periodKey = url.searchParams.get("periodKey");

    const indicators = await prisma.indicator.findMany({
      where: {
        isActive: true,
        programme: programmeCode ? { code: programmeCode } : undefined,
      },
      include: {
        programme: { select: { code: true, name: true } },
        activity: { select: { code: true, name: true } },
        tocNode: { select: { code: true, level: true, statement: true } },
        periods: {
          where: periodKey ? { periodKey } : undefined,
          orderBy: { periodKey: "desc" },
          take: periodKey ? undefined : 1,
        },
      },
      orderBy: [{ programmeId: "asc" }, { code: "asc" }],
    });
    return NextResponse.json({ indicators });
  } catch (e) {
    return apiError(e);
  }
}
