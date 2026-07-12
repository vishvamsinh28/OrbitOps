import mongoose from "mongoose";

const auditItemSchema = new mongoose.Schema(
  {
    auditCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuditCycle",
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Missing", "Damaged"],
      default: "Pending",
    },
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.models.AuditItem ||
  mongoose.model("AuditItem", auditItemSchema);
