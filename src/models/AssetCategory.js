import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema(
  {
    name: String,
    type: {
      type: String,
      enum: ["Text", "Number", "Date", "Boolean"],
      default: "Text",
    },
  },
  { _id: false },
);

const assetCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    customFields: [customFieldSchema],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.AssetCategory ||
  mongoose.model("AssetCategory", assetCategorySchema);
