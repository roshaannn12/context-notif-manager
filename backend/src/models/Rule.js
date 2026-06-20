import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appName: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    enum: ["Work", "Leisure", "Sleep", "Focus", "Commute"],
    required: true,
  },
  action: {
    type: String,
    enum: ["allow", "mute", "snooze"],
    default: "allow",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Rule", ruleSchema);
