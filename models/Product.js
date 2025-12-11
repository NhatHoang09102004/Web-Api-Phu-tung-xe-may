  // models/Product.js
  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      vehicle: { type: String, required: true, trim: true },
      model: { type: String, required: true, trim: true },
      category: { type: String, required: true, trim: true },
      price: { type: Number, required: true },
      description: { type: String, default: "" },
      year: { type: String, default: "" },
      specifications: { type: String, default: "" },
      quantity: { type: Number, default: 0 },
      origin: { type: String, default: "" },
      image: { type: String, default: "" },
      status: {
        type: String,
        enum: ["Còn hàng", "Hết hàng"],
        default: "Còn hàng",
      },
    },
    { timestamps: true }
  );

  // Indexes: tăng tốc lọc / tìm kiếm
  productSchema.index({ vehicle: 1, model: 1, category: 1 });
  productSchema.index({ createdAt: -1 });
  productSchema.index({ name: "text", description: "text" });

  // Optional: unique compound index if you want DB-level duplicate prevention
  // productSchema.index({ name: 1, vehicle: 1, model: 1, category: 1 }, { unique: true });

  const Product = mongoose.model("Product", productSchema);
  export default Product;
