import { query } from "../db";
import { id, one } from "./shared";

export async function createActivityLog({
  organization,
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
      (id, organization_id, actor_id, action, entity_type, entity_id,
       description, previous_value, new_value)
     values ($1, coalesce($2, (select organization_id from users where id = $3)),
      $3,$4,$5,$6,$7,$8,$9)
     returning id as "_id"`,
    [
      id(), organization || null, actor || null, action, entityType,
      entityId || null, description,
      previousValue ? JSON.stringify(previousValue) : null,
      newValue ? JSON.stringify(newValue) : null,
    ],
  );
  return one(result);
}

export async function createNotification({ user, organization, title, message, href }) {
  if (!user) return null;
  const result = await query(
    `insert into notifications (id, organization_id, user_id, title, message, href)
     values ($1, coalesce($2, (select organization_id from users where id = $3)),
      $3,$4,$5,$6) returning id as "_id"`,
    [id(), organization || null, user, title, message, href || null],
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

export async function listActivityLogs(organizationId, limit = 40) {
  const result = await query(
    `select l.id as "_id", l.action, l.entity_type as "entityType",
      l.entity_id as "entityId", l.description, l.created_at as "createdAt",
      u.name as "actorName"
     from activity_logs l
     left join users u on u.id = l.actor_id
     where l.organization_id = $1
     order by l.created_at desc
     limit $2`,
    [organizationId, limit],
  );
  return result.rows.map((row) => ({
    ...row,
    actor: row.actorName ? { name: row.actorName } : null,
  }));
}

export async function markNotificationRead({ notificationId, userId }) {
  await query(
    `update notifications set read_at = now()
     where id = $1 and user_id = $2`,
    [notificationId, userId],
  );
}
