import { query } from "../db";
import { id, one } from "./shared";

export async function createActivityLog({
  actor,
  action,
  entityType,
  entityId,
  description,
  previousValue,
  newValue,
}) {
  const result = await query(
    `insert into activity_logs
      (id, actor_id, action, entity_type, entity_id, description, previous_value, new_value)
     values ($1,$2,$3,$4,$5,$6,$7,$8)
     returning id as "_id"`,
    [
      id(), actor || null, action, entityType, entityId || null, description,
      previousValue ? JSON.stringify(previousValue) : null,
      newValue ? JSON.stringify(newValue) : null,
    ],
  );
  return one(result);
}

export async function createNotification({ user, title, message, href }) {
  if (!user) return null;
  const result = await query(
    `insert into notifications (id, user_id, title, message, href)
     values ($1,$2,$3,$4,$5) returning id as "_id"`,
    [id(), user, title, message, href || null],
  );
  return one(result);
}

export async function listNotifications(userId) {
  const result = await query(
    `select id as "_id", title, message, href, read_at as "readAt",
      created_at as "createdAt"
     from notifications where user_id = $1 order by created_at desc`,
    [userId],
  );
  return result.rows;
}

export async function markNotificationRead({ notificationId, userId }) {
  await query(
    `update notifications set read_at = now()
     where id = $1 and user_id = $2`,
    [notificationId, userId],
  );
}
