import { query } from "../db";

export async function listDashboardData() {
  const now = new Date();
  const result = await Promise.all([
    query("select count(*) from assets"),
    query("select count(*) from assets where status = 'Available'"),
    query("select count(*) from assets where status = 'Allocated'"),
    query("select count(*) from assets where status = 'Under Maintenance'"),
    query("select count(*) from bookings where status in ('Upcoming','Ongoing') and end_at >= $1", [now]),
    query("select count(*) from transfer_requests where status = 'Requested'"),
    query("select count(*) from allocations where status = 'Active' and expected_return_date >= $1", [now]),
    query("select count(*) from allocations where status = 'Active' and expected_return_date < $1", [now]),
    query(`select l.id as "_id", l.action, l.description, u.name as "actorName"
      from activity_logs l left join users u on u.id = l.actor_id
      order by l.created_at desc limit 8`),
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
    ],
    recentActivity: result[8].rows.map((row) => ({
      _id: row._id,
      action: row.action,
      description: row.description,
      actor: row.actorName ? { name: row.actorName } : null,
    })),
  };
}
