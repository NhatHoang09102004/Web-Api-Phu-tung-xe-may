import express from "express";
import { getOverviewStats } from "../controllers/dashboardStatsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API thống kê tổng quan
 */

/**
 * @swagger
 * /api/stats/overview:
 *   get:
 *     summary: Lấy thống kê tổng quan hệ thống (tổng sản phẩm, doanh thu tháng, hãng phổ biến, khách hàng mới)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Trả về thống kê tổng quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: number
 *                   example: 150
 *                 monthlyRevenue:
 *                   type: number
 *                   example: 120000000
 *                 popularBrand:
 *                   type: object
 *                   example: { name: "Honda", count: 80 }
 *                 newCustomers:
 *                   type: number
 *                   example: 25
 */
router.get("/revenue-monthly", getOverviewStats);

export default router;
