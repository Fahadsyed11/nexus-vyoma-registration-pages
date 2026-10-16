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
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
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
    }
}, { timestamps: true, overwriteModels: true });

entryTicketSchema.index({ userId: 1, transactionId: 1 }, { unique: true });

const EntryTicket = mongoose.models.EntryTicket || mongoose.model("EntryTicket", entryTicketSchema);

export default EntryTicket;