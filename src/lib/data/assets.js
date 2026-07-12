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

export async function listAssetsData() {
  const [assets, categories, departments, users, allocations] = await Promise.all([
    query(`select a.id as "_id", a.name, a.asset_tag as "assetTag",
      a.category_id as "categoryId", c.name as "categoryName",
      a.serial_number as "serialNumber", a.acquisition_date as "acquisitionDate",
      a.acquisition_cost as "acquisitionCost", a.condition, a.location,
      a.department_id as "departmentId", d.name as "departmentName",
      a.description, a.image_url as "imageUrl", a.is_bookable as "isBookable",
      a.status, a.current_holder_type as "currentHolderType",
      a.current_holder_id as "currentHolder"
      from assets a
      left join asset_categories c on c.id = a.category_id
      left join departments d on d.id = a.department_id
      order by a.created_at desc`),
    query(`select id as "_id", name, status from asset_categories where status = 'Active' order by name`),
    query(`select id as "_id", name, status from departments where status = 'Active' order by name`),
    query(`select id as "_id", name, email, role, status from users where status = 'Active' order by name`),
    query(`select al.id as "_id", al.expected_return_date as "expectedReturnDate",
      al.asset_id as "assetId", a.name as "assetName", a.asset_tag as "assetTag"
      from allocations al join assets a on a.id = al.asset_id
      where al.status = 'Active' order by al.created_at desc`),
  ]);
  return {
    assets: assets.rows.map(assetRow),
    categories: categories.rows,
    departments: departments.rows,
    users: users.rows,
    allocations: allocations.rows.map((row) => ({
      _id: row._id,
      expectedReturnDate: row.expectedReturnDate,
      asset: { _id: row.assetId, name: row.assetName, assetTag: row.assetTag },
    })),
  };
}

export async function getAssetById(assetId) {
  const result = await query(
    `select id as "_id", name, asset_tag as "assetTag", status,
      is_bookable as "isBookable", current_holder_type as "currentHolderType",
      current_holder_id as "currentHolder", department_id as "departmentId"
      from assets where id = $1`,
    [assetId],
  );
  return assetRow(one(result));
}

export async function getAssetEditData(assetId) {
  const [asset, categories, departments] = await Promise.all([
    query(`select a.id as "_id", a.name, a.asset_tag as "assetTag",
      a.category_id as "categoryId", c.name as "categoryName",
      a.serial_number as "serialNumber", a.acquisition_date as "acquisitionDate",
      a.acquisition_cost as "acquisitionCost", a.condition, a.location,
      a.department_id as "departmentId", d.name as "departmentName",
      a.description, a.image_url as "imageUrl", a.is_bookable as "isBookable",
      a.status, a.current_holder_type as "currentHolderType",
      a.current_holder_id as "currentHolder"
      from assets a
      left join asset_categories c on c.id = a.category_id
      left join departments d on d.id = a.department_id
      where a.id = $1`, [assetId]),
    query(`select id as "_id", name, status from asset_categories where status = 'Active' order by name`),
    query(`select id as "_id", name, status from departments where status = 'Active' order by name`),
  ]);

  return {
    asset: assetRow(one(asset)),
    categories: categories.rows,
    departments: departments.rows,
  };
}

export async function createAsset(data) {
  const result = await query(
    `insert into assets
      (id, name, asset_tag, category_id, serial_number, acquisition_date,
       acquisition_cost, condition, location, department_id, description,
       image_url, is_bookable)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     returning id as "_id", asset_tag as "assetTag"`,
    [
      id(), data.name, data.assetTag, data.category || null,
      data.serialNumber || null, data.acquisitionDate || null,
      data.acquisitionCost || null, data.condition || "Good",
      data.location || null, data.department || null, data.description || null,
      data.imageUrl || null, data.isBookable,
    ],
  );
  return one(result);
}

export async function updateAsset(data) {
  const result = await query(
    `update assets set name = $2, category_id = $3, serial_number = $4,
      acquisition_date = $5, acquisition_cost = $6, condition = $7,
      location = $8, department_id = $9, description = $10,
      image_url = $11, is_bookable = $12, updated_at = now()
     where id = $1
     returning id as "_id", asset_tag as "assetTag"`,
    [
      data.assetId,
      data.name,
      data.category || null,
      data.serialNumber || null,
      data.acquisitionDate || null,
      data.acquisitionCost || null,
      data.condition || "Good",
      data.location || null,
      data.department || null,
      data.description || null,
      data.imageUrl || null,
      data.isBookable,
    ],
  );
  return one(result);
}

export async function createAllocation(data) {
  const allocationId = id();
  await query(
    `insert into allocations
      (id, asset_id, holder_type, holder_id, allocated_by, allocation_date,
       expected_return_date, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      allocationId, data.asset, data.holderType, data.holder, data.allocatedBy,
      data.allocationDate || new Date(), data.expectedReturnDate || null,
      data.notes || null,
    ],
  );
  return { _id: allocationId };
}

export async function updateAssetHolder(assetId, { status, holderType, holder }) {
  const sets = ["status = $2", "updated_at = now()"];
  const params = [assetId, status];
  if (holderType !== undefined) {
    sets.push(`current_holder_type = $${params.length + 1}`);
    params.push(holderType);
  }
  if (holder !== undefined) {
    sets.push(`current_holder_id = $${params.length + 1}`);
    params.push(holder);
  }
  await query(
    `update assets set ${sets.join(", ")} where id = $1`,
    params,
  );
}

export async function returnAllocation({ allocationId, conditionNotes }) {
  const result = await query(
    `update allocations set status = 'Returned', return_date = now(),
      condition_notes = $2, updated_at = now()
     where id = $1 and status = 'Active'
     returning id as "_id", asset_id as "asset"`,
    [allocationId, conditionNotes || null],
  );
  return one(result);
}

export async function getAssetHistory(assetId) {
  const [allocations, maintenance] = await Promise.all([
    query(`select al.id as "_id", al.holder_type as "holderType",
      al.holder_id as "holderId", al.status, al.allocation_date as "allocationDate",
      al.expected_return_date as "expectedReturnDate", al.return_date as "returnDate",
      al.notes, al.created_at as "createdAt"
      from allocations al where al.asset_id = $1
      order by al.created_at desc limit 20`, [assetId]),
    query(`select m.id as "_id", m.issue_description as "issueDescription",
      m.priority, m.status, m.assigned_technician_name as "technician",
      m.resolution_notes as "resolutionNotes", m.created_at as "createdAt"
      from maintenance_requests m where m.asset_id = $1
      order by m.created_at desc limit 20`, [assetId]),
  ]);
  return {
    allocations: allocations.rows,
    maintenance: maintenance.rows,
  };
}

export async function createBooking({ asset, bookedBy, start, end, purpose }) {
  const result = await query(
    `insert into bookings (id, asset_id, booked_by, start_at, end_at, purpose)
     values ($1,$2,$3,$4,$5,$6) returning id as "_id"`,
    [id(), asset, bookedBy, start, end, purpose || null],
  );
  return one(result);
}

export async function bookingOverlaps({ asset, start, end }) {
  return exists(await query(
    `select count(*) from bookings
     where asset_id = $1 and status <> 'Cancelled'
       and start_at < $3 and end_at > $2`,
    [asset, start, end],
  ));
}

export async function cancelBooking({ bookingId, userId, isManager }) {
  const result = await query(
    `update bookings b set status = 'Cancelled', updated_at = now()
     from assets a
     where b.asset_id = a.id and b.id = $1
       and b.status not in ('Cancelled', 'Completed')
       and ($2 = true or b.booked_by = $3)
     returning b.id as "_id", b.asset_id as "asset", a.asset_tag as "assetTag"`,
    [bookingId, isManager, userId],
  );
  return one(result);
}

export async function listBookingData() {
  const [resources, bookings] = await Promise.all([
    query(`select id as "_id", name, asset_tag as "assetTag" from assets where is_bookable = true order by name`),
    query(`select b.id as "_id", b.start_at as start, b.end_at as end, b.status, b.purpose,
      a.id as "assetId", a.name as "assetName", a.asset_tag as "assetTag",
      u.id as "bookedById", u.name as "bookedByName"
      from bookings b join assets a on a.id = b.asset_id
      left join users u on u.id = b.booked_by order by b.start_at`),
  ]);
  return {
    resources: resources.rows,
    bookings: bookings.rows.map((row) => ({
      _id: row._id, start: row.start, end: row.end, status: row.status,
      purpose: row.purpose,
      asset: { _id: row.assetId, name: row.assetName, assetTag: row.assetTag },
      bookedBy: row.bookedById ? { _id: row.bookedById, name: row.bookedByName } : null,
    })),
  };
}
