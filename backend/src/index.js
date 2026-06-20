import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rules", ruleRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Context Notif Manager API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
