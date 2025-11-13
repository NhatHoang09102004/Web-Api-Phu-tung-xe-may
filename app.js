// app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Routes (giữ nguyên đường dẫn file routes của bạn)
import vehicleRoutes from "./routes/vehicleRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
// import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Trust proxy (Render/Nginx/Cloudflare)
const isProd = process.env.NODE_ENV === "production";
const isRender = process.env.RENDER === "true";
app.set("trust proxy", isRender || isProd ? 1 : false);

// Parsers & compression
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// CORS
const ALLOW_HOSTS = new Set([
  "nhathoang09102004.github.io",
  "localhost",
  "127.0.0.1",
  "motorparts-api.onrender.com",
]);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow Postman / curl
      try {
        const host = new URL(origin).hostname;
        return cb(
          ALLOW_HOSTS.has(host) ? null : new Error("Not allowed by CORS"),
          ALLOW_HOSTS.has(host)
        );
      } catch {
        return cb(new Error("Bad Origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// Security
app.use(helmet());

// Rate limit (ipKeyGenerator => IPv4 & IPv6 safe)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: ipKeyGenerator,
  })
);

// Connect DB
connectDB();

// Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/cart", cartRoutes);
// app.use("/api/stats", statsRoutes);

// Healthchecks
app.get("/api/ping", (_req, res) => res.json({ ok: true, message: "pong" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// Swagger
const PORT = process.env.PORT || 3000;
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Nhật Hoàng API", version: "1.0.0" },
    servers: [
      { url: `http://localhost:${PORT}` },
      { url: "https://motorparts-api.onrender.com" },
    ],
  },
  apis: [
    "./routes/*.js",
    "./routes/**/*.js",
    `${__dirname.replace(/\\/g, "/")}/routes/*.js`,
  ],
});
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

// start
app.listen(PORT, () => console.log(`🚀 API đang chạy cổng ${PORT}`));

export default app;
