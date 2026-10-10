import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    time: {
        type: Number,
    },
    code: {
        type: String,
        required: true,
    },
    attempt: {
        type: Number,
        default: 0,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
}, { timestamps: true, overwriteModels: true });

const OtpVerification = mongoose.models.OtpVerification || mongoose.model("OtpVerification", otpSchema);

export default OtpVerification;