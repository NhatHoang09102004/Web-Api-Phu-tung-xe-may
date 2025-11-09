import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

//baomat
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

// ===== CORS (gọn, chuẩn production) =====
const ALLOW_HOSTS = new Set([
  "nhathoang09102004.github.io", // GitHub Pages của bạn (origin: https://nhathoang09102004.github.io)
  "localhost",
  "motorparts-api.onrender.com",
  "127.0.0.1",

  // ⬇️ TODO: Sau khi deploy, thêm host Render thật vào đây, ví dụ:
  // "your-service.onrender.com",

  // ⬇️ (tuỳ chọn) domain riêng nếu có:
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
//baomat
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 })); // 120 req/phút/IP

// Healthcheck (2 đường dẫn cho tiện)
app.get("/api/ping", (_req, res) => res.json({ ok: true, message: "pong" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// ===== Swagger =====
const PORT = process.env.PORT || 3000;

// Lưu ý: thêm cả server Render/Domain khi có
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Nhật Hoàng API", version: "1.0.0" },
    servers: [
      { url: `http://localhost:${PORT}` },
      // ⬇️ TODO: Sau khi deploy, thêm vào (đúng URL của bạn):
      // { url: "https://your-service.onrender.com" },
      // hoặc: { url: "https://api.yourdomain.com" },
    ],
  },
  // Nếu bạn có JSDoc trong các file route, bật dòng sau:
  apis: ["./server.js", "./routes/*.js"],
});

// Trang Swagger UI & JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

/**
 * @openapi
 * /api/ping:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */

app.listen(PORT, () => {
  console.log(`🚀 API đang chạy cổng ${PORT}`);
});
