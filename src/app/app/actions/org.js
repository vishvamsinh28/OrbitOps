"use server";

import { revalidatePath } from "next/cache";
import { canManageOrg, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {
  createCategory,
  createDepartment,
  updateCategory,
  updateDepartment,
  updateEmployee,
} from "@/lib/data";
import { logActivity } from "@/lib/activity";
import { value } from "./shared";

const VALID_STATUSES = ["Active", "Inactive"];
const VALID_ROLES = Object.values(ROLES);

export async function createDepartmentAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const department = await createDepartment({
    name: value(formData, "name"),
    parent: value(formData, "parent") || undefined,
    head: value(formData, "head") || undefined,
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Department created",
    entityType: "Department",
    entityId: department._id,
    description: `Created ${department.name}.`,
  });

  revalidatePath("/app/admin");
}

export async function createCategoryAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const category = await createCategory({
    name: value(formData, "name"),
    customFields: value(formData, "customFields"),
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Category created",
    entityType: "AssetCategory",
    entityId: category._id,
    description: `Created ${category.name}.`,
  });

  revalidatePath("/app/admin");
  revalidatePath("/app/assets");
}

export async function updateDepartmentAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const department = await updateDepartment({
    departmentId: value(formData, "departmentId"),
    name: value(formData, "name"),
    parent: value(formData, "parent"),
    head: value(formData, "head"),
    status: VALID_STATUSES.includes(value(formData, "status"))
      ? value(formData, "status")
      : "Active",
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Department updated",
    entityType: "Department",
    entityId: department?._id,
    description: `Updated ${department?.name}.`,
  });

  revalidatePath("/app/admin");
}

export async function updateCategoryAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const category = await updateCategory({
    categoryId: value(formData, "categoryId"),
    name: value(formData, "name"),
    status: VALID_STATUSES.includes(value(formData, "status"))
      ? value(formData, "status")
      : "Active",
    customFields: value(formData, "customFields"),
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Category updated",
    entityType: "AssetCategory",
    entityId: category?._id,
    description: `Updated ${category?.name}.`,
  });

  revalidatePath("/app/admin");
  revalidatePath("/app/assets");
}

export async function updateEmployeeAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();
  const organizationId = user.organization?._id;
  if (!organizationId) return;

  const updatedUser = await updateEmployee({
    employeeId: value(formData, "employeeId"),
    role: VALID_ROLES.includes(value(formData, "role"))
      ? value(formData, "role")
      : ROLES.EMPLOYEE,
    department: value(formData, "department"),
    status: VALID_STATUSES.includes(value(formData, "status"))
      ? value(formData, "status")
      : "Active",
    organizationId,
  });

  await logActivity({
    actor: user._id,
    action: "Employee role changed",
    entityType: "User",
    entityId: updatedUser?._id,
    description: `Updated ${updatedUser?.name}.`,
  });

  revalidatePath("/app/admin");
}
