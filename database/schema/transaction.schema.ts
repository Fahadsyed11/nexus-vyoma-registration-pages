import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RegisterUser",
            required: true,
        },
        enrolledIndividualEvents: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "EnrolledIndividualEvent",
            default: [],
        },
        enrolledTeamEvents: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "EnrolledTeamEvent",
            default: [],
        },
        // Kept for compatibility: this is the leader's own ticket, if present.
        // The full list of attendees charged for entry tickets is entryTicketEmails.
        entryTicketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EntryTicket",
            default: undefined,
        },
        entryTicketEmails: {
            type: [String],
            default: [],
            set: (emails: string[]) =>
                (emails ?? []).map((email) => String(email).trim().toLowerCase()).filter(Boolean),
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "idle", "creating"],
            required: true,
            default: "idle",
        },
        orderId: {
            type: String,
            default: undefined,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isFinite,
                message: "totalAmount must be a finite number",
            },
        },
    },
    { timestamps: true, overwriteModels: true }
);

// Allows many historical transactions, but at most one idle transaction per user.
transactionSchema.index(
    { userId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "idle" },
    }
);

const Transaction =
    mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;
