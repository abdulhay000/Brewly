import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  testimonials,
  createTestimonialHandler,
  newsletter,
  contact,
} from "../controllers/content.controller.js";

const router = Router();

router.get("/testimonials", testimonials);
router.post("/testimonials", auth, createTestimonialHandler);
router.post("/newsletter", newsletter);
router.post("/contact", contact);

export default router;
