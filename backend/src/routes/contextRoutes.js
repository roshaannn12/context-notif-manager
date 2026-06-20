import express from "express";
import {
  getContexts,
  createContext,
  deleteContext,
} from "../controllers/contextController.js";

const router = express.Router();

router.get("/:userId", getContexts);
router.post("/", createContext);
router.delete("/:id", deleteContext);

export default router;
