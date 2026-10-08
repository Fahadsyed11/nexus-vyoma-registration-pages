import mongoose from "mongoose";

const enrolledEventSchema = new mongoose.Schema({
    event_title: {
        type: String,
        required: true
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    register_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
}, { timestamps: true, overwriteModels: true });

const enrolledEventModel = mongoose.models.EnrolledEvent || mongoose.model("EnrolledEvent", enrolledEventSchema);

export default enrolledEventModel;