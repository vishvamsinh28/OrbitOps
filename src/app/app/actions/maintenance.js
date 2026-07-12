"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  createMaintenanceRequest,
  getAssetById,
  updateAssetHolder,
  updateMaintenanceRequest,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

export async function createMaintenanceAction(formData) {
  const user = await requireUser();
  await connectDB();

  const assetId = value(formData, "asset");
  const asset = await getAssetById(assetId);
  if (!asset) return;

  // Only the asset holder or a manager can raise maintenance
  if (!canManageAssets(user.role) && asset.currentHolder !== user._id) return;

  const request = await createMaintenanceRequest({
    asset: assetId,
    issueDescription: value(formData, "issueDescription"),
    priority: value(formData, "priority") || "Medium",
    requestedBy: user._id,
  });

  await logActivity({
    actor: user._id,
    action: "Maintenance request created",
    entityType: "MaintenanceRequest",
    entityId: request._id,
    description: "Raised a maintenance request.",
  });

  revalidatePath("/app/maintenance");
  revalidatePath("/app/dashboard");
}

export async function updateMaintenanceAction(formData) {
  const user = await requireUser();
  if (!canManageAssets(user.role)) return;

  await connectDB();

  const request = await updateMaintenanceRequest({
    requestId: value(formData, "request"),
    status: value(formData, "status"),
    technician: value(formData, "technician"),
    resolutionNotes: value(formData, "resolutionNotes"),
  });
  if (!request) return;

  if (request.status === "Approved") {
    await updateAssetHolder(request.asset, {
      status: "Under Maintenance",
    });
  }

  if (request.status === "Resolved") {
    await updateAssetHolder(request.asset, { status: "Available" });
  }

  await logActivity({
    actor: user._id,
    action: "Maintenance updated",
    entityType: "MaintenanceRequest",
    entityId: request._id,
    description: `Maintenance moved to ${request.status}.`,
  });

  revalidatePath("/app/maintenance");
  revalidatePath("/app/dashboard");
}
