import webpush from "web-push";
import PushSubscription from "../models/PushSubscription.js";
import Rule from "../models/Rule.js";
import Auth from "../models/Auth.js";
import dotenv from "dotenv";
dotenv.config();

webpush.setVapidDetails(
  "mailto:admin@notifmanager.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Save push subscription
export const saveSubscription = async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    // Remove old subscription if exists
    await PushSubscription.findOneAndDelete({ userId });

    const newSub = await PushSubscription.create({ userId, subscription });
    res.status(201).json({ message: "Subscription saved!", sub: newSub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a test push notification
export const sendTestNotification = async (req, res) => {
  try {
    const { userId } = req.body;

    const subDoc = await PushSubscription.findOne({ userId });
    if (!subDoc) {
      return res.status(404).json({ message: "No subscription found!" });
    }

    const payload = JSON.stringify({
      title: "NotifManager",
      body: "🔔 Push notifications are working!",
      icon: "/icon.png",
    });

    await webpush.sendNotification(subDoc.subscription, payload);
    res.json({ message: "Test notification sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send filtered notification
export const sendFilteredNotification = async (req, res) => {
  try {
    const { userId, appName, message } = req.body;

    // Get user's current context
    const user = await Auth.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Check rules
    const rule = await Rule.findOne({
      userId,
      appName,
      context: user.currentContext,
    });

    const action = rule ? rule.action : "allow";

    if (action === "mute") {
      return res.json({ message: "Notification muted!", action: "mute" });
    }

    if (action === "snooze") {
      setTimeout(
        async () => {
          const subDoc = await PushSubscription.findOne({ userId });
          if (subDoc) {
            const payload = JSON.stringify({
              title: appName,
              body: `⏰ Snoozed: ${message}`,
              icon: "/icon.png",
            });
            await webpush.sendNotification(subDoc.subscription, payload);
          }
        },
        30 * 60 * 1000,
      ); // 30 minutes
      return res.json({
        message: "Notification snoozed for 30 minutes!",
        action: "snooze",
      });
    }

    // Allow — send immediately
    const subDoc = await PushSubscription.findOne({ userId });
    if (!subDoc)
      return res.status(404).json({ message: "No subscription found!" });

    const payload = JSON.stringify({
      title: appName,
      body: message,
      icon: "/icon.png",
    });

    await webpush.sendNotification(subDoc.subscription, payload);
    res.json({ message: "Notification sent!", action: "allow" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get VAPID public key
export const getVapidPublicKey = async (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
