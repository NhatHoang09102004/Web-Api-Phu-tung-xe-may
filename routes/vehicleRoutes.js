import express from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  addMultipleVehicles,
  deleteMultipleVehicles,
} from "../controllers/vehicleController.js";

const router = express.Router();

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Lấy danh sách tất cả phương tiện
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách phương tiện
 */
router.get("/", getAllVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một phương tiện theo ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phương tiện
 *     responses:
 *       200:
 *         description: Thành công, trả về chi tiết phương tiện
 *       404:
 *         description: Không tìm thấy phương tiện
 */
router.get("/:id", getVehicleById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Tạo mới một phương tiện
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Xe tải A"
 *               manufacturer:
 *                 type: string
 *                 example: "Hãng ABC"
 *               model:
 *                 type: string
 *                 example: "Model X"
 *               year:
 *                 type: integer
 *                 example: 2020
 *               vin:
 *                 type: string
 *                 example: "1HGCM82633A004352"
 *     responses:
 *       201:
 *         description: Tạo phương tiện thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createVehicle);

/**
 * @swagger
 * /api/vehicles/bulk:
 *   post:
 *     summary: Thêm nhiều phương tiện cùng lúc
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Xe tải B"
 *                 manufacturer:
 *                   type: string
 *                   example: "Hãng XYZ"
 *                 model:
 *                   type: string
 *                   example: "Model Y"
 *                 year:
 *                   type: integer
 *                   example: 2021
 *                 vin:
 *                   type: string
 *                   example: "JH4KA7650MC000000"
 *     responses:
 *       201:
 *         description: Thêm nhiều phương tiện thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/bulk", addMultipleVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Cập nhật thông tin phương tiện theo ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phương tiện cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Xe tải A (Updated)"
 *               manufacturer:
 *                 type: string
 *                 example: "Hãng ABC"
 *               model:
 *                 type: string
 *                 example: "Model X2"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               vin:
 *                 type: string
 *                 example: "1HGCM82633A004352"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy phương tiện
 */
router.put("/:id", updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Xóa phương tiện theo ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phương tiện cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy phương tiện
 */
router.delete("/:id", deleteVehicle);

/**
 * @swagger
 * /api/vehicles/delete-multiple:
 *   post:
 *     summary: Xóa nhiều phương tiện cùng lúc
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["66a1b2c3d4e5f60718293abc", "65f1a2b3c4d5e6f789012345"]
 *     responses:
 *       200:
 *         description: Xóa nhiều phương tiện thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/delete-multiple", deleteMultipleVehicles);

export default router;
