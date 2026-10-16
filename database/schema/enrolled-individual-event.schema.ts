import mongoose from "mongoose";

const enrolledIndividualEventSchema = new mongoose.Schema({
    register_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUser",
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
    reservation_time: {
        type: Date,
        required: true,
    },
    isExtended: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, overwriteModels: true });

const EnrolledIndividualEvent = mongoose.models.EnrolledIndividualEvent || mongoose.model("EnrolledIndividualEvent", enrolledIndividualEventSchema);

export default EnrolledIndividualEvent;