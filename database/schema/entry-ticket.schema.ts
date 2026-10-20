import mongoose from "mongoose";

const entriesSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    checked_in_at: {
        type: Date,
        required: true
    }
})

const entryTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entries: {
        type: [entriesSchema],
        required: true,
        default: []
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
}, { timestamps: true, overwriteModels: true });

const EntryTicket = mongoose.models.EntryTicket || mongoose.model("EntryTicket", entryTicketSchema);

export default EntryTicket;