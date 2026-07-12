import mongoose from "mongoose";

const transferRequestSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromHolderType: {
      type: String,
      enum: ["User", "Department"],
    },
    fromHolder: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "fromHolderType",
    },
    toHolderType: {
      type: String,
      enum: ["User", "Department"],
      required: true,
    },
    toHolder: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "toHolderType",
      required: true,
    },
    notes: String,
    decisionNotes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Requested", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Requested",
    },
  },
  { timestamps: true },
);

export default mongoose.models.TransferRequest ||
  mongoose.model("TransferRequest", transferRequestSchema);
