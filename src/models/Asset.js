import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assetTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    acquisitionDate: Date,
    acquisitionCost: Number,
    condition: {
      type: String,
      default: "Good",
    },
    location: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    description: String,
    imageUrl: String,
    isBookable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "Available",
        "Allocated",
        "Reserved",
        "Under Maintenance",
        "Lost",
        "Retired",
        "Disposed",
      ],
      default: "Available",
    },
    currentHolderType: {
      type: String,
      enum: ["User", "Department", null],
      default: null,
    },
    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "currentHolderType",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Asset || mongoose.model("Asset", assetSchema);
