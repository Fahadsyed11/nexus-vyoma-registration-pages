import { RegisterUserFormInput } from "@/dto/(register)/register-user.dto";
import mongoose from "mongoose";

export interface RegisterUserModel
    extends RegisterUserFormInput {
    profile_image: string;
    is_verified: boolean;
}

const registrationUserSchema = new mongoose.Schema<RegisterUserModel, RegisterUserFormInput>({
    // personal details
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },

    // address info
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },

    // professional info
    institution: {
        type: String,
        required: true,
        trim: true
    },
    year_of_study: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    profile_image: {
        type: String,
        required: true,
        trim: true
    },
    is_verified: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true, overwriteModels: true });

registrationUserSchema.index({ email: 1 }, { unique: true });

const RegisterUser = mongoose.models.RegisterUser || mongoose.model("RegisterUser", registrationUserSchema);

export default RegisterUser;