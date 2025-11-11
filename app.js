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

// ===== Proxy (Render/Nginx/CF) =====
// Bắt buộc trước rateLimit để ERL đọc đúng X-Forwarded-For
const isProd = process.env.NODE_ENV === "production";
const isRender = process.env.RENDER === "true";
app.set("trust proxy", isRender || isProd ? 1 : false);

// ===== Parsers =====
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
      if (!origin) return cb(null, true); // cho Postman/curl
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

// ===== Bảo mật =====
app.use(helmet());

// v7: dùng limit (max vẫn alias), thêm header chuẩn
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    // Optional: đảm bảo theo IP sau proxy
    keyGenerator: (req) => req.ip,
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

// ===== Healthcheck =====
app.get("/api/ping", (_req, res) => res.json({ ok: true, message: "pong" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// ===== Swagger =====
const PORT = process.env.PORT || 3000;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nhật Hoàng API",
      version: "1.0.0",
      description: "Tài liệu OpenAPI cho MotorParts",
    },
    servers: [
      { url: `http://localhost:${PORT}` },
      { url: "https://motorparts-api.onrender.com" },
    ],
  },
  apis: [
    "./routes/*.js",
    "./routes/**/*.js",
    `${__dirname.replace(/\\/g, "/")}/routes/*.js`,
    `${__dirname.replace(/\\/g, "/")}/routes/**/*.js`,
  ],
});

// Trang Swagger UI & JSON
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
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
