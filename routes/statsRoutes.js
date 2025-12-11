import express from "express";
import { getRevenueMonthly } from "../controllers/statsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API thống kê hệ thống
 */

/**
 * @swagger
 * /api/stats/revenue-monthly:
 *   get:
 *     summary: Lấy doanh thu theo từng tháng trong năm
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Thành công, trả về doanh thu 12 tháng + tổng doanh thu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 months:
 *                   type: array
 *                   example: ["Th1", "Th2", "Th3"]
 *                 revenue:
 *                   type: array
 *                   example: [12000000, 15000000, 18000000]
 *                 totalRevenue:
 *                   type: number
 *                   example: 45000000
 */
router.get("/revenue-monthly", getRevenueMonthly);

export default router;
