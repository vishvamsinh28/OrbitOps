import { randomUUID } from "crypto";

export const id = () => randomUUID();
export const one = (result) => result.rows[0] || null;
export const exists = (result) => Number(result.rows[0]?.count || 0) > 0;

export function userRow(row) {
  if (!row) return null;
  return {
    _id: row._id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    status: row.status,
    department: row.departmentId
      ? { _id: row.departmentId, name: row.departmentName }
      : null,
    createdAt: row.createdAt,
  };
}

export function assetRow(row) {
  if (!row) return null;
  return {
    _id: row._id,
    name: row.name,
    assetTag: row.assetTag,
    category: row.categoryId
      ? { _id: row.categoryId, name: row.categoryName }
      : null,
    serialNumber: row.serialNumber,
    acquisitionDate: row.acquisitionDate,
    acquisitionCost: row.acquisitionCost,
    condition: row.condition,
    location: row.location,
    department: row.departmentId
      ? { _id: row.departmentId, name: row.departmentName }
      : null,
    description: row.description,
    imageUrl: row.imageUrl,
    isBookable: row.isBookable,
    status: row.status,
    currentHolderType: row.currentHolderType,
    currentHolder: row.currentHolder,
    departmentId: row.departmentId,
  };
}
