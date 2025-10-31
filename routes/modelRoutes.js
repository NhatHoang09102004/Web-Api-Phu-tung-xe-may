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

// Lấy tất cả model
router.get("/", getAllModels);

// Lấy 1 model theo ID
router.get("/:id", getModelById);

// Thêm 1 model
router.post("/", createModel);

// Thêm nhiều model
router.post("/bulk", addMultipleModels);

// Cập nhật model
router.put("/:id", updateModel);

// Xóa 1 model
router.delete("/:id", deleteModel);

// Xóa nhiều model
router.post("/delete-multiple", deleteMultipleModels);

export default router;
