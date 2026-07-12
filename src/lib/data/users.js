import { connectDB, query } from "../db";
import { exists, id, one, userRow } from "./shared";

export async function getUserById(userId) {
  const result = await query(
    `select u.id as "_id", u.name, u.email, u.password_hash as "passwordHash",
      u.role, u.status, u.organization_id as "organizationId",
      o.name as "organizationName",
      u.department_id as "departmentId", d.name as "departmentName",
      u.created_at as "createdAt"
     from users u
     left join organizations o on o.id = u.organization_id
     left join departments d on d.id = u.department_id and d.organization_id = u.organization_id
     where u.id = $1`,
    [userId],
  );
  return userRow(one(result));
}

export async function getUserByEmail(email) {
  const result = await query(
    `select id as "_id", name, email, password_hash as "passwordHash",
      role, status, organization_id as "organizationId", created_at as "createdAt"
     from users where email = $1`,
    [email],
  );
  return userRow(one(result));
}

export async function listAdminUsers(organizationId) {
  const result = await query(
    `select id as "_id", name, email, role, status,
      organization_id as "organizationId"
     from users
     where role = 'Admin' and status = 'Active' and organization_id = $1
     order by created_at`,
    [organizationId],
  );
  return result.rows.map(userRow);
}

export async function hasUsers() {
  return exists(await query("select count(*) from users"));
}

export async function createInitialOrganizationAdmin({
  organizationName,
  name,
  email,
  passwordHash,
}) {
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("begin");
    await client.query("select pg_advisory_xact_lock(hashtext('orbitops_setup'))");

    const users = await client.query("select count(*) from users");
    if (exists(users)) {
      await client.query("rollback");
      return null;
    }

    const organizationId = id();
    const organization = one(
      await client.query(
        `insert into organizations (id, name)
         values ($1, $2) returning id as "_id", name`,
        [organizationId, organizationName],
      ),
    );

    const admin = userRow(
      one(
        await client.query(
          `insert into users (id, name, email, password_hash, role, organization_id)
           values ($1, $2, $3, $4, 'Admin', $5)
           returning id as "_id", name, email, password_hash as "passwordHash",
            role, status, organization_id as "organizationId"`,
          [id(), name, email, passwordHash, organizationId],
        ),
      ),
    );

    await client.query("commit");
    return { organization, admin };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function createOrganization({ name }) {
  const organizationId = id();
  const result = await query(
    `insert into organizations (id, name)
     values ($1, $2) returning id as "_id", name`,
    [organizationId, name],
  );
  return one(result);
}

export async function listOrganizations() {
  const result = await query(
    `select id as "_id", name from organizations order by created_at desc`,
  );
  return result.rows;
}

export async function createUser({
  name,
  email,
  passwordHash,
  role = "Employee",
  organizationId,
}) {
  const result = await query(
    `insert into users (id, name, email, password_hash, role, organization_id)
     values ($1, $2, $3, $4, $5, $6)
     returning id as "_id", name, email, password_hash as "passwordHash",
      role, status, organization_id as "organizationId"`,
    [id(), name, email, passwordHash, role, organizationId],
  );
  return userRow(one(result));
}

export async function activeHolderExists(type, holderId, organizationId) {
  if (!["User", "Department"].includes(type)) return false;
  const table = type === "User" ? "users" : "departments";
  return exists(
    await query(
      `select count(*) from ${table}
       where id = $1 and status = 'Active' and organization_id = $2`,
      [holderId, organizationId],
    ),
  );
}

export async function listAdminData(organizationId) {
  const [departments, categories, users] = await Promise.all([
    query(`select d.id as "_id", d.name, d.status, d.parent_id as "parentId",
      p.name as "parentName", h.id as "headId", h.name as "headName"
      from departments d
      left join departments p on p.id = d.parent_id and p.organization_id = d.organization_id
      left join users h on h.id = d.head_id and h.organization_id = d.organization_id
      where d.organization_id = $1 order by d.name`, [organizationId]),
    query(`select id as "_id", name, status, custom_fields as "customFields"
      from asset_categories where organization_id = $1 order by name`, [organizationId]),
    query(`select u.id as "_id", u.name, u.email, u.role, u.status,
      u.organization_id as "organizationId",
      u.department_id as "departmentId", d.name as "departmentName",
      u.created_at as "createdAt"
      from users u
      left join departments d on d.id = u.department_id and d.organization_id = u.organization_id
      where u.organization_id = $1 order by u.created_at desc`, [organizationId]),
  ]);
  return {
    departments: departments.rows.map((row) => ({
      ...row,
      head: row.headId ? { _id: row.headId, name: row.headName } : null,
      parent: row.parentId ? { _id: row.parentId, name: row.parentName } : null,
    })),
    categories: categories.rows.map((row) => ({
      ...row,
      customFields: Array.isArray(row.customFields) ? row.customFields : [],
    })),
    users: users.rows.map(userRow),
  };
}

export async function createDepartment({ name, parent, head, organizationId }) {
  const result = await query(
    `insert into departments (id, organization_id, name, parent_id, head_id)
     values ($1, $2, $3, $4, $5)
     returning id as "_id", name`,
    [id(), organizationId, name, parent || null, head || null],
  );
  return one(result);
}

export async function createCategory({ name, customFields, organizationId }) {
  const fields = String(customFields || "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
  const result = await query(
    `insert into asset_categories (id, organization_id, name, custom_fields)
     values ($1, $2, $3, $4)
     returning id as "_id", name`,
    [id(), organizationId, name, JSON.stringify(fields)],
  );
  return one(result);
}

export async function updateDepartment({
  departmentId,
  name,
  parent,
  head,
  status,
  organizationId,
}) {
  const result = await query(
    `update departments set name = $2, parent_id = $3, head_id = $4,
      status = $5, updated_at = now()
     where id = $1 and organization_id = $6 returning id as "_id", name`,
    [departmentId, name, parent || null, head || null, status, organizationId],
  );
  return one(result);
}

export async function updateCategory({
  categoryId,
  name,
  status,
  customFields,
  organizationId,
}) {
  const fields = String(customFields || "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
  const result = await query(
    `update asset_categories set name = $2, status = $3,
      custom_fields = $4, updated_at = now()
     where id = $1 and organization_id = $5 returning id as "_id", name`,
    [categoryId, name, status, JSON.stringify(fields), organizationId],
  );
  return one(result);
}

export async function updateEmployee({
  employeeId,
  role,
  department,
  status,
  organizationId,
}) {
  const result = await query(
    `update users set role = $2, department_id = $3, status = $4, updated_at = now()
     where id = $1 and organization_id = $5 returning id as "_id", name`,
    [employeeId, role, department || null, status, organizationId],
  );
  return one(result);
}
