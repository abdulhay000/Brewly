import { Router } from "express";
import {
  categories,
  products,
  featuredProducts,
  adminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadPhoto,
} from "../controllers/product.controller.js";
import { auth, admin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/categories", categories);
router.get("/products", products);
router.get("/products/featured", featuredProducts);
router.get("/admin/products", auth, admin, adminProducts);
router.post("/admin/products", auth, admin, createAdminProduct);
router.put("/admin/products/:id", auth, admin, updateAdminProduct);
router.delete("/admin/products/:id", auth, admin, deleteAdminProduct);

export default router;
