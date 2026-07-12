"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
import { saveLocalUpload } from "@/lib/uploads";
import { nextAssetTag, value } from "./shared";

export async function registerAssetAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const asset = await createAsset({
    organizationId,
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
    imageUrl:
      (await saveLocalUpload(formData.get("imageFile"), organizationId)) ||
      value(formData, "imageUrl"),
    documentUrl:
      (await saveLocalUpload(formData.get("documentFile"), organizationId)) ||
      value(formData, "documentUrl"),
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

  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const asset = await getAssetById(value(formData, "asset"), organizationId);
  if (!asset) return;
  if (asset.status !== "Available") {
    redirect(`/app/assets?blocked=${asset._id}`);
  }

  const holderType = value(formData, "holderType");
  const holder = value(formData, "holder");
  const holderExists =
    await activeHolderExists(holderType, holder, organizationId);

  if (!holderExists) return;

  await createAllocation({
    asset: asset._id,
    organizationId,
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
    organizationId,
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
      organization: organizationId,
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
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  if (!canManageAssets(user.role)) {
    // Allow asset holder to initiate return
    const allocationId = value(formData, "allocation");
    const allocation = await returnAllocation({
      allocationId,
      conditionNotes: value(formData, "conditionNotes"),
      organizationId,
    });
    if (!allocation) return;
    // Verify the user is the current holder
    const asset = await getAssetById(allocation.asset, organizationId);
    if (!asset || asset.currentHolder !== user._id) return;
    await updateAssetHolder(allocation.asset, {
      status: "Available",
      holderType: null,
      holder: null,
      organizationId,
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
    return;
  }

  const allocation = await returnAllocation({
    allocationId: value(formData, "allocation"),
    conditionNotes: value(formData, "conditionNotes"),
    organizationId,
  });
  if (!allocation) return;

  await updateAssetHolder(allocation.asset, {
    status: "Available",
    holderType: null,
    holder: null,
    organizationId,
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
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const assetId = value(formData, "assetId");
  const asset = await updateAsset({
    organizationId,
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
    imageUrl:
      (await saveLocalUpload(formData.get("imageFile"), organizationId)) ||
      value(formData, "imageUrl"),
    documentUrl:
      (await saveLocalUpload(formData.get("documentFile"), organizationId)) ||
      value(formData, "documentUrl"),
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
