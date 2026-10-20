import { SendRawEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../aws/client";
import { uploadImageToS3, sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

/**
 * Builds an RFC-compliant MIME multipart message with both HTML/Plain-text alternative parts
 * and an image attachment so the QR code appears in the email client's attachments bar.
 */
function buildMimeWithAttachment(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
    attachment: { filename: string; content: Buffer; contentType: string }
): Buffer {
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const altBoundary = `----=_Alt_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Wrap base64 content at 76 characters per line (RFC 2045 standard)
    const base64Attachment = attachment.content.toString("base64").replace(/(.{76})/g, "$1\r\n");

    const lines = [
        `From: ${from}`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
        ``,
        `--${altBoundary}`,
        `Content-Type: text/plain; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        text,
        ``,
        `--${altBoundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        html,
        ``,
        `--${altBoundary}--`,
        ``,
        `--${boundary}`,
        `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        base64Attachment,
        ``,
        `--${boundary}--`,
    ];

    return Buffer.from(lines.join("\r\n"), "utf-8");
}

export async function sendQREmail(to: string, user_name: string, qrCode: Buffer) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://nexusvyoma.islec.edu.in";
    const qrCodeBase64 = qrCode.toString("base64");
    const subject = `Your Official Entry Pass & QR Code — Nexus Vyoma 2026`;

    // Attempt to host the QR on S3 so webmail clients (like Gmail) render the in-body image without base64 stripping
    let qrImageUrl = `data:image/png;base64,${qrCodeBase64}`;
    try {
        const s3Upload = await uploadImageToS3(qrCode, "png", "image/png", "qr-codes");
        if (s3Upload.success && s3Upload.url) {
            qrImageUrl = s3Upload.url;
        }
    } catch {
        // Fallback to data URI if S3 is unavailable
    }

    const textContent = `NEXUS VYOMA 2026 — OFFICIAL ENTRY PASS & QR CODE

Hello ${user_name},

Your registration for Nexus Vyoma 2026 has been confirmed!

Your official entry pass QR code is attached to this email (nexus-vyoma-entry-pass.png).
Please download and save it on your phone, or have this email ready when you arrive at the fest.

EVENT DETAILS:
• Attendee: ${user_name}
• Registered Email: ${to}
• Event: Nexus Vyoma 2026 — A Three-Day Inter-College Fest
• Dates: 10 · 11 · 12 November 2026
• Venue: ISL Engineering College, Bandlaguda, Chandrayangutta, Hyderabad

GATE ENTRY INSTRUCTIONS:
1. Present your QR code at the registration desk or security gate.
2. Our team will scan your pass to issue your official attendee festival badge.
3. Keep your badge with you throughout all 3 days of events, workshops, and concerts.

Explore schedules, event venues, and updates on the fest portal:
${baseUrl}/events

— Team Nexus Vyoma
ISL Engineering College, Hyderabad
Ideas • People • Culture • Beyond`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E5E7EB; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #05070D; min-height: 100vh; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #0B0E17; border: 1px solid #1F2636; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75);">
          
          <!-- Fiery Brand Gradient Accent Stripe -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 50%, #D8182B 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header: Typographic Brand Identity -->
          <tr>
            <td align="center" style="padding: 36px 32px 20px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 5px 14px; background-color: rgba(255, 106, 0, 0.12); border: 1px solid rgba(255, 106, 0, 0.35); border-radius: 999px; margin-bottom: 12px;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #FF6A00; text-transform: uppercase;">ISL ENGINEERING COLLEGE</span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">
                      NEXUS <span style="color: #FF6A00;">VYOMA</span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #9CA3AF; text-transform: uppercase; margin-top: 6px;">
                      A THREE-DAY INTER-COLLEGE FEST
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="height: 1px; background-color: #1A2030; width: 100%;"></div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px 24px 32px; text-align: left;">
              
              <!-- Badge: Official Pass -->
              <div style="margin-bottom: 16px; text-align: center;">
                <span style="display: inline-block; padding: 4px 14px; background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #34D399; text-transform: uppercase;">
                  &#10003; OFFICIAL ENTRY PASS &bull; GATE ACCESS
                </span>
              </div>

              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px; line-height: 1.3; text-align: center;">
                Your Entry Pass is Ready!
              </h1>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #9CA3AF; text-align: center;">
                Hello <strong style="color: #FFFFFF;">${user_name}</strong>, your digital QR pass has been generated. Present this pass at the gate on <strong style="color: #FF6A00;">10 &bull; 11 &bull; 12 November 2026</strong>.
              </p>

              <!-- Central QR Code Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #030407; border: 1px solid #1F2636; border-radius: 16px; padding: 24px 20px; text-align: center;">
                      <tr>
                        <td align="center">
                          <!-- White Container for High-Contrast QR Scanning -->
                          <div style="background-color: #FFFFFF; border-radius: 12px; padding: 14px; display: inline-block; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);">
                            <img src="${qrImageUrl}" alt="Nexus Vyoma 2026 QR Entry Pass" width="220" height="220" style="display: block; width: 220px; height: 220px; max-width: 100%; border: 0; outline: none; margin: 0 auto;" />
                          </div>
                          
                          <!-- Attendee Name & Pass Instructions -->
                          <div style="margin-top: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
                            ${user_name}
                          </div>
                          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #9CA3AF; margin-top: 4px;">
                            ${to}
                          </div>

                          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #1A2030; font-size: 11px; line-height: 16px; color: #6B7280;">
                            &#128247; Also attached to this email as <strong style="color: #D1D5DB;">nexus-vyoma-entry-pass.png</strong> for offline access.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Event Details Summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="background-color: #030407; border: 1px solid #1F2636; border-left: 3px solid #FF6A00; border-radius: 12px; padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF6A00; text-transform: uppercase; margin-bottom: 10px;">
                      FESTIVAL INFORMATION
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 3px 0; color: #9CA3AF; width: 80px;">Event:</td>
                        <td style="padding: 3px 0; font-weight: 600; color: #FFFFFF;">Nexus Vyoma 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #9CA3AF;">Dates:</td>
                        <td style="padding: 3px 0; font-weight: 600; color: #FF6A00;">10 &bull; 11 &bull; 12 NOV 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #9CA3AF;">Venue:</td>
                        <td style="padding: 3px 0; color: #E5E7EB;">ISL Engineering College, Hyderabad</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Gate Entry Notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: rgba(255, 106, 0, 0.08); border: 1px solid rgba(255, 106, 0, 0.25); border-radius: 10px; padding: 14px 16px;">
                    <div style="font-size: 12px; line-height: 18px; color: #FDBA74;">
                      <strong>Gate Entry Notice:</strong> Please carry a valid college/student photo ID along with this QR pass. Once scanned at the entry desk, you will receive your physical festival wristband/badge.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}/events" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 100%); color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(255, 106, 0, 0.35);">
                      EXPLORE EVENTS &amp; SCHEDULE &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #6B7280; text-align: center;">
                Need assistance? Contact the Nexus Vyoma Helpdesk via the official fest portal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 28px 32px; background-color: #080A12; border-top: 1px solid #151A27; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #E5E7EB; text-transform: uppercase; margin-bottom: 4px;">
                NEXUS VYOMA 2026
              </div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                ISL Engineering College &bull; Bandlaguda, Chandrayangutta, Hyderabad &bull; 10&ndash;12 Nov 2026
              </div>
              <div style="font-size: 11px; color: #4B5563;">
                Ideas &bull; People &bull; Culture &bull; Beyond
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const from = '"Team Nexus Vyoma" <no-reply@islec.edu.in>';
    let messageId: string | null = null;
    let sendError: unknown = null;

    // Send with SendRawEmailCommand so the QR PNG is included as an official download attachment
    try {
        const rawMessage = buildMimeWithAttachment(
            from,
            to,
            subject,
            textContent,
            htmlContent,
            {
                filename: "nexus-vyoma-entry-pass.png",
                content: qrCode,
                contentType: "image/png",
            }
        );

        const response = await sesClient.send(
            new SendRawEmailCommand({
                RawMessage: {
                    Data: rawMessage,
                },
            })
        );

        messageId = response.MessageId || null;
    } catch (rawError) {
        console.warn("SES SendRawEmail failed, falling back to standard sendEmailWithSES:", rawError);
        const fallbackRes = await sendEmailWithSES(to, subject, htmlContent, textContent);
        if (!fallbackRes.success) {
            return {
                success: false,
                error: fallbackRes.error,
                messageId: null,
            };
        }
        messageId = fallbackRes.messageId ?? null;
        sendError = rawError;
    }

    if (!messageId) {
        return {
            success: false,
            error: sendError || "Failed to obtain SES message ID",
            messageId: null,
        };
    }

    // Save the email details to the database with type "qr_code"
    await EmailSchema.create({
        email: to,
        type: "ticket_qr",
        message_id: messageId,
        subject,
    });

    return {
        success: true,
        error: null,
        messageId: messageId,
    };
}