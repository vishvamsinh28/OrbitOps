"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  activeHolderExists,
  completeTransfer,
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

  const asset = await getAssetById(value(formData, "asset"));
  if (!asset) return;

  const toHolderType = value(formData, "toHolderType");
  const toHolder = value(formData, "toHolder");
  const holderExists = await activeHolderExists(toHolderType, toHolder);

  if (!holderExists) return;

  const transfer = await createTransferRequest({
    asset: asset._id,
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
  if (!canManageAssets(user.role) && user.role !== ROLES.DEPARTMENT_HEAD) {
    return;
  }

  await connectDB();

  const existingTransfer = await getTransferById(value(formData, "transfer"));
  if (!existingTransfer || existingTransfer.status !== "Requested") return;

  const transfer = await decideTransfer({
    transferId: value(formData, "transfer"),
    status: value(formData, "decision") === "approve" ? "Approved" : "Rejected",
    notes: value(formData, "decisionNotes"),
    approvedBy: user._id,
  });
  if (!transfer) return;

  if (transfer.status === "Approved") {
    await updateAssetHolder(transfer.asset, {
      status: "Allocated",
      holderType: transfer.toHolderType,
      holder: transfer.toHolder,
    });
    await completeTransfer(transfer._id);
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
