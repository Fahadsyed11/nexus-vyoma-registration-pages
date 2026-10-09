import mongoose from "mongoose";

const orderSummarySchema = new mongoose.Schema({}, { timestamps: true, overwriteModels: true });

const orderSummaryModel = mongoose.models.OrderSummary || mongoose.model("OrderSummary", orderSummarySchema);

export default orderSummaryModel;