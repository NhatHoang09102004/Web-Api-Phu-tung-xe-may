import Order from "../models/Order.js";

// Lấy danh sách tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy chi tiết 1 hóa đơn theo ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
