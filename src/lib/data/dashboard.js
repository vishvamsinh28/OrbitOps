import { query } from "../db";

export async function listDashboardData(organizationId) {
  const now = new Date();
  const result = await Promise.all([
    query("select count(*) from assets where organization_id = $1", [organizationId]),
    query("select count(*) from assets where status = 'Available' and organization_id = $1", [organizationId]),
    query("select count(*) from assets where status = 'Allocated' and organization_id = $1", [organizationId]),
    query("select count(*) from assets where status = 'Under Maintenance' and organization_id = $1", [organizationId]),
    query(`select count(*) from bookings
      where status in ('Upcoming','Ongoing') and end_at >= $1 and organization_id = $2`, [now, organizationId]),
    query("select count(*) from transfer_requests where status = 'Requested' and organization_id = $1", [organizationId]),
    query(`select count(*) from allocations
      where status = 'Active' and expected_return_date >= $1 and organization_id = $2`, [now, organizationId]),
    query(`select count(*) from allocations
      where status = 'Active' and expected_return_date < $1 and organization_id = $2`, [now, organizationId]),
    query("select count(*) from audit_items where discrepancy = true and organization_id = $1", [organizationId]),
    query(`select l.id as "_id", l.action, l.description, u.name as "actorName"
      from activity_logs l
      left join users u on u.id = l.actor_id and u.organization_id = l.organization_id
      where l.organization_id = $1
      order by l.created_at desc limit 8`, [organizationId]),
  ]);
  const count = (i) => Number(result[i].rows[0].count);
  return {
    stats: [
      ["Total assets", count(0)],
      ["Available assets", count(1)],
      ["Allocated assets", count(2)],
      ["Under maintenance", count(3)],
      ["Active bookings", count(4)],
      ["Pending transfers", count(5)],
      ["Upcoming returns", count(6)],
      ["Overdue returns", count(7)],
      ["Audit discrepancies", count(8)],
    ],
    recentActivity: result[9].rows.map((row) => ({
      _id: row._id,
      action: row.action,
      description: row.description,
      actor: row.actorName ? { name: row.actorName } : null,
    })),
  };
}
