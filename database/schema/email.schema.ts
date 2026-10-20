import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["new_user", "otp_verification", "ticket_qr", "special", "payment_failed", "team_member_not_registered", "other"],
    },
    message_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
        required: false,
    },
    subject: {
        type: String,
        required: true,
    }
}, { timestamps: true, overwriteModels: true });

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;