import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,           // tên sản phẩm tại thời điểm bán
        quantity: Number,       // số lượng mua
        price: Number           // giá tại thời điểm mua
      }
    ],
    totalPrice: {
      type: Number,
      required: true           // tổng tiền đơn hàng
    },
    customerName: String,
    customerPhone: String,
    note: String
  },
  { timestamps: true }         // createdAt để tính doanh thu theo tháng
);

export default mongoose.model("Order", OrderSchema);
