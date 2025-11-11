import express from "express";
import {
  getAllModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
  addMultipleModels,
  deleteMultipleModels,
} from "../controllers/modelController.js";

const router = express.Router();

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: Lấy danh sách tất cả model
 *     tags: [Model]
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách model
 */
router.get("/", getAllModels);

/**
 * @swagger
 * /api/models/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một model theo ID
 *     tags: [Model]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của model
 *     responses:
 *       200:
 *         description: Thành công, trả về chi tiết model
 *       404:
 *         description: Không tìm thấy model
 */
router.get("/:id", getModelById);

/**
 * @swagger
 * /api/models:
 *   post:
 *     summary: Tạo mới một model
 *     tags: [Model]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Model A"
 *               description:
 *                 type: string
 *                 example: "Mô tả cho model A"
 *               categoryId:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f789012345"
 *     responses:
 *       201:
 *         description: Tạo model thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createModel);

/**
 * @swagger
 * /api/models/bulk:
 *   post:
 *     summary: Thêm nhiều model cùng lúc
 *     tags: [Model]
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
 *                   example: "Model B"
 *                 description:
 *                   type: string
 *                   example: "Mô tả Model B"
 *                 categoryId:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f789012345"
 *     responses:
 *       201:
 *         description: Thêm nhiều model thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/bulk", addMultipleModels);

/**
 * @swagger
 * /api/models/{id}:
 *   put:
 *     summary: Cập nhật model theo ID
 *     tags: [Model]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của model cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Model A (Updated)"
 *               description:
 *                 type: string
 *                 example: "Mô tả đã cập nhật"
 *               categoryId:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f789012345"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy model
 */
router.put("/:id", updateModel);

/**
 * @swagger
 * /api/models/{id}:
 *   delete:
 *     summary: Xóa model theo ID
 *     tags: [Model]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của model cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy model
 */
router.delete("/:id", deleteModel);

/**
 * @swagger
 * /api/models/delete-multiple:
 *   post:
 *     summary: Xóa nhiều model cùng lúc
 *     tags: [Model]
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
 *         description: Xóa nhiều model thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/delete-multiple", deleteMultipleModels);

export default router;
