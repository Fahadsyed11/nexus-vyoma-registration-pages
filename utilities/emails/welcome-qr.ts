import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendWelcomeEmail(user_id: string, to: string, user_name: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexusvyoma.com";

    const subject = `Welcome to Nexus Vyoma 2026, ${user_name}!`;

    const textContent = `NEXUS VYOMA 2026 — REGISTRATION CONFIRMED

Hello ${user_name},

Welcome to Nexus Vyoma 2026! Your registration has been confirmed for the three-day inter-college fest organized by ISL Engineering College, Hyderabad.

FEST DETAILS:
• Fest: Nexus Vyoma 2026
• Dates: 10 · 11 · 12 November 2026
• Venue: ISL Engineering College, Hyderabad
• Registered Email: ${to}

Visit the portal to explore events, technical challenges, and live entertainment arenas:
${baseUrl}/events

— Team Nexus Vyoma
ISL Engineering College, Hyderabad
Ideas • People • Culture • Beyond`;

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
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; color: #FF6A00; text-transform: uppercase;">ISL ENGINEERING COLLEGE</span>
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">
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
            <td style="padding: 32px 32px 28px 32px; text-align: left;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
                Welcome to the Experience!
              </h1>
              
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 24px; color: #D1D5DB;">
                Hello <strong style="color: #FFFFFF;">${user_name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #9CA3AF;">
                Your registration for <strong style="color: #FFFFFF;">Nexus Vyoma 2026</strong> has been confirmed. Get ready for 3 electrifying days of innovation, competitions, cultural celebrations, and high-octane entertainment.
              </p>

              <!-- Registration Summary Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: #030407; border: 1px solid #1F2636; border-left: 3px solid #FF6A00; border-radius: 12px; padding: 20px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF6A00; text-transform: uppercase; margin-bottom: 12px;">
                      REGISTRATION DETAILS
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF; width: 90px;">Attendee:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #FFFFFF;">${user_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Email:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E5E7EB;">${to}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Dates:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #FF6A00;">10 · 11 · 12 NOV 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9CA3AF;">Venue:</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #E5E7EB;">ISL Engineering College, Hyderabad</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}/events" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 100%); color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(255, 106, 0, 0.35);">
                      EXPLORE EVENTS &amp; SCHEDULE &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 12px; line-height: 18px; color: #6B7280; text-align: center;">
                Need help or have questions? Contact us through the official fest portal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #080A12; border-top: 1px solid #151A27; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #E5E7EB; text-transform: uppercase; margin-bottom: 4px;">
                NEXUS VYOMA 2026
              </div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                Bandlaguda, Chandrayangutta, Hyderabad &bull; 10–12 Nov 2026
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
</html>
`;

    const { error, messageId, success } = await sendEmailWithSES(to, subject, htmlContent, textContent);

    if (!success) {
        return {
            success: false,
            error: error,
            messageId: messageId,
        }
    }

    // Save the email details to the database
    await EmailSchema.create({
        email: to,
        type: "new_user",
        message_id: messageId,
        user_id,
        subject,
    })

    return {
        success: true,
        error: null,
        messageId: messageId,
    }
}
