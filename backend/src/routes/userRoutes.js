import express from "express";
import {
  createUser,
  getUser,
  updateContext,
  getUserByEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/by-email/:email", getUserByEmail);
router.get("/:id", getUser);
router.put("/:id/context", updateContext);

export default router;
