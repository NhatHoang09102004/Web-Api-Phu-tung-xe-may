import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    invoiceCode: String,
    customerName: String,
    phone: String,
    customerInfo: {
      name: String,
      phone: String,
      vehicle: String,
      note: String,
    },
    items: Array,
    totalAmount: Number,
    paymentInfo: {
      method: String,
      status: String,
      paidAt: Date,
    },
    orderStatus: { type: String, default: "success" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
