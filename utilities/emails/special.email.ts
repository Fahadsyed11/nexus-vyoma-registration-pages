import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

export async function sendSpecialEmail(
  to: string,
  user_name: string,
  registrant_name?: string,
  registrant_email?: string
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexusvyoma.islec.edu.in";
  const subject = `[Nexus Vyoma Alert] Special Registration Notification — ${user_name}`;

  const textContent = `NEXUS VYOMA 2026 — SPECIAL REGISTRATION ALERT

Hello ${user_name},

A special attendee registration has just been recorded on the Nexus Vyoma portal.

NOTIFICATION DETAILS:
• Recipient: ${user_name} (${to})
${registrant_name ? `• Registrant Name: ${registrant_name}\n` : ""}${registrant_email ? `• Registrant Email: ${registrant_email}\n` : ""}• System Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST

Please check the database or administrative console for details.

— Nexus Vyoma System Notification
ISL Engineering College, Hyderabad`;

  const htmlContent = `
<!DOCTYPE html>
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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #0B0E17; border: 1px solid #1F2636; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7);">
          
          <!-- Fiery Brand Gradient Accent Stripe -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 50%, #D8182B 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header: Pure Typographic Brand Identity (Zero external image dependencies) -->
          <tr>
            <td align="center" style="padding: 36px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 5px 14px; background-color: rgba(255, 106, 0, 0.12); border: 1px solid rgba(255, 106, 0, 0.35); border-radius: 999px; margin-bottom: 12px;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #FF6A00; text-transform: uppercase;">ORGANIZER NOTIFICATION</span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">
                      NEXUS <span style="color: #FF6A00;">VYOMA</span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #9CA3AF; text-transform: uppercase; margin-top: 6px;">
                      ISL ENGINEERING COLLEGE, HYDERABAD
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
            <td style="padding: 32px 32px 28px 32px; text-align: left;">
              <div style="display: inline-block; padding: 4px 10px; background-color: rgba(255, 59, 46, 0.15); border: 1px solid rgba(255, 59, 46, 0.4); border-radius: 6px; margin-bottom: 14px;">
                <span style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #FF3B2E; text-transform: uppercase;">SPECIAL ALERT</span>
              </div>

              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
                Special Attendee Registered
              </h1>
              
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 24px; color: #D1D5DB;">
                Hello <strong style="color: #FFFFFF;">${user_name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #9CA3AF;">
                A special registration tracking trigger has fired. A targeted registrant has just completed registration on the Nexus Vyoma portal.
              </p>

              <!-- Alert Details Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: #030407; border: 1px solid #1F2636; border-left: 3px solid #FF3B2E; border-radius: 12px; padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF3B2E; text-transform: uppercase; margin-bottom: 10px;">
                      EVENT LOG
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF; width: 110px;">Recipient:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #FFFFFF;">${user_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Timestamp:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #FF6A00; font-family: monospace;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
                      </tr>
                      ${registrant_name
      ? `<tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Registrant:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #FFFFFF;">${registrant_name}</td>
                      </tr>`
      : ""
    }
                      ${registrant_email
      ? `<tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Registrant Email:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E5E7EB;">${registrant_email}</td>
                      </tr>`
      : ""
    }
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Status:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #34D399; font-weight: 600;">Recorded in Database</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                This is an automated internal notification for Nexus Vyoma 2026 organizers.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #080A12; border-top: 1px solid #151A27; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #E5E7EB; text-transform: uppercase; margin-bottom: 4px;">
                NEXUS VYOMA 2026
              </div>
              <div style="font-size: 12px; color: #6B7280;">
                ISL Engineering College, Hyderabad &bull; 10–12 Nov 2026
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const { error, messageId, success } = await sendEmailWithSES(
      to,
      subject,
      htmlContent,
      textContent
    );

    if (success && messageId) {
      await EmailSchema.create({
        email: to,
        type: "special_notification",
        message_id: messageId,
        subject,
      }).catch(() => null);
    } else {
      console.warn("⚠️ Failed to send special email notification:", error);
    }
  } catch (err) {
    console.error("⚠️ Error in sendSpecialEmail:", err);
  }
}