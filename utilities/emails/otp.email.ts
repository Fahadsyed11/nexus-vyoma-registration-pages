import { connectToDatabase } from "@/database/db";
import mongoose from "mongoose";
import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendOTPEmail(user_id: string | null | undefined, to: string, user_name: string, otp: string) {

  await connectToDatabase();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexusvyoma.islec.edu.in";
  const logoUrl = `${baseUrl}/brand/nexus-wordmark-official.png`;

  const subject = `${otp} is your Nexus Vyoma verification code`;
  const textContent = `NEXUS VYOMA 2026 — VERIFICATION CODE

Hello ${user_name},

Your one-time verification code is: ${otp}

This code is valid for 5 minutes. Use it to verify your email address (${to}) on the Nexus Vyoma registration portal.

If you did not request this verification, please safely ignore this email.

— Team Nexus Vyoma
ISL Engineering College, Hyderabad
10 · 11 · 12 NOV 2026`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E5E7EB; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #05070D; min-height: 100vh; padding: 32px 16px;">
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
                Email Verification
              </h1>
              
              <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 24px; color: #D1D5DB;">
                Hello <strong style="color: #FFFFFF;">${user_name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #9CA3AF;">
                Use the verification code below to verify your email (<strong style="color: #FFFFFF;">${to}</strong>) and continue your registration for Nexus Vyoma 2026.
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #030407; border: 1px solid rgba(255, 106, 0, 0.45); border-radius: 14px; padding: 22px 16px; box-shadow: inset 0 0 24px rgba(255, 106, 0, 0.08);">
                    <div style="font-size: 11px; font-weight: 600; letter-spacing: 2px; color: #FF6A00; text-transform: uppercase; margin-bottom: 8px;">
                      YOUR ONE-TIME PASSWORD
                    </div>
                    <div style="font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #FFFFFF; text-shadow: 0 0 16px rgba(255, 106, 0, 0.45); padding-left: 10px;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 20px; color: #9CA3AF; text-align: center;">
                ⏱️ This code expires in <strong style="color: #FFFFFF;">5 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #6B7280; text-align: center;">
                If you did not request this verification code, please ignore this email.
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
                10 · 11 · 12 NOV 2026 &bull; ISL Engineering College, Hyderabad
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
  console.log("Email sent with messageId:", messageId, "success:", success, "error:", error)

  if (!success) {
    return {
      success: false,
      error: error,
      messageId: messageId,
    }
  }

  console.log("Email sent successfully to:", to, "with messageId:", messageId, "for user_id:", user_id, "subject:", subject)

  // Save the email details to the database
  const emailDoc: Record<string, unknown> = {
    email: to,
    type: "otp_verification",
    message_id: messageId,
    user_id: user_id || new mongoose.Types.ObjectId(),
    subject,
  };

  await EmailSchema.create(emailDoc);

  return {
    success: true,
    error: null,
    messageId: messageId,
  }
}
