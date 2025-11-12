// routes/saleRoutes.js
import express from "express";
import { createSale, listSales, getSaleById } from "../controllers/saleController.js";

const router = express.Router();

/**
 * POST /api/sales
 * Tạo giao dịch bán (POS)
 */
router.post("/", createSale);

/**
 * GET /api/sales
 * Danh sách bán hàng (pagination)
 */
router.get("/", listSales);

/**
 * GET /api/sales/:id
 * Chi tiết bán hàng
 */
router.get("/:id", getSaleById);

export default router;
