import { query } from "../db";
import { exists, id, one, userRow } from "./shared";

export async function getUserById(userId) {
  const result = await query(
    `select u.id as "_id", u.name, u.email, u.password_hash as "passwordHash",
      u.role, u.status, u.department_id as "departmentId", d.name as "departmentName",
      u.created_at as "createdAt"
     from users u left join departments d on d.id = u.department_id
     where u.id = $1`,
    [userId],
  );
  return userRow(one(result));
}

export async function getUserByEmail(email) {
  const result = await query(
    `select id as "_id", name, email, password_hash as "passwordHash",
      role, status, created_at as "createdAt"
     from users where email = $1`,
    [email],
  );
  return userRow(one(result));
}

export async function createUser({ name, email, passwordHash, role = "Employee" }) {
  const result = await query(
    `insert into users (id, name, email, password_hash, role)
     values ($1, $2, $3, $4, $5)
     returning id as "_id", name, email, password_hash as "passwordHash", role, status`,
    [id(), name, email, passwordHash, role],
  );
  return userRow(one(result));
}

export async function adminExists() {
  return exists(await query("select count(*) from users where role = 'Admin'"));
}

const HOLDER_TABLES = { User: "users", Department: "departments" };

export async function activeHolderExists(type, holderId) {
  const table = HOLDER_TABLES[type];
  if (!table) return false;
  return exists(
    await query(
      `select count(*) from ${table} where id = $1 and status = 'Active'`,
      [holderId],
    ),
  );
}

export async function listAdminData() {
  const [departments, categories, users] = await Promise.all([
    query(`select d.id as "_id", d.name, d.status, h.id as "headId", h.name as "headName"
      from departments d left join users h on h.id = d.head_id order by d.name`),
    query(`select id as "_id", name, status from asset_categories order by name`),
    query(`select u.id as "_id", u.name, u.email, u.role, u.status,
      u.department_id as "departmentId", d.name as "departmentName", u.created_at as "createdAt"
      from users u left join departments d on d.id = u.department_id order by u.created_at desc`),
  ]);
  return {
    departments: departments.rows.map((row) => ({
      ...row,
      head: row.headId ? { _id: row.headId, name: row.headName } : null,
    })),
    categories: categories.rows,
    users: users.rows.map(userRow),
  };
}

export async function createDepartment({ name, parent, head }) {
  const result = await query(
    `insert into departments (id, name, parent_id, head_id) values ($1, $2, $3, $4)
     returning id as "_id", name`,
    [id(), name, parent || null, head || null],
  );
  return one(result);
}

export async function createCategory({ name }) {
  const result = await query(
    `insert into asset_categories (id, name) values ($1, $2)
     returning id as "_id", name`,
    [id(), name],
  );
  return one(result);
}

export async function updateEmployee({ employeeId, role, department, status }) {
  const result = await query(
    `update users set role = $2, department_id = $3, status = $4, updated_at = now()
     where id = $1 returning id as "_id", name`,
    [employeeId, role, department || null, status],
  );
  return one(result);
}
