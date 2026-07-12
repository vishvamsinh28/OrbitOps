import pg from "pg";

const { Pool } = pg;
const globalForPg = globalThis;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgres://localhost:5432/orbitops";

if (!globalForPg.pgPool) {
  globalForPg.pgPool = new Pool({
    connectionString,
    ssl:
      process.env.POSTGRES_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

let schemaReady;

export async function query(text, params = []) {
  await connectDB();
  return globalForPg.pgPool.query(text, params);
}

export async function connectDB() {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((err) => {
      schemaReady = undefined;
      throw err;
    });
  }

  await schemaReady;
  return globalForPg.pgPool;
}

async function ensureSchema() {
  await globalForPg.pgPool.query(`
    create table if not exists users (
      id text primary key,
      name text not null,
      email text not null unique,
      password_hash text not null,
      role text not null default 'Employee',
      status text not null default 'Active',
      department_id text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists departments (
      id text primary key,
      name text not null,
      parent_id text,
      head_id text,
      status text not null default 'Active',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists asset_categories (
      id text primary key,
      name text not null unique,
      status text not null default 'Active',
      custom_fields jsonb not null default '[]'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists assets (
      id text primary key,
      name text not null,
      asset_tag text not null unique,
      category_id text,
      serial_number text,
      acquisition_date date,
      acquisition_cost numeric,
      condition text not null default 'Good',
      location text,
      department_id text,
      description text,
      image_url text,
      is_bookable boolean not null default false,
      status text not null default 'Available',
      current_holder_type text,
      current_holder_id text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists allocations (
      id text primary key,
      asset_id text not null,
      holder_type text not null,
      holder_id text not null,
      allocated_by text,
      allocation_date date not null default current_date,
      expected_return_date date,
      return_date timestamptz,
      status text not null default 'Active',
      notes text,
      condition_notes text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists bookings (
      id text primary key,
      asset_id text not null,
      booked_by text not null,
      start_at timestamptz not null,
      end_at timestamptz not null,
      purpose text,
      status text not null default 'Upcoming',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists maintenance_requests (
      id text primary key,
      asset_id text not null,
      requested_by text not null,
      issue_description text not null,
      priority text not null default 'Medium',
      status text not null default 'Pending',
      assigned_technician_name text,
      resolution_notes text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists transfer_requests (
      id text primary key,
      asset_id text not null,
      requested_by text not null,
      from_holder_type text,
      from_holder_id text,
      to_holder_type text not null,
      to_holder_id text not null,
      status text not null default 'Requested',
      approved_by text,
      decision_notes text,
      notes text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists notifications (
      id text primary key,
      user_id text not null,
      title text not null,
      message text not null,
      href text,
      read_at timestamptz,
      created_at timestamptz not null default now()
    );

    create table if not exists activity_logs (
      id text primary key,
      actor_id text,
      action text not null,
      entity_type text not null,
      entity_id text,
      description text not null,
      previous_value jsonb,
      new_value jsonb,
      created_at timestamptz not null default now()
    );

    create table if not exists audit_cycles (
      id text primary key,
      name text not null,
      scope_type text not null,
      scope_ref_id text,
      status text not null default 'Draft',
      created_by text,
      assigned_auditors jsonb not null default '[]'::jsonb,
      started_at timestamptz,
      closed_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists audit_items (
      id text primary key,
      audit_cycle_id text not null,
      asset_id text not null,
      checked_by text,
      observed_status text,
      notes text,
      discrepancy boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists counters (
      name text primary key,
      value integer not null default 0
    );
  `);
}
