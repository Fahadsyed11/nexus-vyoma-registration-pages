import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    long_description: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    date_time: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    isFlatship: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    participant_limit: {
        type: Number,
        required: true
    },
    prize: {
        type: String,
        default: "No prize"
    },
    entry_fee: {
        type: Number,
        default: 0
    },
    participants_type: {
        type: String,
        enum: ["individual", "team"],
        required: true
    },
    team_size: {
        type: Number,
        default: 1
    },
    requirements: {
        type: [String],
        required: true
    }
}, { timestamps: true, overwriteModels: true });

eventSchema.index({ email: 1 }, { unique: true });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;