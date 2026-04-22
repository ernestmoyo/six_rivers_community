import { NextRequest, NextResponse } from "next/server";
import { sendMail, brandHeader, brandFooter, kvRow, TEAM_EMAILS } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { villageName, incidentType, severity, estimatedHerdSize, description, reportedBy, date } = body;

    const severityColor = severity === "high" ? "#dc2626" : severity === "moderate" ? "#f59e0b" : "#22c55e";
    const severityLabel = typeof severity === "string" ? severity.charAt(0).toUpperCase() + severity.slice(1) : "Unknown";

    // Route based on severity:
    //   HIGH → Lilian (Usangu lead) + cattleNotify list (defaults)
    //   moderate/low → cattleNotify list only
    const recipients = new Set<string>(TEAM_EMAILS.cattleNotify);
    if (severity === "high" && TEAM_EMAILS.lilian) recipients.add(TEAM_EMAILS.lilian);
    const to = Array.from(recipients);

    if (to.length === 0) {
      return NextResponse.json(
        { error: "No notification recipients configured." },
        { status: 500 }
      );
    }

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${brandHeader("Cattle Incident Alert", "Six Rivers Community Intelligence Platform")}
        <div style="border: 1px solid #DDDDDD; border-top: none; padding: 24px;">
          <div style="display: inline-block; padding: 4px 12px; border-radius: 4px; background: ${severityColor}; color: white; font-weight: 600; font-size: 13px; margin-bottom: 16px;">
            ${severityLabel} severity
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            ${kvRow("Date", date ?? "—")}
            ${kvRow("Village", villageName ?? "—")}
            ${kvRow("Incident type", typeof incidentType === "string" ? incidentType.replace(/_/g, " ") : "—")}
            ${kvRow("Est. herd size", estimatedHerdSize ? `~${estimatedHerdSize}` : "—")}
            ${kvRow("Reported by", reportedBy ?? "Field Officer")}
          </table>
          ${description ? `
            <div style="margin-top: 16px; padding: 12px; background: #FAF9F5; border-radius: 6px; border-left: 3px solid #EC5C2B;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Description</p>
              <p style="margin: 6px 0 0; color: #141413;">${description}</p>
            </div>
          ` : ""}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #DDDDDD;" />
          <p style="color: #6B6B68; font-size: 12px; margin: 0;">
            Mbarali District · Adjacent to Ruaha National Park
            ${severity === "high" ? "<br/><strong style='color:#dc2626'>This is a HIGH-severity alert and has been sent to the Usangu lead directly.</strong>" : ""}
          </p>
        </div>
        ${brandFooter()}
      </div>
    `;

    const result = await sendMail({
      to,
      subject: `[${severityLabel}] Cattle Incident · ${villageName ?? "(no village)"} · ${typeof incidentType === "string" ? incidentType.replace(/_/g, " ") : ""}`,
      html,
    });

    if (!result.sent) {
      return NextResponse.json({ error: result.error ?? "Mail send failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, recipients: result.recipients.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
