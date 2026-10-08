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
        type: Date,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    isFlatship: {
        type: Boolean,
        required: true
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
    },
    entry_fee: {
        type: Number,
    },
    participants_type: {
        type: String,
        enum: ["individual", "team"],
        required: true
    },
    team_size: {
        type: Number,
    },
    requirements: {
        type: String,
        required: true
    }
}, { timestamps: true, overwriteModels: true });

eventSchema.index({ email: 1 }, { unique: true });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;