import { query } from "../db";
import { id, one } from "./shared";

export async function listAuditData(organizationId) {
  const [cycles, departments, users, locations, assets] = await Promise.all([
    query(`select ac.id as "_id", ac.name, ac.scope_type as "scopeType",
      ac.scope_ref_id as "scopeRefId", ac.status,
      ac.assigned_auditors as "assignedAuditors",
      ac.started_at as "startedAt", ac.closed_at as "closedAt",
      ac.created_at as "createdAt", u.name as "createdByName",
      count(ai.id) as "itemCount",
      count(ai.id) filter (where ai.discrepancy = true) as "discrepancyCount"
      from audit_cycles ac
      left join users u on u.id = ac.created_by and u.organization_id = ac.organization_id
      left join audit_items ai on ai.audit_cycle_id = ac.id and ai.organization_id = ac.organization_id
      where ac.organization_id = $1
      group by ac.id, u.name
      order by ac.created_at desc`, [organizationId]),
    query(`select id as "_id", name from departments
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select id as "_id", name, email, role from users
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select distinct location from assets
      where location is not null and location <> '' and organization_id = $1
      order by location`, [organizationId]),
    query(`select id as "_id", asset_tag as "assetTag", name, status, location
      from assets where organization_id = $1 order by asset_tag`, [organizationId]),
  ]);

  return {
    cycles: cycles.rows.map((row) => ({
      ...row,
      assignedAuditors: Array.isArray(row.assignedAuditors)
        ? row.assignedAuditors
        : [],
      itemCount: Number(row.itemCount || 0),
      discrepancyCount: Number(row.discrepancyCount || 0),
    })),
    departments: departments.rows,
    users: users.rows,
    locations: locations.rows.map((row) => row.location),
    assets: assets.rows,
  };
}

export async function getAuditCycleData(cycleId, organizationId) {
  const [cycle, items, users] = await Promise.all([
    query(`select id as "_id", name, scope_type as "scopeType",
      scope_ref_id as "scopeRefId", status,
      assigned_auditors as "assignedAuditors",
      started_at as "startedAt", closed_at as "closedAt"
      from audit_cycles where id = $1 and organization_id = $2`,
      [cycleId, organizationId]),
    query(`select ai.id as "_id", ai.observed_status as "observedStatus",
      ai.notes, ai.discrepancy, ai.checked_by as "checkedById",
      checker.name as "checkedByName",
      a.id as "assetId", a.asset_tag as "assetTag", a.name as "assetName",
      a.status as "assetStatus", a.location
      from audit_items ai
      join assets a on a.id = ai.asset_id and a.organization_id = ai.organization_id
      left join users checker on checker.id = ai.checked_by and checker.organization_id = ai.organization_id
      where ai.audit_cycle_id = $1 and ai.organization_id = $2
      order by a.asset_tag`, [cycleId, organizationId]),
    query(`select id as "_id", name, email from users
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
  ]);

  const cycleRow = one(cycle);
  return {
    cycle: cycleRow
      ? {
          ...cycleRow,
          assignedAuditors: Array.isArray(cycleRow.assignedAuditors)
            ? cycleRow.assignedAuditors
            : [],
        }
      : null,
    items: items.rows,
    users: users.rows,
  };
}

export async function getAuditItemAccess(itemId, organizationId) {
  const result = await query(
    `select ai.id as "_id", ai.audit_cycle_id as "cycleId",
      ac.status as "cycleStatus", ac.assigned_auditors as "assignedAuditors"
     from audit_items ai
     join audit_cycles ac on ac.id = ai.audit_cycle_id and ac.organization_id = ai.organization_id
     where ai.id = $1 and ai.organization_id = $2`,
    [itemId, organizationId],
  );
  const row = one(result);
  return row
    ? {
        ...row,
        assignedAuditors: Array.isArray(row.assignedAuditors)
          ? row.assignedAuditors
          : [],
      }
    : null;
}

export async function createAuditCycle({
  name,
  scopeType,
  scopeRefId,
  auditors,
  createdBy,
  organizationId,
}) {
  const cycleId = id();
  await query(
    `insert into audit_cycles
      (id, organization_id, name, scope_type, scope_ref_id, status,
       created_by, assigned_auditors, started_at)
     values ($1,$2,$3,$4,$5,'Active',$6,$7,now())`,
    [
      cycleId,
      organizationId,
      name,
      scopeType,
      scopeRefId || null,
      createdBy,
      JSON.stringify(auditors || []),
    ],
  );

  const assetFilter =
    scopeType === "Department"
      ? "and department_id = $2"
      : scopeType === "Location"
        ? "and location = $2"
        : "";
  const params = scopeType === "All" ? [organizationId] : [organizationId, scopeRefId];
  const assets = await query(
    `select id from assets where organization_id = $1 ${assetFilter}`,
    params,
  );

  for (const asset of assets.rows) {
    await query(
      `insert into audit_items (id, organization_id, audit_cycle_id, asset_id)
       values ($1,$2,$3,$4)`,
      [id(), organizationId, cycleId, asset.id],
    );
  }

  return { _id: cycleId, name, itemCount: assets.rows.length };
}

export async function updateAuditItem({
  itemId,
  checkedBy,
  observedStatus,
  notes,
  organizationId,
}) {
  const discrepancy = ["Missing", "Damaged"].includes(observedStatus);
  const result = await query(
    `update audit_items set checked_by = $2, observed_status = $3,
      notes = $4, discrepancy = $5, updated_at = now()
     where id = $1 and organization_id = $6
       and exists (
         select 1 from audit_cycles
         where audit_cycles.id = audit_items.audit_cycle_id
           and audit_cycles.organization_id = audit_items.organization_id
           and audit_cycles.status <> 'Closed'
       )
     returning id as "_id", audit_cycle_id as "cycleId",
      asset_id as "asset", observed_status as "observedStatus", discrepancy`,
    [itemId, checkedBy, observedStatus, notes || null, discrepancy, organizationId],
  );
  return one(result);
}

export async function closeAuditCycle(cycleId, organizationId) {
  const result = await query(
    `update audit_cycles set status = 'Closed', closed_at = now(), updated_at = now()
     where id = $1 and organization_id = $2 and status <> 'Closed'
     returning id as "_id", name`,
    [cycleId, organizationId],
  );

  if (!one(result)) return null;

  await query(
    `update assets a set status = 'Lost', updated_at = now()
     from audit_items ai
     where ai.asset_id = a.id and ai.organization_id = a.organization_id
       and ai.audit_cycle_id = $1 and ai.organization_id = $2
       and ai.observed_status = 'Missing'`,
    [cycleId, organizationId],
  );

  await query(
    `update assets a set status = 'Under Maintenance', updated_at = now()
     from audit_items ai
     where ai.asset_id = a.id and ai.organization_id = a.organization_id
       and ai.audit_cycle_id = $1 and ai.organization_id = $2
       and ai.observed_status = 'Damaged'`,
    [cycleId, organizationId],
  );

  return one(result);
}
