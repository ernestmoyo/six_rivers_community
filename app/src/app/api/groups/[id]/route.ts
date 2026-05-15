/**
 * GET /api/groups/[id]
 *
 * Returns the group with members, transactions, and a running balance
 * (sum: capital + revenue − expense − distribution).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionKind } from "@/generated/prisma/enums";
import { apiError } from "@/lib/api-errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const row = await prisma.group.findUnique({
      where: { id: numericId },
      include: {
        activity: true,
        operationalLocation: true,
        memberships: {
          orderBy: { joinedAt: "asc" },
          include: {
            person: {
              select: { id: true, fullName: true, sex: true, age: true },
            },
          },
        },
        transactions: { orderBy: { periodYearMonth: "asc" } },
      },
    });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Running balance: capital + revenue − expense − distribution.
    let balanceTSh = 0;
    for (const t of row.transactions) {
      const amt = Number(t.amountTSh);
      if (t.kind === TransactionKind.capital || t.kind === TransactionKind.revenue) {
        balanceTSh += amt;
      } else {
        balanceTSh -= amt;
      }
    }

    return NextResponse.json({ row, balanceTSh });
  } catch (e) {
    return apiError(e);
  }
}
