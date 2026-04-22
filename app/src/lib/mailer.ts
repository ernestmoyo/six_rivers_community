import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
}

interface SendMailResult {
  sent: boolean;
  recipients: string[];
  error?: string;
}

function parseList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const TEAM_EMAILS = {
  lilian: process.env.LILIAN_EMAIL ?? "",
  edna: process.env.EDNA_EMAIL ?? "",
  mary: process.env.MARY_EMAIL ?? "",
  all: parseList(process.env.TEAM_EMAILS),
  cattleNotify: parseList(process.env.CATTLE_NOTIFY_EMAILS),
};

export function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendMail(opts: SendMailOptions): Promise<SendMailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, recipients: [], error: "SMTP not configured" };
  }
  const smtpUser = process.env.SMTP_USER!;
  const toList = Array.isArray(opts.to) ? opts.to : [opts.to];
  const recipients = toList.filter(Boolean);
  if (recipients.length === 0) {
    return { sent: false, recipients: [], error: "No recipients specified" };
  }

  try {
    await transporter.sendMail({
      from: `"Six Rivers Alert" <${smtpUser}>`,
      to: recipients.join(", "),
      cc: opts.cc
        ? (Array.isArray(opts.cc) ? opts.cc : [opts.cc]).filter(Boolean).join(", ")
        : undefined,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments,
    });
    return { sent: true, recipients };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SMTP error";
    return { sent: false, recipients, error: message };
  }
}

// ─── Reusable HTML templates ───

const baseStyle = `
  font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;
`;

export function brandHeader(title: string, subtitle: string): string {
  return `
    <div style="background: #071637; padding: 20px 24px; border-radius: 8px 8px 0 0;">
      <h2 style="color: #ffffff; margin: 0; font-weight: 600; letter-spacing: -0.01em;">${title}</h2>
      <p style="color: #EC5C2B; margin: 4px 0 0; font-weight: 500;">${subtitle}</p>
    </div>
  `;
}

export function brandFooter(): string {
  return `
    <div style="padding: 12px 24px; background: #FAF9F5; border-top: 1px solid #DDDDDD; border-radius: 0 0 8px 8px;">
      <p style="margin: 0; color: #5A5A57; font-size: 11px; text-align: center;">
        Six Rivers Africa · Community Intelligence Platform · Automated notification
      </p>
    </div>
  `;
}

export function kvRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 6px 0; color: #6b7280; width: 160px;">${label}</td>
      <td style="padding: 6px 0; font-weight: 600; color: #071637;">${value}</td>
    </tr>
  `;
}
