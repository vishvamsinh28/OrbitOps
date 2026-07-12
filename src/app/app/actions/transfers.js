"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import Asset from "@/models/Asset";
import Department from "@/models/Department";
import TransferRequest from "@/models/TransferRequest";
import User from "@/models/User";
import { value } from "./shared";

export async function createTransferAction(formData) {
  const user = await requireUser();
  await connectDB();

  const asset = await Asset.findById(value(formData, "asset"));
  if (!asset) return;

  const toHolderType = value(formData, "toHolderType");
  const toHolder = value(formData, "toHolder");
  const holderExists =
    toHolderType === "User"
      ? await User.exists({ _id: toHolder, status: "Active" })
      : await Department.exists({ _id: toHolder, status: "Active" });

  if (!holderExists) return;

  const transfer = await TransferRequest.create({
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

  const transfer = await TransferRequest.findById(value(formData, "transfer"));
  if (!transfer || transfer.status !== "Requested") return;

  const decision = value(formData, "decision");
  transfer.status = decision === "approve" ? "Approved" : "Rejected";
  transfer.decisionNotes = value(formData, "decisionNotes");
  transfer.approvedBy = user._id;
  await transfer.save();

  if (transfer.status === "Approved") {
    await Asset.findByIdAndUpdate(transfer.asset, {
      status: "Allocated",
      currentHolderType: transfer.toHolderType,
      currentHolder: transfer.toHolder,
    });
    transfer.status = "Completed";
    await transfer.save();
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
