import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { villageName, incidentType, severity, estimatedHerdSize, description, reportedBy, date } = body;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmails = process.env.CATTLE_NOTIFY_EMAILS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Email not configured. Set SMTP_USER and SMTP_PASS in .env" },
        { status: 500 }
      );
    }

    if (!notifyEmails) {
      return NextResponse.json(
        { error: "No notification recipients configured. Set CATTLE_NOTIFY_EMAILS in .env" },
        { status: 500 }
      );
    }

    const recipients = notifyEmails.split(",").map((e) => e.trim()).filter(Boolean);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    const severityColor = severity === "high" ? "#dc2626" : severity === "moderate" ? "#f59e0b" : "#22c55e";
    const severityLabel = severity.charAt(0).toUpperCase() + severity.slice(1);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">Cattle Incident Alert</h2>
          <p style="color: #bbdefb; margin: 4px 0 0;">Six Rivers Community Intelligence Platform</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <div style="display: inline-block; padding: 4px 12px; border-radius: 4px; background: ${severityColor}; color: white; font-weight: bold; font-size: 14px; margin-bottom: 16px;">
            ${severityLabel} Severity
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 140px;">Date</td>
              <td style="padding: 8px 0; font-weight: 600;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Village</td>
              <td style="padding: 8px 0; font-weight: 600;">${villageName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Incident Type</td>
              <td style="padding: 8px 0; font-weight: 600;">${incidentType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Est. Herd Size</td>
              <td style="padding: 8px 0; font-weight: 600;">~${estimatedHerdSize}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Reported By</td>
              <td style="padding: 8px 0; font-weight: 600;">${reportedBy}</td>
            </tr>
          </table>
          ${description ? `
            <div style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">Description</p>
              <p style="margin: 4px 0 0; color: #111827;">${description}</p>
            </div>
          ` : ""}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Mbarali District — Adjacent to Ruaha National Park<br/>
            This is an automated notification from the Six Rivers Community Intelligence Platform.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Six Rivers Alert" <${smtpUser}>`,
      to: recipients.join(", "),
      subject: `[${severityLabel}] Cattle Incident — ${villageName} (${incidentType.replace(/_/g, " ")})`,
      html,
    });

    return NextResponse.json({ success: true, recipients: recipients.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cattle notify error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
