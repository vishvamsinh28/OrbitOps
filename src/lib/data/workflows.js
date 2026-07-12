import { query } from "../db";
import { id, one } from "./shared";

export async function listMaintenanceData(organizationId) {
  const [assets, requests] = await Promise.all([
    query(`select id as "_id", name, asset_tag as "assetTag"
      from assets where organization_id = $1 order by asset_tag`, [organizationId]),
    query(`select m.id as "_id", m.issue_description as "issueDescription",
      m.priority, m.status, m.attachment_url as "attachmentUrl",
      m.assigned_technician_name as "technician",
      m.resolution_notes as "resolutionNotes",
      m.asset_id as "assetId", a.name as "assetName",
      a.asset_tag as "assetTag", u.id as "requestedById", u.name as "requestedByName"
      from maintenance_requests m
      join assets a on a.id = m.asset_id and a.organization_id = m.organization_id
      left join users u on u.id = m.requested_by and u.organization_id = m.organization_id
      where m.organization_id = $1
      order by m.created_at desc`, [organizationId]),
  ]);
  return {
    assets: assets.rows,
    requests: requests.rows.map((row) => ({
      _id: row._id,
      issueDescription: row.issueDescription,
      priority: row.priority,
      status: row.status,
      attachmentUrl: row.attachmentUrl,
      technician: row.technician,
      resolutionNotes: row.resolutionNotes,
      asset: { _id: row.assetId, name: row.assetName, assetTag: row.assetTag },
      requestedBy: row.requestedById
        ? { _id: row.requestedById, name: row.requestedByName }
        : null,
    })),
  };
}

export async function createMaintenanceRequest(data) {
  const result = await query(
    `insert into maintenance_requests
      (id, organization_id, asset_id, requested_by, issue_description,
       priority, attachment_url)
     values ($1,$2,$3,$4,$5,$6,$7) returning id as "_id"`,
    [
      id(), data.organizationId, data.asset, data.requestedBy,
      data.issueDescription, data.priority || "Medium",
      data.attachmentUrl || null,
    ],
  );
  return one(result);
}

export async function updateMaintenanceRequest({
  requestId,
  status,
  technician,
  resolutionNotes,
  organizationId,
}) {
  const result = await query(
    `update maintenance_requests set status = coalesce($2, status),
      assigned_technician_name = $3, resolution_notes = $4, updated_at = now()
     where id = $1 and organization_id = $5
     returning id as "_id", status, asset_id as "asset"`,
    [requestId, status || null, technician || null, resolutionNotes || null, organizationId],
  );
  return one(result);
}

export async function listTransferData(organizationId) {
  const [assets, users, departments, transfers] = await Promise.all([
    query(`select id as "_id", name, asset_tag as "assetTag", status
      from assets
      where status in ('Allocated','Available') and organization_id = $1
      order by asset_tag`, [organizationId]),
    query(`select id as "_id", name, email, role, status from users
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select id as "_id", name, status from departments
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select t.id as "_id", t.status, t.asset_id as "assetId",
      a.name as "assetName", a.asset_tag as "assetTag", a.status as "assetStatus",
      u.id as "requestedById", u.name as "requestedByName"
      from transfer_requests t
      join assets a on a.id = t.asset_id and a.organization_id = t.organization_id
      left join users u on u.id = t.requested_by and u.organization_id = t.organization_id
      where t.organization_id = $1
      order by t.created_at desc`, [organizationId]),
  ]);
  return {
    assets: assets.rows,
    users: users.rows,
    departments: departments.rows,
    transfers: transfers.rows.map((row) => ({
      _id: row._id,
      status: row.status,
      asset: {
        _id: row.assetId,
        name: row.assetName,
        assetTag: row.assetTag,
        status: row.assetStatus,
      },
      requestedBy: row.requestedById
        ? { _id: row.requestedById, name: row.requestedByName }
        : null,
    })),
  };
}

export async function createTransferRequest(data) {
  const result = await query(
    `insert into transfer_requests
      (id, organization_id, asset_id, requested_by, from_holder_type,
       from_holder_id, to_holder_type, to_holder_id, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id as "_id"`,
    [
      id(), data.organizationId, data.asset, data.requestedBy,
      data.fromHolderType || null, data.fromHolder || null,
      data.toHolderType, data.toHolder, data.notes || null,
    ],
  );
  return one(result);
}

export async function getTransferById(transferId, organizationId) {
  const result = await query(
    `select id as "_id", status, asset_id as "asset",
      from_holder_type as "fromHolderType", from_holder_id as "fromHolder",
      to_holder_type as "toHolderType", to_holder_id as "toHolder"
     from transfer_requests where id = $1 and organization_id = $2`,
    [transferId, organizationId],
  );
  return one(result);
}

export async function decideTransfer({
  transferId,
  status,
  notes,
  approvedBy,
  organizationId,
}) {
  const result = await query(
    `update transfer_requests set status = $2, decision_notes = $3,
      approved_by = $4, updated_at = now()
     where id = $1 and organization_id = $5
     returning id as "_id", status, asset_id as "asset",
      to_holder_type as "toHolderType", to_holder_id as "toHolder"`,
    [transferId, status, notes || null, approvedBy, organizationId],
  );
  return one(result);
}

export async function completeTransfer(transferId, organizationId) {
  await query(
    `update transfer_requests set status = 'Completed', updated_at = now()
     where id = $1 and organization_id = $2`,
    [transferId, organizationId],
  );
}
