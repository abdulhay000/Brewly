import { Router } from "express";
import { auth, admin } from "../middleware/auth.middleware.js";
import {
  create,
  list,
  adminList,
  status,
  payment,
  verifyTelebirr,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/orders", auth, create);
router.get("/orders", auth, list);
router.get("/admin/orders", auth, admin, adminList);
router.put("/admin/orders/:id/status", auth, admin, status);
router.put("/admin/orders/:id/payment", auth, admin, payment);
router.post("/payments/telebirr/verify/:orderId", auth, verifyTelebirr);

export default router;
