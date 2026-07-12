"use server";

import { revalidatePath } from "next/cache";
import { canManageOrg, requireUser, ROLES } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import AssetCategory from "@/models/AssetCategory";
import Department from "@/models/Department";
import User from "@/models/User";
import { value } from "./shared";

export async function createDepartmentAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();

  const department = await Department.create({
    name: value(formData, "name"),
    parent: value(formData, "parent") || undefined,
    head: value(formData, "head") || undefined,
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

  const category = await AssetCategory.create({
    name: value(formData, "name"),
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

export async function updateEmployeeAction(formData) {
  const user = await requireUser();
  if (!canManageOrg(user.role)) return;

  await connectDB();

  const updatedUser = await User.findByIdAndUpdate(
    value(formData, "employeeId"),
    {
      role: value(formData, "role") || ROLES.EMPLOYEE,
      department: value(formData, "department") || undefined,
      status: value(formData, "status") || "Active",
    },
    { new: true },
  );

  await logActivity({
    actor: user._id,
    action: "Employee role changed",
    entityType: "User",
    entityId: updatedUser?._id,
    description: `Updated ${updatedUser?.name}.`,
  });

  revalidatePath("/app/admin");
}
