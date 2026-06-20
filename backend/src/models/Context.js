import mongoose from "mongoose";

const contextSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "#3b82f6",
  },
  icon: {
    type: String,
    default: "⭐",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Context", contextSchema);
