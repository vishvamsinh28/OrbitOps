import ActivityLog from "@/models/ActivityLog";
import Notification from "@/models/Notification";

export async function logActivity({
  actor,
  action,
  entityType,
  entityId,
  description,
  previousValue,
  newValue,
}) {
  return ActivityLog.create({
    actor,
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

  return Notification.create({
    user,
    title,
    message,
    href,
  });
}
