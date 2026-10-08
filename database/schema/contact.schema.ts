import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true, overwriteModels: true });

const contactModel = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default contactModel;