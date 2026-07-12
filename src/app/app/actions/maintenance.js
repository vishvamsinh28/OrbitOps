"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import Asset from "@/models/Asset";
import MaintenanceRequest from "@/models/MaintenanceRequest";
import { value } from "./shared";

export async function createMaintenanceAction(formData) {
  const user = await requireUser();
  await connectDB();

  const request = await MaintenanceRequest.create({
    asset: value(formData, "asset"),
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

  const request = await MaintenanceRequest.findById(
    value(formData, "request"),
  );
  if (!request) return;

  request.status = value(formData, "status") || request.status;
  request.assignedTechnicianName = value(formData, "technician");
  request.resolutionNotes = value(formData, "resolutionNotes");
  await request.save();

  if (request.status === "Approved") {
    await Asset.findByIdAndUpdate(request.asset, {
      status: "Under Maintenance",
    });
  }

  if (request.status === "Resolved") {
    await Asset.findByIdAndUpdate(request.asset, { status: "Available" });
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
