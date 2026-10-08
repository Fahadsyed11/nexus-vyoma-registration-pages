import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({}, { timestamps: true, overwriteModels: true });

const transactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default transactionModel;