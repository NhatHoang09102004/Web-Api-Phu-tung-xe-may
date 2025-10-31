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

// Lấy tất cả
router.get("/", getAllVehicles);

// Lấy 1 theo ID
router.get("/:id", getVehicleById);

// Thêm 1
router.post("/", createVehicle);

// Thêm nhiều
router.post("/bulk", addMultipleVehicles);

// Cập nhật
router.put("/:id", updateVehicle);

// Xóa 1
router.delete("/:id", deleteVehicle);

// Xóa nhiều
router.post("/delete-multiple", deleteMultipleVehicles);

export default router;
