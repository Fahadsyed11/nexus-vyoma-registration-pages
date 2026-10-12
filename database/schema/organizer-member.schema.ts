import mongoose from "mongoose";

const organizerMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["patrons", "co-patrons", "board-members", "tech-team", "coordinators"]
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