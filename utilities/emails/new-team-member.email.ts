import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

export async function sendEmailToNotRegisteredTeamMember(
    to: string,
    team_details: { team_name: string; team_leader_name: string; team_leader_email: string }
) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || "https://nexusvyoma.islec.edu.in";
    const registerUrl = `${baseUrl}/register/check-email?email=${encodeURIComponent(to)}`;

    const subject = `Team Invitation: ${team_details.team_leader_name} added you to "${team_details.team_name}" — Nexus Vyoma 2026`;

    const textContent = `NEXUS VYOMA 2026 — TEAM INVITATION & ACTION REQUIRED

Hello,

Great news! ${team_details.team_leader_name} has registered the team "${team_details.team_name}" for Nexus Vyoma 2026 and added your email (${to}) as a team member.

TEAM REGISTRATION DETAILS:
• Team Name: ${team_details.team_name}
• Team Leader: ${team_details.team_leader_name} (${team_details.team_leader_email})
• Your Registered Email: ${to}
• Fest Dates: 10 · 11 · 12 November 2026
• Venue: ISL Engineering College, Hyderabad

ACTION REQUIRED:
To confirm your spot on the team roster and generate your official fest pass, you must complete your registration on the Nexus Vyoma portal using this email address:
${registerUrl}

Questions about your team? You can reach your team leader directly at ${team_details.team_leader_email}.

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
              
              <!-- Badge: Team Invitation -->
              <div style="margin-bottom: 16px;">
                <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 106, 0, 0.12); border: 1px solid rgba(255, 106, 0, 0.35); border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #FF6A00; text-transform: uppercase;">
                  &#9733; TEAM INVITATION &bull; ACTION REQUIRED
                </span>
              </div>

              <h1 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px; line-height: 1.3;">
                You've been added to a team!
              </h1>
              
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #D1D5DB;">
                Hello,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #9CA3AF;">
                <strong style="color: #FFFFFF;">${team_details.team_leader_name}</strong> has enrolled team <strong style="color: #FF6A00;">"${team_details.team_name}"</strong> in Nexus Vyoma 2026 and listed your email (<span style="color: #FFFFFF;">${to}</span>) on the team roster.
              </p>

              <!-- Team Information Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
                <tr>
                  <td style="background-color: #030407; border: 1px solid #1F2636; border-left: 3px solid #FF6A00; border-radius: 12px; padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF6A00; text-transform: uppercase; margin-bottom: 12px;">
                      TEAM REGISTRATION DETAILS
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF; width: 130px;">Team Name:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #FFFFFF;">${team_details.team_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Team Leader:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #FFFFFF;">${team_details.team_leader_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Leader Contact:</td>
                        <td style="padding: 4px 0; color: #E5E7EB; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px;">${team_details.team_leader_email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Your Email:</td>
                        <td style="padding: 4px 0; color: #E5E7EB; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px;">${to}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Fest Dates:</td>
                        <td style="padding: 4px 0; font-weight: 600; color: #FF6A00;">10 &bull; 11 &bull; 12 NOV 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #9CA3AF;">Venue:</td>
                        <td style="padding: 4px 0; color: #E5E7EB;">ISL Engineering College, Hyderabad</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: rgba(255, 106, 0, 0.08); border: 1px solid rgba(255, 106, 0, 0.25); border-radius: 10px; padding: 14px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 12px; line-height: 18px; color: #FDBA74;">
                          <strong>Why is registration required?</strong> To receive your official digital event pass, verify attendee entry, and confirm eligibility on the competition roster, all team members must complete individual registration.
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
                    <a href="${registerUrl}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #FF6A00 0%, #FF3B2E 100%); color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(255, 106, 0, 0.35);">
                      COMPLETE YOUR REGISTRATION &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #6B7280; text-align: center;">
                Need help or have questions regarding your team? You can reach your team leader directly or contact the Nexus Vyoma Helpdesk.
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
        type: "team_member_not_registered",
        message_id: messageId,
        subject,
    });

    return {
        success: true,
        error: null,
        messageId: messageId,
    };
}
