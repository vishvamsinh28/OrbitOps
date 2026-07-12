import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Department ||
  mongoose.model("Department", departmentSchema);
