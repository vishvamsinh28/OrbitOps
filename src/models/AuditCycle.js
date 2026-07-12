import mongoose from "mongoose";

const auditCycleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    scopeType: {
      type: String,
      enum: ["Department", "Location"],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    location: String,
    startDate: Date,
    endDate: Date,
    assignedAuditors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Draft", "Active", "Completed", "Closed"],
      default: "Draft",
    },
  },
  { timestamps: true },
);

export default mongoose.models.AuditCycle ||
  mongoose.model("AuditCycle", auditCycleSchema);
