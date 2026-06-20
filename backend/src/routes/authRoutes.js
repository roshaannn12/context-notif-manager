import express from "express";
import {
  register,
  login,
  getMe,
  updateContext,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/context", protect, updateContext);

export default router;
