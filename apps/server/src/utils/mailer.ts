import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailInput): Promise<void> {
  if (!transporter) {
    console.log(`[mailer] SMTP not configured, printing email instead:\nTo: ${to}\nSubject: ${subject}\n${html}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@medimpact.local",
    to,
    subject,
    html,
  });
}
