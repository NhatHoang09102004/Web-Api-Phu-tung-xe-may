import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addMultipleCategories,
  deleteMultipleCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách danh mục
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết danh mục theo ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Thành công, trả về chi tiết danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo mới một danh mục
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phụ tùng xe máy"
 *               description:
 *                 type: string
 *                 example: "Các loại phụ tùng thay thế cho xe máy"
 *     responses:
 *       201:
 *         description: Tạo mới danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createCategory);

/**
 * @swagger
 * /api/categories/bulk:
 *   post:
 *     summary: Thêm nhiều danh mục cùng lúc
 *     tags: [Category]
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
 *                   example: "Phụ kiện xe"
 *                 description:
 *                   type: string
 *                   example: "Các phụ kiện trang trí, nâng cấp xe"
 *     responses:
 *       201:
 *         description: Thêm nhiều danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/bulk", addMultipleCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phụ tùng xe hơi"
 *               description:
 *                 type: string
 *                 example: "Danh mục phụ tùng thay thế cho xe hơi"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.put("/:id", updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.delete("/:id", deleteCategory);

/**
 * @swagger
 * /api/categories/delete-multiple:
 *   post:
 *     summary: Xóa nhiều danh mục cùng lúc
 *     tags: [Category]
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
 *         description: Xóa nhiều danh mục thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/delete-multiple", deleteMultipleCategories);

export default router;
