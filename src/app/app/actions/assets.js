"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  activeHolderExists,
  createAllocation,
  createAsset,
  getAssetById,
  returnAllocation,
  updateAsset,
  updateAssetHolder,
} from "@/lib/data";
import { logActivity, notifyUser } from "@/lib/activity";
import { nextAssetTag, value } from "./shared";

export async function registerAssetAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();

  const asset = await createAsset({
    name: value(formData, "name"),
    assetTag: await nextAssetTag(),
    category: value(formData, "category"),
    serialNumber: value(formData, "serialNumber"),
    acquisitionDate: value(formData, "acquisitionDate") || undefined,
    acquisitionCost: Number(value(formData, "acquisitionCost")) || undefined,
    condition: value(formData, "condition") || "Good",
    location: value(formData, "location"),
    department: value(formData, "department") || undefined,
    description: value(formData, "description"),
    imageUrl: value(formData, "imageUrl"),
    isBookable: formData.get("isBookable") === "on",
  });

  await logActivity({
    actor: user._id,
    action: "Asset registered",
    entityType: "Asset",
    entityId: asset._id,
    description: `Registered ${asset.assetTag}.`,
  });

  revalidatePath("/app/assets");
  revalidatePath("/app/dashboard");
}

export async function allocateAssetAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();

  const asset = await getAssetById(value(formData, "asset"));
  if (!asset || asset.status !== "Available") return;

  const holderType = value(formData, "holderType");
  const holder = value(formData, "holder");
  const holderExists =
    await activeHolderExists(holderType, holder);

  if (!holderExists) return;

  await createAllocation({
    asset: asset._id,
    holderType,
    holder,
    allocatedBy: user._id,
    allocationDate: value(formData, "allocationDate") || new Date(),
    expectedReturnDate: value(formData, "expectedReturnDate") || undefined,
    notes: value(formData, "notes"),
  });

  await updateAssetHolder(asset._id, {
    status: "Allocated",
    holderType,
    holder,
  });

  await logActivity({
    actor: user._id,
    action: "Asset allocated",
    entityType: "Asset",
    entityId: asset._id,
    description: `Allocated ${asset.assetTag}.`,
  });

  if (holderType === "User") {
    await notifyUser({
      user: holder,
      title: "Asset assigned",
      message: `${asset.assetTag} was assigned to you.`,
      href: "/app/assets",
    });
  }

  revalidatePath("/app/assets");
  revalidatePath("/app/dashboard");
}

export async function returnAssetAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();

  const allocation = await returnAllocation({
    allocationId: value(formData, "allocation"),
    conditionNotes: value(formData, "conditionNotes"),
  });
  if (!allocation) return;

  await updateAssetHolder(allocation.asset, {
    status: "Available",
    holderType: null,
    holder: null,
  });

  await logActivity({
    actor: user._id,
    action: "Asset returned",
    entityType: "Allocation",
    entityId: allocation._id,
    description: "Returned an allocated asset.",
  });

  revalidatePath("/app/assets");
  revalidatePath("/app/dashboard");
}

export async function updateAssetAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();

  const assetId = value(formData, "assetId");
  const asset = await updateAsset({
    assetId,
    name: value(formData, "name"),
    category: value(formData, "category"),
    serialNumber: value(formData, "serialNumber"),
    acquisitionDate: value(formData, "acquisitionDate") || undefined,
    acquisitionCost: Number(value(formData, "acquisitionCost")) || undefined,
    condition: value(formData, "condition") || "Good",
    location: value(formData, "location"),
    department: value(formData, "department") || undefined,
    description: value(formData, "description"),
    imageUrl: value(formData, "imageUrl"),
    isBookable: formData.get("isBookable") === "on",
  });
  if (!asset) return;

  await logActivity({
    actor: user._id,
    action: "Asset updated",
    entityType: "Asset",
    entityId: asset._id,
    description: `Updated ${asset.assetTag}.`,
    previousValue: null,
    newValue: null,
  });

  revalidatePath("/app/assets");
  revalidatePath("/app/dashboard");
}
