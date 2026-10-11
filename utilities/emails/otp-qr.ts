import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendOTPEmail(user_id: string, to: string, user_name: string, otp: string) {

    // Generate the HTML content for the email otp make sure to includes otp, name and email
    const htmlContent = ``;
    const subject = ``;
    const textContent = ``;

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
        type: "otp_verification",
        messageId,
        user_id,
        subject,
    })

    return {
        success: true,
        error: null,
        messageId: messageId,
    }
}