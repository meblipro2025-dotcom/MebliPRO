import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  pdfBuffer?: Buffer;
  pdfFilename?: string;
}

export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP not configured — email skipped");
    return false;
  }

  try {
    const attachments = opts.pdfBuffer
      ? [{ filename: opts.pdfFilename || "Заявка_MebliPRO.pdf", content: opts.pdfBuffer, contentType: "application/pdf" }]
      : [];

    await transporter.sendMail({
      from: `"Mebli-PRO" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments,
    });

    console.log(`✅ Email sent to ${opts.to}`);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err);
    return false;
  }
}

export function buildLeadEmailHTML(data: { name: string; phone: string; projectType: string; notes?: string }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#fff;padding:0;">
      <div style="background:#D4AF37;padding:16px 24px;">
        <h1 style="margin:0;font-size:20px;color:#000;letter-spacing:3px;">MEBLI-PRO</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#D4AF37;font-size:18px;">🚀 Нова заявка!</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #333;">Клієнт</td><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:bold;">${data.name}</td></tr>
          <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #333;">Телефон</td><td style="padding:8px 0;border-bottom:1px solid #333;font-weight:bold;">${data.phone}</td></tr>
          <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #333;">Категорія</td><td style="padding:8px 0;border-bottom:1px solid #333;">${data.projectType}</td></tr>
          ${data.notes ? `<tr><td style="color:#888;padding:8px 0;">Примітки</td><td style="padding:8px 0;">${data.notes}</td></tr>` : ''}
        </table>
        <p style="color:#666;font-size:12px;margin-top:24px;">PDF з деталями у вкладенні.</p>
      </div>
      <div style="background:#111;padding:12px 24px;text-align:center;font-size:11px;color:#666;">
        +380 93 143 18 43 • @devcraft_ua • Київ, Лівий берег
      </div>
    </div>
  `;
}
