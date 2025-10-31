import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1, min: 1 },
    vehicle: String,
    model: String,
    category: String,
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔁 Tự động tính tổng tiền mỗi khi lưu
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  next();
});

export default mongoose.model("cart", cartSchema);
