import { Router } from "express";
import express from "express";
import { telebirrNotify, options } from "../controllers/payment.controller.js";

const router = Router();

router.post("/payments/telebirr/notify", express.text({ type: "*/*" }), telebirrNotify);
router.get("/payments/options", options);

export default router;
