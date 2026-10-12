import mongoose from "mongoose";

const organizerMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["organizer", "co-organizer", "volunteer"]
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
}, { timestamps: true, overwriteModels: true });

const OrganizerMember = mongoose.models.OrganizerMember || mongoose.model("OrganizerMember", organizerMemberSchema);

export default OrganizerMember;