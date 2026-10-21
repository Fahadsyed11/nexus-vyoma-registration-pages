import mongoose from "mongoose";

const organizerMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["Chief Patron", "Patron", "Convener", "Advisory Board", "Organizing Faculty", "Board Members", "Tech Team", "Coordinators"]
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
    },
    profile_image: {
        type: String,
        required: true
    },
}, { timestamps: true, overwriteModels: true });

const OrganizerMember = mongoose.models.OrganizerMember || mongoose.model("OrganizerMember", organizerMemberSchema);

export default OrganizerMember;