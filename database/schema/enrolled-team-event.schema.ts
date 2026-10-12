import mongoose from "mongoose";

const enrolledTeamEventSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: true
    },
    team_emails: {
        type: [String],
        required: true
    },
    team_leader_register_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
    },
    team_length: {
        type: Number,
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    isPaid: {
        type: Boolean,
        default: false
    },
}, { timestamps: true, overwriteModels: true });

const enrolledTeamEventModel = mongoose.models.EnrolledTeamEvent || mongoose.model("EnrolledTeamEvent", enrolledTeamEventSchema);

export default enrolledTeamEventModel;