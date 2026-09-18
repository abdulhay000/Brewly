import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer"; 
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contentRoutes from "./routes/content.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = new Set(
  String(process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin is not allowed"));
    },
    credentials: true,
  }),
);

app.use("/api", paymentRoutes);

app.use(express.json({ limit: "2mb" }));

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

import { auth, admin } from "./middleware/auth.middleware.js";
import { uploadPhoto } from "./controllers/product.controller.js";
app.post("/api/admin/upload", auth, admin, upload.single("photo"), uploadPhoto);

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", contentRoutes);
app.use("/api", healthRoutes);
app.get("/", (req, res) => res.json({ message: "Brewly API is running" }));

app.use(errorHandler);

export default app;
