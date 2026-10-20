import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

// Escapes text before placing it inside HTML (the gateway message is external text)
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmailToPaymentFailed(
  to: string,
  user_name: string,
  order_id: string,
  amount: number,
  message: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || "https://nexusvyoma.islec.edu.in";
  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');
  const checkoutUrl = `${baseUrl}/register/checkout-event`;

  // Failure reason shown to the user, with a fallback if none was provided
  const reason = message?.trim() || "The payment could not be completed.";
  const reasonHtml = escapeHtml(reason);

  const subject = `Payment Notice: Registration Incomplete for Nexus Vyoma 2026 [Order #${order_id}]`;

  const textContent = `NEXUS VYOMA 2026 — PAYMENT NOTICE

Hello ${user_name},

We noticed that your recent payment attempt for Nexus Vyoma 2026 could not be completed.

TRANSACTION SUMMARY:
• Attendee: ${user_name}
• Order ID: ${order_id}
• Amount: ₹${formattedAmount}
• Status: Failed / Incomplete
• Reason: ${reason}

IMPORTANT NOTICE ON DEBITED FUNDS:
If money was deducted from your bank account, card, or UPI app, it will typically be refunded automatically by your bank or payment provider within 3–5 business days.

RETRY YOUR REGISTRATION:
Your selected events are temporarily held. You can complete your registration by visiting:
${checkoutUrl}

Need assistance? Contact our team via the portal or reply directly to this email.

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
          
          <!-- Alert Accent Stripe: Crimson to Deep Orange -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #FF6A00 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
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
              
              <!-- Status Pill Badge -->
              <div style="margin-bottom: 16px;">
                <span style="display: inline-block; padding: 4px 12px; background-color: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #F87171; text-transform: uppercase;">
                  &#9888; PAYMENT UNSUCCESSFUL
                </span>
              </div>

              <h1 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px; line-height: 1.3;">
                We couldn't process your payment
              </h1>
              
              <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 24px; color: #D1D5DB;">
                Hello <strong style="color: #FFFFFF;">${user_name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #9CA3AF;">
                Your recent payment transaction for <strong style="color: #FFFFFF;">Nexus Vyoma 2026</strong> could not be completed by the payment gateway. Don't worry—your selected events are temporarily held so you can complete your registration.
              </p>

              <!-- Transaction Summary Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="background-color: #030407; border: 1px solid #1F2636; border-left: 3px solid #EF4444; border-radius: 12px; padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #EF4444; text-transform: uppercase; margin-bottom: 12px;">
                      TRANSACTION DETAILS
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF; width: 140px;">Attendee Name:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #FFFFFF;">${user_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Order ID:</td>
                        <td style="padding: 4px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #E5E7EB;">${order_id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Amount:</td>
                        <td style="padding: 4px 0; font-weight: 700; font-size: 15px; color: #FFFFFF;">&#8377;${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Status:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #EF4444;">Failed / Incomplete</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF; vertical-align: top;">Reason:</td>
                        <td style="padding: 4px 0; color: #E5E7EB; line-height: 18px;">${reasonHtml}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Refund Reassurance Note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: rgba(251, 176, 59, 0.08); border: 1px solid rgba(251, 176, 59, 0.25); border-radius: 10px; padding: 14px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 12px; line-height: 18px; color: #FBB03B;">
                          <strong>Did money leave your account?</strong> If funds were debited from your card, net banking, or UPI app, they will automatically be refunded back to your source account within <strong>3&ndash;5 business days</strong> by your bank.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${checkoutUrl}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 100%); color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(255, 106, 0, 0.35);">
                      RETRY PAYMENT &amp; COMPLETE REGISTRATION &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #6B7280; text-align: center;">
                Need assistance with your registration or payment? Reply directly to this email or reach out to the Nexus Vyoma Helpdesk.
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

  const { error, messageId, success } = await sendEmailWithSES(to, subject, htmlContent, textContent);

  if (!success) {
    return {
      success: false,
      error: error,
      messageId: messageId,
    };
  }

  // Save the email details to the database
  await EmailSchema.create({
    email: to,
    type: "payment_failed",
    message_id: messageId,
    subject,
  });

  return {
    success: true,
    error: null,
    messageId: messageId,
  };
}