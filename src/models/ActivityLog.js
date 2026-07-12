import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
    },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    description: String,
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
