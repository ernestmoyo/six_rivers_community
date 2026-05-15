/**
 * POST /api/student-accounts/apply
 *
 * Receives a SRATA student's application for portal access. Creates (or
 * upserts) a StudentAccount in status='pending' — an admin then approves
 * it via /api/student-accounts/[id]/approve (Phase 3 follow-up).
 *
 * Currently this stores the application as a StudentAccount linked to a
 * matching Person (looked up by dedupHash of name + email). If no Person
 * exists yet, one is created.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-errors";

const ApplySchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  cohortYear: z.number().int().min(2024).max(2100),
});

function computeDedupHash(fullName: string, phone: string | undefined): string {
  // (fullName + dob + guardianPhone) per the project plan — when dob isn't
  // available (portal apply form), we use email as the next-best identifier.
  const input = `${fullName.trim().toLowerCase()}|${phone?.trim() ?? ""}`;
  return createHash("sha256").update(input).digest("hex");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const parsed = ApplySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const dedupHash = computeDedupHash(b.fullName, b.phone);

    // Reuse existing person if their hash matches; create otherwise.
    const person = await prisma.person.upsert({
      where: { dedupHash },
      create: {
        fullName: b.fullName,
        phone: b.phone ?? null,
        dedupHash,
      },
      update: {
        phone: b.phone ?? undefined,
      },
    });

    // Application stored as StudentAccount.pending. passwordHash is empty
    // until the admin approves and sets a credential.
    const existing = await prisma.studentAccount.findUnique({
      where: { personId: person.id },
    });

    const account = existing
      ? await prisma.studentAccount.update({
          where: { id: existing.id },
          data: {
            email: b.email.toLowerCase(),
          },
        })
      : await prisma.studentAccount.create({
          data: {
            personId: person.id,
            email: b.email.toLowerCase(),
            passwordHash: "",
            status: "pending",
          },
        });

    return NextResponse.json({
      ok: true,
      account: { id: account.id, status: account.status, email: account.email },
    });
  } catch (e) {
    return apiError(e);
  }
}
