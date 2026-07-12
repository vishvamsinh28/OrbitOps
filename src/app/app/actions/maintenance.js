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
import { saveLocalUpload } from "@/lib/uploads";
import { value } from "./shared";

const VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"];
const VALID_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Technician Assigned",
  "In Progress",
  "Resolved",
];

export async function createMaintenanceAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const asset = await getAssetById(value(formData, "asset"), organizationId);
  if (!asset || !value(formData, "issueDescription")) return;

  const request = await createMaintenanceRequest({
    asset: asset._id,
    organizationId,
    issueDescription: value(formData, "issueDescription"),
    priority: VALID_PRIORITIES.includes(value(formData, "priority"))
      ? value(formData, "priority")
      : "Medium",
    attachmentUrl:
      (await saveLocalUpload(formData.get("attachmentFile"), organizationId)) ||
      value(formData, "attachmentUrl"),
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
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const request = await updateMaintenanceRequest({
    requestId: value(formData, "request"),
    status: VALID_STATUSES.includes(value(formData, "status"))
      ? value(formData, "status")
      : "Pending",
    technician: value(formData, "technician"),
    resolutionNotes: value(formData, "resolutionNotes"),
    organizationId,
  });
  if (!request) return;

  if (request.status === "Approved") {
    await updateAssetHolder(request.asset, {
      status: "Under Maintenance",
      organizationId,
    });
  }

  if (request.status === "Resolved") {
    await updateAssetHolder(request.asset, { status: "Available", organizationId });
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
