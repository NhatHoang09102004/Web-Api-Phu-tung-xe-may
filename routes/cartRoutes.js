import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from "../controllers/cartController.js";

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy giỏ hàng hiện tại của người dùng
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Thành công, trả về giỏ hàng
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f789012345"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Thêm vào giỏ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/add", addToCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Cập nhật số lượng một item trong giỏ
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID của item trong giỏ (hoặc productId tùy triển khai)
 *                 example: "66a1b2c3d4e5f60718293abc"
 *               productId:
 *                 type: string
 *                 description: (Tuỳ chọn) dùng nếu không có itemId
 *                 example: "65f1a2b3c4d5e6f789012345"
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy item
 */
router.put("/update", updateCartItem);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Xóa một item khỏi giỏ
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID của item trong giỏ (hoặc productId tùy triển khai)
 *                 example: "66a1b2c3d4e5f60718293abc"
 *               productId:
 *                 type: string
 *                 description: (Tuỳ chọn) dùng nếu không có itemId
 *                 example: "65f1a2b3c4d5e6f789012345"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy item
 */
router.delete("/remove", removeFromCart);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Tiến hành thanh toán giỏ hàng
 *     tags: [Cart]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "12 Nguyễn Trãi, Q.1, TP.HCM"
 *               paymentMethod:
 *                 type: string
 *                 example: "COD"
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc giỏ hàng trống
 */
router.post("/checkout", checkout);

export default router;
