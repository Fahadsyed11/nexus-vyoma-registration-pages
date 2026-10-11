import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendWelcomeEmail(user_id: string, to: string, user_name: string) {
    // Generate the HTML content for the welcome user. make sure to includes user_name, email (to)
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
        type: "new_user",
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