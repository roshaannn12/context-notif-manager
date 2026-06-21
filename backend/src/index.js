import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contextRoutes from "./routes/contextRoutes.js";
import vipRoutes from "./routes/vipRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://context-notif-manager.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://context-notif-manager.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contexts", contextRoutes);
app.use("/api/vip", vipRoutes);
app.use("/api/push", pushRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Context Notif Manager API is running!" });
});

// Fake notification data
const FAKE_NOTIFICATIONS = [
  { app: "Instagram", message: "Sarah liked your photo" },
  { app: "Gmail", message: "New email: Project Update" },
  { app: "Slack", message: "John mentioned you in #general" },
  { app: "WhatsApp", message: "New message from Alex" },
  { app: "YouTube", message: "New video from your subscription" },
  { app: "Twitter", message: "You have 5 new mentions" },
  { app: "Discord", message: "New message in #random" },
  { app: "Telegram", message: "New message from Mom" },
  { app: "Instagram", message: "Mike started following you" },
  { app: "Gmail", message: "Meeting reminder in 30 minutes" },
  { app: "Slack", message: "Standup starting now!" },
  { app: "WhatsApp", message: "You were added to a group" },
];

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const interval = setInterval(() => {
    const randomNotif =
      FAKE_NOTIFICATIONS[Math.floor(Math.random() * FAKE_NOTIFICATIONS.length)];
    socket.emit("new-notification", {
      id: Date.now(),
      app: randomNotif.app,
      message: randomNotif.message,
      time: "just now",
    });
  }, 4000);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(interval);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
