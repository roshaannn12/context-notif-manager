import express from "express";
import {
  getVipContacts,
  addVipContact,
  deleteVipContact,
} from "../controllers/vipController.js";

const router = express.Router();

router.get("/:userId", getVipContacts);
router.post("/", addVipContact);
router.delete("/:id", deleteVipContact);

export default router;
