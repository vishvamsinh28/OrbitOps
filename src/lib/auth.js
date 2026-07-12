import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { getSessionUserId } from "./session";
import User from "@/models/User";

export const ROLES = {
  ADMIN: "Admin",
  ASSET_MANAGER: "Asset Manager",
  DEPARTMENT_HEAD: "Department Head",
  EMPLOYEE: "Employee",
};

export async function getCurrentUser() {
  const userId = await getSessionUserId();

  if (!userId) return null;

  await connectDB();

  const user = await User.findById(userId)
    .select("-passwordHash")
    .populate("department", "name")
    .lean();

  if (!user || user.status !== "Active") return null;

  return JSON.parse(JSON.stringify(user));
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return user;
}

export async function requireRole(allowedRoles) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) redirect("/app/dashboard");

  return user;
}

export function canManageAssets(role) {
  return [ROLES.ADMIN, ROLES.ASSET_MANAGER].includes(role);
}

export function canManageOrg(role) {
  return role === ROLES.ADMIN;
}

export const APP_NAV_ITEMS = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Assets", href: "/app/assets" },
  { label: "Bookings", href: "/app/bookings" },
  { label: "Maintenance", href: "/app/maintenance" },
  { label: "Transfers", href: "/app/transfers" },
  { label: "Admin", href: "/app/admin", canAccess: canManageOrg },
  { label: "Notifications", href: "/app/notifications" },
];

export function getVisibleNavItems(role) {
  return APP_NAV_ITEMS.filter((item) => !item.canAccess || item.canAccess(role));
}

export function getQuickActions(role) {
  return [
    {
      label: "Register Asset",
      href: "/app/assets",
      canAccess: canManageAssets,
    },
    {
      label: "Book Resource",
      href: "/app/bookings",
    },
    {
      label: "Raise Maintenance Request",
      href: "/app/maintenance",
    },
    {
      label: "Create Transfer Request",
      href: "/app/transfers",
    },
  ].filter((item) => !item.canAccess || item.canAccess(role));
}
