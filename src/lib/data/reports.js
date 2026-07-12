import { query } from "../db";

export async function listReportsData(organizationId) {
  const [
    statusBreakdown,
    departmentAllocations,
    mostUsedAssets,
    idleAssets,
    maintenanceFrequency,
    dueForMaintenance,
    bookingHeatmap,
  ] = await Promise.all([
    query(`select status, count(*)::int as count from assets
      where organization_id = $1 group by status order by status`, [organizationId]),
    query(`select coalesce(d.name, 'Unassigned') as department, count(a.id)::int as count
      from assets a
      left join departments d on d.id = a.department_id and d.organization_id = a.organization_id
      where a.organization_id = $1
      group by d.name order by count desc, department`, [organizationId]),
    query(`select a.id as "_id", a.asset_tag as "assetTag", a.name,
      count(b.id)::int as "bookingCount"
      from assets a
      left join bookings b on b.asset_id = a.id
        and b.organization_id = a.organization_id and b.status <> 'Cancelled'
      where a.organization_id = $1
      group by a.id
      order by "bookingCount" desc, a.asset_tag
      limit 8`, [organizationId]),
    query(`select a.id as "_id", a.asset_tag as "assetTag", a.name,
      a.status, a.location
      from assets a
      left join bookings b on b.asset_id = a.id
        and b.organization_id = a.organization_id and b.status <> 'Cancelled'
      left join allocations al on al.asset_id = a.id
        and al.organization_id = a.organization_id and al.status = 'Active'
      where a.organization_id = $1 and b.id is null and al.id is null
      order by a.created_at desc
      limit 12`, [organizationId]),
    query(`select coalesce(c.name, 'Uncategorized') as category,
      count(m.id)::int as count
      from maintenance_requests m
      join assets a on a.id = m.asset_id and a.organization_id = m.organization_id
      left join asset_categories c on c.id = a.category_id and c.organization_id = a.organization_id
      where m.organization_id = $1
      group by c.name order by count desc, category`, [organizationId]),
    query(`select a.id as "_id", a.asset_tag as "assetTag", a.name,
      a.status, a.condition, a.acquisition_date as "acquisitionDate"
      from assets a
      where a.organization_id = $1 and (
        a.status = 'Under Maintenance'
        or a.condition ilike '%poor%'
        or a.condition ilike '%damaged%'
        or (a.acquisition_date is not null and a.acquisition_date < current_date - interval '4 years')
      )
      order by a.acquisition_date nulls last
      limit 12`, [organizationId]),
    query(`select extract(hour from start_at)::int as hour,
      count(*)::int as count
      from bookings
      where status <> 'Cancelled' and organization_id = $1
      group by hour
      order by hour`, [organizationId]),
  ]);

  return {
    statusBreakdown: statusBreakdown.rows,
    departmentAllocations: departmentAllocations.rows,
    mostUsedAssets: mostUsedAssets.rows,
    idleAssets: idleAssets.rows,
    maintenanceFrequency: maintenanceFrequency.rows,
    dueForMaintenance: dueForMaintenance.rows,
    bookingHeatmap: bookingHeatmap.rows,
  };
}
