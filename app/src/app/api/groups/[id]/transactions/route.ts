/**
 * POST /api/groups/[id]/transactions
 *
 * Record a financial event against the group ledger.
 * Period is 'YYYY-MM'.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { TransactionKind } from "@/generated/prisma/enums";
import { apiError } from "@/lib/api-errors";

const CreateSchema = z.object({
  periodYearMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: "periodYearMonth must be YYYY-MM",
  }),
  kind: z.nativeEnum(TransactionKind),
  amountTSh: z.number().nonnegative(),
  category: z.string().optional(),
  narrative: z.string().optional(),
  recordedByOfficerId: z.string().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const groupId = Number(id);
    if (!Number.isInteger(groupId)) {
      return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
    }
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const row = await prisma.groupTransaction.create({
      data: {
        groupId,
        periodYearMonth: b.periodYearMonth,
        kind: b.kind,
        amountTSh: b.amountTSh,
        category: b.category ?? null,
        narrative: b.narrative ?? null,
        recordedByOfficerId: b.recordedByOfficerId ?? null,
      },
    });
    return NextResponse.json({ row });
  } catch (e) {
    return apiError(e);
  }
}
