import { query } from "../db";
import { assetRow, exists, id, one } from "./shared";

export async function nextAssetTag() {
  const result = await query(
    `insert into counters (name, value) values ('assetTag', 1)
     on conflict (name) do update set value = counters.value + 1
     returning value`,
  );
  return `ORB-${String(result.rows[0].value).padStart(4, "0")}`;
}

export async function listAssetsData(organizationId, filters = {}) {
  const clauses = ["a.organization_id = $1"];
  const params = [organizationId];
  const addParam = (value) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (filters.search) {
    const search = addParam(`%${filters.search}%`);
    clauses.push(`(a.name ilike ${search} or a.asset_tag ilike ${search}
      or a.serial_number ilike ${search} or a.location ilike ${search})`);
  }

  if (filters.status) clauses.push(`a.status = ${addParam(filters.status)}`);
  if (filters.category) clauses.push(`a.category_id = ${addParam(filters.category)}`);
  if (filters.department) clauses.push(`a.department_id = ${addParam(filters.department)}`);

  const [assets, categories, departments, users, allocations] = await Promise.all([
    query(`select a.id as "_id", a.name, a.asset_tag as "assetTag",
      a.category_id as "categoryId", c.name as "categoryName",
      a.serial_number as "serialNumber", a.acquisition_date as "acquisitionDate",
      a.acquisition_cost as "acquisitionCost", a.condition, a.location,
      a.department_id as "departmentId", d.name as "departmentName",
      a.description, a.image_url as "imageUrl", a.document_url as "documentUrl",
      a.is_bookable as "isBookable", a.status,
      a.current_holder_type as "currentHolderType",
      a.current_holder_id as "currentHolder",
      coalesce(hu.name, hd.name) as "currentHolderName"
      from assets a
      left join asset_categories c on c.id = a.category_id and c.organization_id = a.organization_id
      left join departments d on d.id = a.department_id and d.organization_id = a.organization_id
      left join users hu on a.current_holder_type = 'User'
        and hu.id = a.current_holder_id and hu.organization_id = a.organization_id
      left join departments hd on a.current_holder_type = 'Department'
        and hd.id = a.current_holder_id and hd.organization_id = a.organization_id
      where ${clauses.join(" and ")}
      order by a.created_at desc`, params),
    query(`select id as "_id", name, status from asset_categories
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select id as "_id", name, status from departments
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select id as "_id", name, email, role, status from users
      where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
    query(`select al.id as "_id", al.expected_return_date as "expectedReturnDate",
      al.asset_id as "assetId", al.holder_type as "holderType",
      al.holder_id as "holder", a.name as "assetName", a.asset_tag as "assetTag"
      from allocations al
      join assets a on a.id = al.asset_id and a.organization_id = al.organization_id
      where al.status = 'Active' and al.organization_id = $1
      order by al.created_at desc`, [organizationId]),
  ]);

  return {
    assets: assets.rows.map((row) => ({
      ...assetRow(row),
      currentHolderName: row.currentHolderName,
    })),
    categories: categories.rows,
    departments: departments.rows,
    users: users.rows,
    allocations: allocations.rows.map((row) => ({
      _id: row._id,
      expectedReturnDate: row.expectedReturnDate,
      holderType: row.holderType,
      holder: row.holder,
      asset: { _id: row.assetId, name: row.assetName, assetTag: row.assetTag },
    })),
  };
}

export async function getAssetById(assetId, organizationId) {
  const result = await query(
    `select id as "_id", name, asset_tag as "assetTag", status,
      department_id as "departmentId", is_bookable as "isBookable",
      current_holder_type as "currentHolderType",
      current_holder_id as "currentHolder"
     from assets where id = $1 and organization_id = $2`,
    [assetId, organizationId],
  );
  return assetRow(one(result));
}

export async function getAssetEditData(assetId, organizationId) {
  const [asset, categories, departments, allocationHistory, maintenanceHistory] =
    await Promise.all([
      query(`select a.id as "_id", a.name, a.asset_tag as "assetTag",
        a.category_id as "categoryId", c.name as "categoryName",
        a.serial_number as "serialNumber", a.acquisition_date as "acquisitionDate",
        a.acquisition_cost as "acquisitionCost", a.condition, a.location,
        a.department_id as "departmentId", d.name as "departmentName",
        a.description, a.image_url as "imageUrl", a.document_url as "documentUrl",
        a.is_bookable as "isBookable", a.status,
        a.current_holder_type as "currentHolderType",
        a.current_holder_id as "currentHolder"
        from assets a
        left join asset_categories c on c.id = a.category_id and c.organization_id = a.organization_id
        left join departments d on d.id = a.department_id and d.organization_id = a.organization_id
        where a.id = $1 and a.organization_id = $2`, [assetId, organizationId]),
      query(`select id as "_id", name, status from asset_categories
        where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
      query(`select id as "_id", name, status from departments
        where status = 'Active' and organization_id = $1 order by name`, [organizationId]),
      query(`select al.id as "_id", al.holder_type as "holderType",
        al.holder_id as "holderId", coalesce(u.name, d.name) as "holderName",
        al.allocation_date as "allocationDate",
        al.expected_return_date as "expectedReturnDate",
        al.return_date as "returnDate", al.status, al.notes,
        al.condition_notes as "conditionNotes"
        from allocations al
        left join users u on al.holder_type = 'User'
          and u.id = al.holder_id and u.organization_id = al.organization_id
        left join departments d on al.holder_type = 'Department'
          and d.id = al.holder_id and d.organization_id = al.organization_id
        where al.asset_id = $1 and al.organization_id = $2
        order by al.created_at desc`, [assetId, organizationId]),
      query(`select m.id as "_id", m.issue_description as "issueDescription",
        m.priority, m.status, m.attachment_url as "attachmentUrl",
        m.assigned_technician_name as "technician",
        m.resolution_notes as "resolutionNotes",
        m.created_at as "createdAt", u.name as "requestedByName"
        from maintenance_requests m
        left join users u on u.id = m.requested_by and u.organization_id = m.organization_id
        where m.asset_id = $1 and m.organization_id = $2
        order by m.created_at desc`, [assetId, organizationId]),
    ]);

  return {
    asset: assetRow(one(asset)),
    categories: categories.rows,
    departments: departments.rows,
    allocationHistory: allocationHistory.rows,
    maintenanceHistory: maintenanceHistory.rows,
  };
}

export async function createAsset(data) {
  const result = await query(
    `insert into assets
      (id, organization_id, name, asset_tag, category_id, serial_number,
       acquisition_date, acquisition_cost, condition, location, department_id,
       description, image_url, document_url, is_bookable)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     returning id as "_id", asset_tag as "assetTag"`,
    [
      id(), data.organizationId, data.name, data.assetTag,
      data.category || null, data.serialNumber || null,
      data.acquisitionDate || null, data.acquisitionCost || null,
      data.condition || "Good", data.location || null,
      data.department || null, data.description || null,
      data.imageUrl || null, data.documentUrl || null, data.isBookable,
    ],
  );
  return one(result);
}

export async function updateAsset(data) {
  const result = await query(
    `update assets set name = $2, category_id = $3, serial_number = $4,
      acquisition_date = $5, acquisition_cost = $6, condition = $7,
      location = $8, department_id = $9, description = $10,
      image_url = $11, document_url = $12, is_bookable = $13, updated_at = now()
     where id = $1 and organization_id = $14
     returning id as "_id", asset_tag as "assetTag"`,
    [
      data.assetId, data.name, data.category || null,
      data.serialNumber || null, data.acquisitionDate || null,
      data.acquisitionCost || null, data.condition || "Good",
      data.location || null, data.department || null,
      data.description || null, data.imageUrl || null,
      data.documentUrl || null, data.isBookable, data.organizationId,
    ],
  );
  return one(result);
}

export async function createAllocation(data) {
  const allocationId = id();
  await query(
    `insert into allocations
      (id, organization_id, asset_id, holder_type, holder_id, allocated_by,
       allocation_date, expected_return_date, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [
      allocationId, data.organizationId, data.asset, data.holderType,
      data.holder, data.allocatedBy, data.allocationDate || new Date(),
      data.expectedReturnDate || null, data.notes || null,
    ],
  );
  return { _id: allocationId };
}

export async function updateAssetHolder(assetId, updates) {
  const { status, holderType, holder, organizationId } = updates;
  await query(
    `update assets set status = coalesce($2, status),
      current_holder_type = case when $3::boolean then $4 else current_holder_type end,
      current_holder_id = case when $3::boolean then $5 else current_holder_id end,
      updated_at = now()
     where id = $1 and organization_id = $6`,
    [
      assetId, status || null,
      Object.prototype.hasOwnProperty.call(updates, "holderType"),
      holderType || null, holder || null, organizationId,
    ],
  );
}

export async function returnAllocation({ allocationId, conditionNotes, organizationId }) {
  const result = await query(
    `update allocations set status = 'Returned', return_date = now(),
      condition_notes = $2, updated_at = now()
     where id = $1 and status = 'Active' and organization_id = $3
     returning id as "_id", asset_id as "asset"`,
    [allocationId, conditionNotes || null, organizationId],
  );
  return one(result);
}

export async function closeActiveAllocationsForAsset(
  assetId,
  conditionNotes,
  organizationId,
) {
  await query(
    `update allocations set status = 'Transferred', return_date = now(),
      condition_notes = $2, updated_at = now()
     where asset_id = $1 and status = 'Active' and organization_id = $3`,
    [assetId, conditionNotes || "Closed by transfer approval", organizationId],
  );
}

export async function createBooking({
  asset,
  bookedBy,
  start,
  end,
  purpose,
  organizationId,
}) {
  const result = await query(
    `insert into bookings
      (id, organization_id, asset_id, booked_by, start_at, end_at, purpose)
     values ($1,$2,$3,$4,$5,$6,$7) returning id as "_id"`,
    [id(), organizationId, asset, bookedBy, start, end, purpose || null],
  );
  return one(result);
}

export async function rescheduleBooking({
  bookingId,
  userId,
  isManager,
  start,
  end,
  organizationId,
}) {
  const result = await query(
    `update bookings b set start_at = $4, end_at = $5, status = 'Upcoming',
      updated_at = now()
     from assets a
     where b.asset_id = a.id and b.id = $1 and b.organization_id = $6
       and b.status not in ('Cancelled', 'Completed')
       and ($2 = true or b.booked_by = $3)
     returning b.id as "_id", b.asset_id as "asset", a.asset_tag as "assetTag"`,
    [bookingId, isManager, userId, start, end, organizationId],
  );
  return one(result);
}

export async function getBookingById(bookingId, organizationId) {
  const result = await query(
    `select id as "_id", asset_id as "asset", booked_by as "bookedBy",
      start_at as start, end_at as end, status
     from bookings where id = $1 and organization_id = $2`,
    [bookingId, organizationId],
  );
  return one(result);
}

export async function bookingOverlaps({
  asset,
  start,
  end,
  exceptBooking,
  organizationId,
}) {
  const params = [asset, start, end, organizationId];
  const except = exceptBooking ? `and id <> $5` : "";
  if (exceptBooking) params.push(exceptBooking);
  return exists(await query(
    `select count(*) from bookings
     where asset_id = $1 and status <> 'Cancelled' and organization_id = $4
       ${except}
       and start_at < $3 and end_at > $2`,
    params,
  ));
}

export async function cancelBooking({ bookingId, userId, isManager, organizationId }) {
  const result = await query(
    `update bookings b set status = 'Cancelled', updated_at = now()
     from assets a
     where b.asset_id = a.id and b.id = $1 and b.organization_id = $4
       and b.status not in ('Cancelled', 'Completed')
       and ($2 = true or b.booked_by = $3)
     returning b.id as "_id", b.asset_id as "asset", a.asset_tag as "assetTag"`,
    [bookingId, isManager, userId, organizationId],
  );
  return one(result);
}

export async function listBookingData(organizationId) {
  const [resources, bookings] = await Promise.all([
    query(`select id as "_id", name, asset_tag as "assetTag"
      from assets
      where is_bookable = true and organization_id = $1 order by name`, [organizationId]),
    query(`select b.id as "_id", b.start_at as start, b.end_at as end,
      case
        when b.status = 'Cancelled' then 'Cancelled'
        when b.end_at < now() then 'Completed'
        when b.start_at <= now() and b.end_at >= now() then 'Ongoing'
        else b.status
      end as status,
      b.purpose,
      a.id as "assetId", a.name as "assetName", a.asset_tag as "assetTag",
      u.id as "bookedById", u.name as "bookedByName"
      from bookings b
      join assets a on a.id = b.asset_id and a.organization_id = b.organization_id
      left join users u on u.id = b.booked_by and u.organization_id = b.organization_id
      where b.organization_id = $1 order by b.start_at`, [organizationId]),
  ]);
  return {
    resources: resources.rows,
    bookings: bookings.rows.map((row) => ({
      _id: row._id,
      start: row.start,
      end: row.end,
      status: row.status,
      purpose: row.purpose,
      asset: { _id: row.assetId, name: row.assetName, assetTag: row.assetTag },
      bookedBy: row.bookedById ? { _id: row.bookedById, name: row.bookedByName } : null,
    })),
  };
}
