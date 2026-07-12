"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  activeHolderExists,
  closeActiveAllocationsForAsset,
  completeTransfer,
  createAllocation,
  createTransferRequest,
  decideTransfer,
  getAssetById,
  getTransferById,
  updateAssetHolder,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

export async function createTransferAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const asset = await getAssetById(value(formData, "asset"), organizationId);
  if (!asset) return;

  const toHolderType = value(formData, "toHolderType");
  const toHolder = value(formData, "toHolder");
  const holderExists = await activeHolderExists(toHolderType, toHolder, organizationId);

  if (!holderExists) return;

  const transfer = await createTransferRequest({
    asset: asset._id,
    organizationId,
    requestedBy: user._id,
    fromHolderType: asset.currentHolderType,
    fromHolder: asset.currentHolder,
    toHolderType,
    toHolder,
    notes: value(formData, "notes"),
  });

  await logActivity({
    actor: user._id,
    action: "Transfer requested",
    entityType: "TransferRequest",
    entityId: transfer._id,
    description: `Requested transfer for ${asset.assetTag}.`,
  });

  revalidatePath("/app/transfers");
}

export async function decideTransferAction(formData) {
  const user = await requireUser();
  const isAssetManager = canManageAssets(user.role);
  const isDepartmentHead = user.role === ROLES.DEPARTMENT_HEAD;
  if (!isAssetManager && !isDepartmentHead) {
    return;
  }

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const existingTransfer = await getTransferById(value(formData, "transfer"), organizationId);
  if (!existingTransfer || existingTransfer.status !== "Requested") return;
  if (isDepartmentHead) {
    const departmentId = user.department?._id;
    const touchesDepartment =
      departmentId &&
      ((existingTransfer.fromHolderType === "Department" &&
        existingTransfer.fromHolder === departmentId) ||
        (existingTransfer.toHolderType === "Department" &&
          existingTransfer.toHolder === departmentId));

    if (!touchesDepartment) return;
  }

  // Department Heads can only decide transfers within their own department
  if (user.role === ROLES.DEPARTMENT_HEAD) {
    const asset = await getAssetById(existingTransfer.asset);
    if (!asset || asset.departmentId !== user.department?._id) return;
  }

  const transfer = await decideTransfer({
    transferId: value(formData, "transfer"),
    status: value(formData, "decision") === "approve" ? "Approved" : "Rejected",
    notes: value(formData, "decisionNotes"),
    approvedBy: user._id,
    organizationId,
  });
  if (!transfer) return;

  if (transfer.status === "Approved") {
    await closeActiveAllocationsForAsset(
      transfer.asset,
      value(formData, "decisionNotes") || "Transferred to a new holder",
      organizationId,
    );
    await createAllocation({
      asset: transfer.asset,
      organizationId,
      holderType: transfer.toHolderType,
      holder: transfer.toHolder,
      allocatedBy: user._id,
      allocationDate: new Date(),
      notes: "Created from approved transfer request",
    });
    await updateAssetHolder(transfer.asset, {
      status: "Allocated",
      holderType: transfer.toHolderType,
      holder: transfer.toHolder,
      organizationId,
    });
    await completeTransfer(transfer._id, organizationId);
    transfer.status = "Completed";
  }

  await logActivity({
    actor: user._id,
    action: `Transfer ${transfer.status.toLowerCase()}`,
    entityType: "TransferRequest",
    entityId: transfer._id,
    description: `Transfer ${transfer.status.toLowerCase()}.`,
  });

  revalidatePath("/app/transfers");
  revalidatePath("/app/assets");
}
