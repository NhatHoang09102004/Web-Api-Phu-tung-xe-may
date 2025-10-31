import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.post("/checkout", checkout);

export default router;
