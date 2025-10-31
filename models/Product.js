import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicle: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    year: { type: String },
    specifications: { type: String },
    quantity: { type: Number, default: 0 },
    origin: { type: String },
    image: { type: String },
    status: { type: String, enum: ["Còn hàng", "Hết hàng"], default: "Còn hàng" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
