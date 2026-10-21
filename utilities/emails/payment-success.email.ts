import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

// Escapes external dynamic strings before placing them inside HTML
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface PaymentSuccessOptions {
  payment_id?: string | null;
  payment_method?: string | null;
  item_description?: string;
}

export async function sendEmailToPaymentSuccess(
  to: string,
  user_name: string,
  order_id: string,
  amount: number,
  payment_id?: string | null,
  options?: PaymentSuccessOptions
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://nexusvyoma.islec.edu.in";
  const formattedAmount = Number(amount || 0).toLocaleString("en-IN");
  const portalUrl = `${baseUrl}/register/enroll-event`;

  const safeUserName = escapeHtml(user_name || "Attendee");
  const safeOrderId = escapeHtml(order_id || "N/A");
  const safePaymentId = escapeHtml(payment_id || "CF_VERIFIED");
  const paymentMethod = options?.payment_method?.trim() || "Online Gateway (Cashfree)";
  const itemDescription =
    options?.item_description?.trim() || "Nexus Vyoma 2026 Registration & Entry Pass";

  const paymentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const subject = `Payment Confirmed: Nexus Vyoma 2026 Registration [Order #${order_id}]`;

  const textContent = `NEXUS VYOMA 2026 — PAYMENT RECEIPT & CONFIRMATION

Hello ${user_name},

Thank you! Your payment for Nexus Vyoma 2026 has been successfully processed and confirmed.

TRANSACTION RECEIPT:
• Attendee: ${user_name}
• Order ID: ${order_id}
• Payment Ref ID: ${payment_id || "CF_VERIFIED"}
• Item Description: ${itemDescription}
• Amount Paid: ₹${formattedAmount}
• Payment Method: ${paymentMethod}
• Date & Time: ${paymentDate}
• Status: Completed / Verified

NEXT STEPS:
Your official registration and pass access are now active. You can browse, enroll in competitions, or view your schedule on the attendee portal:
${portalUrl}

FESTIVAL SCHEDULE:
• Dates: 10 · 11 · 12 November 2026
• Venue: ISL Engineering College Campus, Bandlaguda, Chandrayangutta, Hyderabad

Need any assistance? Reply directly to this email or reach out to our helpdesk.

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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #0B0E17; border: 1px solid #1F2636; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75);">
          
          <!-- Accent Stripe: Emerald to Lime Green to Brand Deep Orange -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #10B981 0%, #98D800 50%, #FF6A00 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header: Brand Identity -->
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

          <!-- Success Icon & Status Banner -->
          <tr>
            <td align="center" style="padding: 28px 32px 12px 32px;">
              <!-- Green Circle Check Badge -->
              <div style="width: 56px; height: 56px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.12); border: 2px solid #10B981; margin: 0 auto 16px auto; text-align: center; line-height: 54px;">
                <span style="font-size: 26px; color: #10B981;">&#10003;</span>
              </div>
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; margin-bottom: 10px;">
                <span style="font-family: monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #34D399; text-transform: uppercase;">PAYMENT SUCCESSFUL</span>
              </div>
              <h1 style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px 0; letter-spacing: 0.5px;">
                Payment Confirmed
              </h1>
              <p style="font-size: 14px; color: #9CA3AF; line-height: 1.5; margin: 0; max-width: 440px;">
                Hello <strong style="color: #FFFFFF;">${safeUserName}</strong>, your transaction has been verified. Your pass and registrations for Nexus Vyoma 2026 are secured.
              </p>
            </td>
          </tr>

          <!-- Receipt Breakdown Box -->
          <tr>
            <td style="padding: 20px 32px;">
              <div style="background-color: #060810; border: 1px solid #1A2030; border-radius: 14px; padding: 22px 20px;">
                <div style="font-family: monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #FF6A00; text-transform: uppercase; margin-bottom: 14px;">
                  RECEIPT DETAILS
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                  <tr>
                    <td style="color: #9CA3AF; padding: 7px 0;">Order ID:</td>
                    <td align="right" style="color: #FFFFFF; font-family: monospace; font-weight: 700; padding: 7px 0;">${safeOrderId}</td>
                  </tr>
                  <tr>
                    <td style="color: #9CA3AF; padding: 7px 0;">Payment Ref ID:</td>
                    <td align="right" style="color: #FFFFFF; font-family: monospace; padding: 7px 0;">${safePaymentId}</td>
                  </tr>
                  <tr>
                    <td style="color: #9CA3AF; padding: 7px 0;">Item:</td>
                    <td align="right" style="color: #E5E7EB; font-weight: 600; padding: 7px 0;">${escapeHtml(itemDescription)}</td>
                  </tr>
                  <tr>
                    <td style="color: #9CA3AF; padding: 7px 0;">Payment Method:</td>
                    <td align="right" style="color: #E5E7EB; padding: 7px 0;">${escapeHtml(paymentMethod)}</td>
                  </tr>
                  <tr>
                    <td style="color: #9CA3AF; padding: 7px 0;">Date &amp; Time:</td>
                    <td align="right" style="color: #9CA3AF; font-size: 12px; padding: 7px 0;">${paymentDate}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 10px;">
                      <div style="height: 1px; background-color: #1F2636; width: 100%;"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #FFFFFF; font-weight: 700; font-size: 15px; padding-top: 14px;">Total Paid:</td>
                    <td align="right" style="color: #10B981; font-family: monospace; font-weight: 900; font-size: 20px; padding-top: 14px;">
                      &#8377;${formattedAmount}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Next Steps & CTA -->
          <tr>
            <td style="padding: 0 32px 28px 32px;" align="center">
              <div style="background-color: rgba(255, 106, 0, 0.05); border: 1px dashed rgba(255, 106, 0, 0.3); border-radius: 12px; padding: 16px 20px; text-align: left; margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 700; color: #FBB03B; margin-bottom: 4px;">
                  &#10022; What Happens Next?
                </div>
                <div style="font-size: 12px; color: #9CA3AF; line-height: 1.6;">
                  Your pass entry QR code will be delivered to this email. You can also log in to explore workshops, technical competitions, and cultural events.
                </div>
              </div>

              <!-- Primary CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(90deg, #D8182B 0%, #FF6A00 50%, #E54E00 100%); box-shadow: 0 4px 18px rgba(255, 106, 0, 0.35);">
                    <a href="${portalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 34px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">
                      Go to Registration Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="padding: 24px 32px; background-color: #060810; border-top: 1px solid #1A2030; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; color: #9CA3AF; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">
                ISL Engineering College, Hyderabad
              </div>
              <div style="font-size: 11px; color: #6B7280; margin-bottom: 12px;">
                Bandlaguda, Chandrayangutta, Hyderabad, Telangana 500005
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

  const { error, messageId, success } = await sendEmailWithSES(
    to,
    subject,
    htmlContent,
    textContent
  );

  if (!success) {
    return {
      success: false,
      error: error,
      messageId: messageId,
    };
  }

  // Save dispatch record in database with newly added "payment_success" enum
  await EmailSchema.create({
    email: to,
    type: "payment_success",
    message_id: messageId,
    subject,
  });

  return {
    success: true,
    error: null,
    messageId: messageId,
  };
}