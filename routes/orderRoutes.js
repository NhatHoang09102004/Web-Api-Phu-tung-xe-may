import express from "express";
import { getAllOrders, getOrderById } from "../controllers/orderController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API quản lý đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.get("/", getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết một đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hóa đơn
 *     responses:
 *       200:
 *         description: Thành công, trả về chi tiết hóa đơn
 *       404:
 *         description: Không tìm thấy hóa đơn
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", getOrderById);

export default router;
