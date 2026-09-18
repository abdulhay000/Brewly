import { Router } from "express";
const router = Router();
router.get("/health", (req, res) => res.json({ ok: true }));
router.get("/", (req, res) => res.json({ message: "Brewly API is running" }));
export default router;
