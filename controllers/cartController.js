import Cart from "../models/cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// 🛒 Lấy giỏ hàng hiện tại
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().lean();
    if (!cart) {
      cart = await Cart.create({ items: [], totalAmount: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy giỏ hàng", details: error.message });
  }
};

// ➕ Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [] });

    const existingItem = cart.items.find((item) =>
      item.productId.equals(product._id)
    );
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        vehicle: product.vehicle,
        model: product.model,
        category: product.category,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Đã thêm sản phẩm vào giỏ hàng", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi thêm vào giỏ hàng", details: error.message });
  }
};

// ✏️ Cập nhật số lượng sản phẩm
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne();
    if (!cart)
      return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

    const item = cart.items.find((i) => i.productId.equals(productId));
    if (!item)
      return res
        .status(404)
        .json({ error: "Không có sản phẩm này trong giỏ hàng" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => !i.productId.equals(productId));
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi cập nhật giỏ hàng", details: error.message });
  }
};

// ❌ Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne();
    if (!cart)
      return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter((i) => !i.productId.equals(productId));
    await cart.save();

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      details: error.message,
    });
  }
};

// 🧾 Thanh toán giỏ hàng
export const checkout = async (req, res) => {
  try {
    const { customerInfo } = req.body;

    const cart = await Cart.findOne();
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Giỏ hàng đang trống" });

    // 📌 Tạo mã hóa đơn tự tăng
    const invoiceCode = await generateInvoiceCode();

    const order = {
      invoiceCode,
      customerInfo,
      items: cart.items,
      totalAmount: cart.totalAmount,
      createdAt: new Date(),
    };

    // 📌 Lưu vào lịch sử mua hàng (Order collection)
    await Order.create(order);

    // ✅ Trừ tồn kho
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    // 🧹 Xóa giỏ sau khi thanh toán
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Thanh toán thành công",
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi thanh toán giỏ hàng",
      details: error.message,
    });
  }
};

// 📌 Hàm tạo mã hóa đơn tự tăng
async function generateInvoiceCode() {
  const last = await Order.findOne().sort({ createdAt: -1 });

  if (!last) return "NĐNH00001";

  const lastNumber = parseInt(last.invoiceCode.replace("NĐNH", ""));
  const newNumber = (lastNumber + 1).toString().padStart(5, "0");

  return "NĐNH" + newNumber;
}
