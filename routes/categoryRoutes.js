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

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.post("/bulk", addMultipleCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.post("/delete-multiple", deleteMultipleCategories);

export default router;
