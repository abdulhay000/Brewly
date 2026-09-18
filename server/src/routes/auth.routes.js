import { Router } from "express";
import { signup, login, me, loyalty } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/me", auth, me);
router.get("/me/loyalty", auth, loyalty);

export default router;
