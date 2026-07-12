import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTechnicianName: String,
    resolutionNotes: String,
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Technician Assigned",
        "In Progress",
        "Resolved",
      ],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.MaintenanceRequest ||
  mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
