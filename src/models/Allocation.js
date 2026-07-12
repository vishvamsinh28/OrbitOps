import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    holderType: {
      type: String,
      enum: ["User", "Department"],
      required: true,
    },
    holder: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "holderType",
      required: true,
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allocationDate: {
      type: Date,
      default: Date.now,
    },
    expectedReturnDate: Date,
    returnDate: Date,
    notes: String,
    conditionNotes: String,
    status: {
      type: String,
      enum: ["Active", "Returned"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Allocation ||
  mongoose.model("Allocation", allocationSchema);
