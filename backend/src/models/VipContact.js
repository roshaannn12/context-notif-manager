import mongoose from "mongoose";

const vipContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  app: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("VipContact", vipContactSchema);
