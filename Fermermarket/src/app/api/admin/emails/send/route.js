import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  const authUser = await getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN", "MODERATOR"]);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return Response.json({ error: "Yanlış JSON" }, { status: 400 });
  }

  const { to, subject, body: textBody, toName } = body || {};
  if (!to || !textBody) return Response.json({ error: "To və body tələb olunur" }, { status: 400 });

  // Basic email validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(to)) return Response.json({ error: "Yanlış e-poçt ünvanı" }, { status: 400 });

  const replySubject = subject || "(Mövzusuz)";
  const htmlBody = `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
    <div style="background:linear-gradient(135deg,#16a34a,#166534);padding:20px 24px;border-radius:12px 12px 0 0">
      <h1 style="color:#fff;margin:0;font-size:20px">FermerMarket</h1>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
      <p>Salam ${toName || to},</p>
      <div style="margin:16px 0;line-height:1.6">${String(textBody).replace(/\n/g, '<br>')}</div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
      <p style="color:#6b7280;font-size:13px">
        Bu e-poçt FermerMarket admin panelindən göndərilmişdir.<br>
        FermerMarket — <a href="https://fermermarket.az" style="color:#16a34a">fermermarket.az</a>
      </p>
    </div>
  </div>`;

  const sendResult = await sendEmail({ to, subject: replySubject, html: htmlBody });
  if (sendResult?.error) {
    return Response.json({ error: "E-poçt göndərilə bilmədi: " + sendResult.error }, { status: 500 });
  }

  try {
    await prisma.incomingEmail.create({
      data: {
        fromEmail: process.env.EMAIL_FROM || "info@fermermarket.az",
        fromName: "FermerMarket",
        toEmail: to,
        subject: replySubject,
        bodyText: textBody,
        receivedAt: new Date(),
        isRead: true,
        isReplied: false,
      },
    });
  } catch (err) {
    console.warn("Failed to log sent email:", err?.message || err);
  }

  return Response.json({ success: true, message: "E-poçt göndərildi" });
}
