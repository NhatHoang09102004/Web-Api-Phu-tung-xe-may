// models/Sale.js
import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const saleSchema = new mongoose.Schema(
  {
    saleId: { type: String, index: true },
    items: [saleItemSchema],
    totalAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "COD" }, // COD, cash, card, bank...
    cashier: { type: String, default: "" }, // tên user hoặc id
    customer: {
      name: String,
      phone: String,
      address: String,
    },
    status: { type: String, default: "paid" }, // paid, pending, refunded...
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
