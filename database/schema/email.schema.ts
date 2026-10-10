import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["new_user", "otp_verification", "qr_code", "special", "other"],
    },
    message_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
        required: true,
    },
    subject: {
        type: String,
        required: true,
    }
}, { timestamps: true, overwriteModels: true });

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;