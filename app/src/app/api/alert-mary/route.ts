import { NextRequest, NextResponse } from "next/server";
import { sendMail, brandHeader, brandFooter, kvRow, TEAM_EMAILS } from "@/lib/mailer";

interface AlertPayload {
  kind: "farmer_dropout" | "iga_struggling" | "iga_inactive";
  title: string;
  summary: string;
  details?: Record<string, string>;
  reportedBy?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AlertPayload;

    if (!body.kind || !body.title) {
      return NextResponse.json({ error: "kind and title are required" }, { status: 400 });
    }

    if (!TEAM_EMAILS.mary) {
      return NextResponse.json({ error: "MARY_EMAIL not configured" }, { status: 500 });
    }

    const kindLabel = {
      farmer_dropout: "Farmer Dropout",
      iga_struggling: "IGA Group Struggling",
      iga_inactive: "IGA Group Inactive",
    }[body.kind];

    const accent =
      body.kind === "farmer_dropout"
        ? "#EC5C2B"
        : body.kind === "iga_struggling"
          ? "#f59e0b"
          : "#dc2626";

    const detailRows = body.details
      ? Object.entries(body.details).map(([k, v]) => kvRow(k, v)).join("")
      : "";

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${brandHeader(`${kindLabel} · Attention needed`, "Impact Manager alert")}
        <div style="border: 1px solid #DDDDDD; border-top: none; padding: 24px;">
          <div style="display: inline-block; padding: 4px 12px; border-radius: 4px; background: ${accent}; color: white; font-weight: 600; font-size: 13px; margin-bottom: 12px;">
            ${kindLabel}
          </div>
          <h3 style="color: #071637; margin: 0 0 8px; font-weight: 600;">${body.title}</h3>
          <p style="color: #141413; margin: 0 0 16px; line-height: 1.5;">${body.summary}</p>
          ${detailRows ? `<table style="width: 100%; border-collapse: collapse;">${detailRows}</table>` : ""}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #DDDDDD;" />
          <p style="color: #6B6B68; font-size: 12px; margin: 0;">
            ${body.reportedBy ? `Flagged by ${body.reportedBy}` : "Automated flag from the platform"}. Review at the next planning cycle.
          </p>
        </div>
        ${brandFooter()}
      </div>
    `;

    const result = await sendMail({
      to: TEAM_EMAILS.mary,
      subject: `[Impact Alert] ${kindLabel} · ${body.title}`,
      html,
    });

    if (!result.sent) {
      return NextResponse.json({ error: result.error ?? "Mail send failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, recipient: TEAM_EMAILS.mary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
