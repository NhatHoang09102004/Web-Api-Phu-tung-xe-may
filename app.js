import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// bảo mật
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Routes
import vehicleRoutes from "./routes/vehicleRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// ===== CORS =====
const ALLOW_HOSTS = new Set([
  "nhathoang09102004.github.io", // GitHub Pages
  "localhost",
  "127.0.0.1",
  "motorparts-api.onrender.com", // Render host của bạn
]);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // cho Postman
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

// ===== Bảo mật =====
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// ===== Routes =====
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stats", statsRoutes);

// ===== Healthcheck =====
app.get("/api/ping", (_req, res) => res.json({ ok: true, message: "pong" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// ===== Swagger =====
const PORT = process.env.PORT || 3000;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Nhật Hoàng API", version: "1.0.0" },
    servers: [
      { url: `http://localhost:${PORT}` },
      { url: "https://motorparts-api.onrender.com" }, // ✅ thêm server Render thật
    ],
  },
  // ✅ sửa đường dẫn này: app.js là file khởi động chính, không phải server.js
  apis: [
    path.join(__dirname, "app.js"),
    path.join(__dirname, "routes", "*.js"),
    // nếu có subfolder: path.join(__dirname, "routes", "**", "*.js"),
  ],
});

// Trang Swagger UI & JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */

app.listen(PORT, () => {
  console.log(`🚀 API đang chạy cổng ${PORT}`);
});
