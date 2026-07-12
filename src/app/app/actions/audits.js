"use server";

import { revalidatePath } from "next/cache";
import { canManageAssets, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  closeAuditCycle,
  createAuditCycle,
  getAuditItemAccess,
  updateAuditItem,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

function auditorsFromForm(formData) {
  const values = formData.getAll("auditors");
  return values.map((item) => String(item)).filter(Boolean);
}

const VALID_SCOPE_TYPES = ["All", "Department", "Location"];
const VALID_OBSERVED_STATUSES = ["Verified", "Missing", "Damaged"];

export async function createAuditCycleAction(formData) {
  const user = await requireUser();
  if (user.role !== ROLES.ADMIN && !canManageAssets(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const requestedScopeType = value(formData, "scopeType") || "All";
  const scopeType = VALID_SCOPE_TYPES.includes(requestedScopeType)
    ? requestedScopeType
    : "All";
  const scopeRefId =
    scopeType === "Department"
      ? value(formData, "department")
      : scopeType === "Location"
        ? value(formData, "location")
        : "";

  const cycle = await createAuditCycle({
    name: value(formData, "name"),
    scopeType,
    scopeRefId,
    auditors: auditorsFromForm(formData),
    createdBy: user._id,
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Audit cycle created",
    entityType: "AuditCycle",
    entityId: cycle._id,
    description: `Created ${cycle.name} with ${cycle.itemCount} assets.`,
  });

  revalidatePath("/app/audits");
  revalidatePath("/app/dashboard");
}

export async function updateAuditItemAction(formData) {
  const user = await requireUser();
  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const itemId = value(formData, "item");
  const access = await getAuditItemAccess(itemId, organizationId);
  if (!access || access.cycleStatus === "Closed") return;

  const canAudit =
    canManageAssets(user.role) ||
    user.role === ROLES.ADMIN ||
    access.assignedAuditors.includes(user._id);
  if (!canAudit) return;

  const observedStatus = VALID_OBSERVED_STATUSES.includes(
    value(formData, "observedStatus"),
  )
    ? value(formData, "observedStatus")
    : "Verified";

  const item = await updateAuditItem({
    itemId,
    checkedBy: user._id,
    observedStatus,
    notes: value(formData, "notes"),
    organizationId,
  });
  if (!item) return;

  await logActivity({
    actor: user._id,
    action: item.discrepancy ? "Audit discrepancy flagged" : "Audit item verified",
    entityType: "AuditItem",
    entityId: item._id,
    description: `Marked audit item as ${item.observedStatus}.`,
  });

  revalidatePath("/app/audits");
  revalidatePath(`/app/audits/${item.cycleId}`);
}

export async function closeAuditCycleAction(formData) {
  const user = await requireUser();
  if (user.role !== ROLES.ADMIN && !canManageAssets(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const cycle = await closeAuditCycle(value(formData, "cycle"), organizationId);
  if (!cycle) return;

  await logActivity({
    actor: user._id,
    action: "Audit cycle closed",
    entityType: "AuditCycle",
    entityId: cycle._id,
    description: `Closed ${cycle.name}.`,
  });

  revalidatePath("/app/audits");
  revalidatePath("/app/assets");
  revalidatePath("/app/dashboard");
}
