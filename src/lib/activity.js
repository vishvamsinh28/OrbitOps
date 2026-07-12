import { createActivityLog, createNotification } from "./data";

export async function logActivity({
  organization,
  actor,
  action,
  entityType,
  entityId,
  description,
  previousValue,
  newValue,
}) {
  return createActivityLog({
    actor,
    organization,
    action,
    entityType,
    entityId,
    description,
    previousValue,
    newValue,
  });
}

export async function notifyUser({ user, title, message, href }) {
  if (!user) return null;

  return createNotification({
    user,
    title,
    message,
    href,
  });
}
