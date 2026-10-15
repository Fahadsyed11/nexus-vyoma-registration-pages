import { connectToDatabase } from "@/database/db";
import mongoose from "mongoose";
import { sendEmailWithSES } from "../aws/helper.aws";
import EmailSchema from "@/database/schema/email.schema"

export async function sendOTPEmail(user_id: string | null | undefined, to: string, user_name: string, otp: string) {

    await connectToDatabase();
    // Generate the HTML content for the email otp make sure to includes otp, name and email
    const htmlContent = `
        <p>Hello ${user_name},</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Please use this OTP to verify your email address: ${to}</p>
    `;
    const subject = `Here is the OTP`;
    const textContent = `Hello ${user_name}, your OTP is: ${otp}. Please use this OTP to verify your email address: ${to}`;

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
