import express from "express";
import {
  createRule,
  getUserRules,
  updateRule,
  deleteRule,
} from "../controllers/ruleController.js";

const router = express.Router();

router.post("/", createRule);
router.get("/:userId", getUserRules);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);

export default router;
