import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    payment_id: { type: String, required: true },
    status: { type: String, required: true },
    transaction_amount: Number,
    payment_method: String,
    payer_email: String,
    detail: { type: Object },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);

