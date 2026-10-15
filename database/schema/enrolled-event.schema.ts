import mongoose from "mongoose";

const enrolledEventSchema = new mongoose.Schema({
    event_title: {
        type: String,
        required: true,
        trim: true,
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false,
    },
    register_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
        required: false,
    },
    user_email: {
        type: String,
        required: false,
        trim: true,
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    participation_type: {
        type: String,
        enum: ["individual", "team"],
        default: "individual",
    },
    team_name: {
        type: String,
        required: false,
        trim: true,
    },
    team_leader_email: {
        type: String,
        required: false,
        trim: true,
    },
    team_size: {
        type: Number,
        required: false,
        default: 1,
    },
    team_members: {
        type: [String],
        default: [],
    },
}, { timestamps: true, overwriteModels: true });

if (mongoose.models.EnrolledEvent) {
    delete mongoose.models.EnrolledEvent;
}

const enrolledEventModel = mongoose.model("EnrolledEvent", enrolledEventSchema);

export default enrolledEventModel;