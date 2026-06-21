import express from "express";
import {
  saveSubscription,
  sendTestNotification,
  sendFilteredNotification,
  getVapidPublicKey,
} from "../controllers/pushController.js";

const router = express.Router();

router.get("/vapid-public-key", getVapidPublicKey);
router.post("/subscribe", saveSubscription);
router.post("/test", sendTestNotification);
router.post("/send", sendFilteredNotification);

export default router;
