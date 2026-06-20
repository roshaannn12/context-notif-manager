import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentContext: {
    type: String,
    enum: ["Work", "Leisure", "Sleep", "Focus", "Commute"],
    default: "Leisure",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Auth", authSchema);
