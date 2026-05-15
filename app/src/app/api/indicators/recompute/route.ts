/**
 * POST /api/indicators/recompute
 *
 * Body: { periodKey: 'YYYY' | 'YYYY-Qn' | 'YYYY-MM', periodKind: 'year' | 'quarter' | 'month' }
 *
 * For every active indicator with computation='derived', runs the matching
 * derivation function and upserts an IndicatorPeriod row. Manual indicators
 * are left untouched.
 *
 * Nightly cron should hit this with the current period.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-errors";
import {
  IndicatorComputation,
  IndicatorSource,
} from "@/generated/prisma/enums";
import { getDerivation } from "@/lib/indicator-derivations";
import { Prisma } from "@/generated/prisma/client";

const RecomputeSchema = z.object({
  periodKey: z.string().min(1),
  periodKind: z.enum(["year", "quarter", "month"]),
});

interface Result {
  indicatorCode: string;
  ok: boolean;
  actual?: number;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = RecomputeSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const { periodKey, periodKind } = parsed.data;

    const indicators = await prisma.indicator.findMany({
      where: {
        isActive: true,
        computation: IndicatorComputation.derived,
      },
    });

    const results: Result[] = [];
    for (const ind of indicators) {
      if (!ind.derivedQuery) {
        results.push({
          indicatorCode: ind.code,
          ok: false,
          error: "derived but no derivedQuery set",
        });
        continue;
      }
      const fn = getDerivation(ind.derivedQuery);
      if (!fn) {
        results.push({
          indicatorCode: ind.code,
          ok: false,
          error: `derivation '${ind.derivedQuery}' not registered`,
        });
        continue;
      }
      try {
        const { actual, disaggregation } = await fn(periodKey, periodKind);
        await prisma.indicatorPeriod.upsert({
          where: {
            indicatorId_periodKind_periodKey: {
              indicatorId: ind.id,
              periodKind,
              periodKey,
            },
          },
          create: {
            indicatorId: ind.id,
            periodKind,
            periodKey,
            actual,
            source: IndicatorSource.auto,
            disaggregationJson: disaggregation
              ? (disaggregation as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            computedAt: new Date(),
          },
          update: {
            actual,
            source: IndicatorSource.auto,
            disaggregationJson: disaggregation
              ? (disaggregation as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            computedAt: new Date(),
          },
        });
        results.push({ indicatorCode: ind.code, ok: true, actual });
      } catch (err: unknown) {
        results.push({
          indicatorCode: ind.code,
          ok: false,
          error: err instanceof Error ? err.message : "Unknown",
        });
      }
    }

    return NextResponse.json({
      periodKey,
      periodKind,
      total: indicators.length,
      ok: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
    });
  } catch (e) {
    return apiError(e);
  }
}
