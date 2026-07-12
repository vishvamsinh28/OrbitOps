import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: String,
    href: String,
    readAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
