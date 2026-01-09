import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    invoiceCode: String, // Mã hóa đơn HD00001
    customerInfo: {
      name: String,
      phone: String,
      address: String,
    },
    items: Array,
    totalAmount: Number,
    createdAt: Date,
  },
  { timestamps: true }
);


export default mongoose.model("Order", orderSchema);
