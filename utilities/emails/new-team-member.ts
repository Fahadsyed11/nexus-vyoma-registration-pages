import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendEmailToNotRegisteredTeamMember(to: string, team_details: { team_name: string, team_leader_name: string, team_leader_email: string }) {
    // Generate the HTML content to team member how did not register yet. make sure to includes team_name, team_leader_name, team_leader_email
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
        type: "other",
        message_id: messageId,
        subject,
    })

    return {
        success: true,
        error: null,
        messageId: messageId,
    }
}
