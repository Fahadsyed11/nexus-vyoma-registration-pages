import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema";

export async function sendQREmail(to: string, user_name: string, qrCode: Buffer) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexusvyoma.islec.edu.in";
    const qrCodeBase64 = qrCode.toString("base64");
    const subject = `QR Code for Nexus Vyoma 2026`;
    const textContent = `NEXUS VYOMA 2026 — QR CODE

Hello ${user_name},

Here is your QR code for Nexus Vyoma 2026.

QR CODE:
${qrCodeBase64}

Thank you for registering for Nexus Vyoma 2026.

— Team Nexus Vyoma
ISL Engineering College, Hyderabad
10 · 11 · 12 NOV 2026`;

    const htmlContent = ``;

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
        type: "team_member_not_registered",
        message_id: messageId,
        subject,
    })

    return {
        success: true,
        error: null,
        messageId: messageId,
    }
}