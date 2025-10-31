import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

// [ADD] Swagger
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// ===== CORS (gọn, chỉ 1 lần) =====
const ALLOW_HOSTS = new Set([
  "nhathoang09102004.github.io", // GitHub Pages
  "localhost",
  "127.0.0.1",
  // [ADD] sau khi deploy, thêm host deploy vào đây, ví dụ:
  // "your-service.onrender.com",
  // "api.yourdomain.com",
]);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // cho curl/Postman
      try {
        const host = new URL(origin).hostname;
        const ok = ALLOW_HOSTS.has(host);
        return cb(ok ? null : new Error("Not allowed by CORS"), ok);
      } catch {
        return cb(new Error("Bad Origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// ===== DB =====
connectDB();

// ===== Routes =====
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stats", statsRoutes);

// [ADD] Ping
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// [ADD] Swagger options
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Nhật Hoàng API", version: "1.0.0" },
    servers: [
      { url: "http://localhost:3000" },
      // Sau khi deploy Render, thêm:
      // { url: "https://your-service.onrender.com" },
      // hoặc domain của bạn: { url: "https://api.yourdomain.com" },
    ],
  },
  // có thể thêm "./routes/*.js" nếu bạn dùng JSDoc trong file route
  apis: ["./server.js"],
});

// [ADD] Trang Swagger UI & file JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/openapi.json", (req, res) => res.json(swaggerSpec));

/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API đang chạy cổng ${PORT}`));
