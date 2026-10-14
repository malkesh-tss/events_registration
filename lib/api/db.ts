import { Pool, type QueryResultRow } from 'pg'

// Neon Postgres connection pool (replaces the previous Supabase client).
// Reused across hot-reloads/dev via a global to avoid opening many pools.
declare global {
  // eslint-disable-next-line no-var
  var __neonPool: Pool | undefined
}

export function getPool(): Pool {
  if (!global.__neonPool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set (Neon Postgres connection string).')
    }
    global.__neonPool = new Pool({
      connectionString,
      // Neon requires TLS. Passing an options object enables SSL in node-postgres.
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 10000,
    })
  }
  return global.__neonPool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await getPool().query<T>(text, params)
  return res.rows
}

// A cached Eventbrite event row in Neon.
export type EventKind = 'roundtable' | 'workshop'

export interface EventRow extends QueryResultRow {
  id: string
  kind: EventKind
  title: string
  description: string | null
  location: string | null
  image_url: string | null
  image_width: number | null
  image_height: number | null
  start_utc: string | null
  event_status: string
  eventbrite_url: string | null
  created_at: string
  updated_at: string
}

let tableReady = false

/** Ensures the events table exists. Safe to call on every request (cheap no-op after first). */
export async function ensureEventsTable(): Promise<void> {
  if (tableReady) return
  await query(
    `CREATE TABLE IF NOT EXISTS events (
      id text PRIMARY KEY,
      kind text NOT NULL DEFAULT 'roundtable',
      title text NOT NULL,
      description text,
      location text,
      image_url text,
      image_width integer,
      image_height integer,
      start_utc timestamptz,
      event_status text NOT NULL DEFAULT 'active',
      eventbrite_url text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
  // Add columns introduced after the table first existed.
  await query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'roundtable'`)
  await query(
    `CREATE INDEX IF NOT EXISTS events_kind_status_start_idx ON events (kind, event_status, start_utc)`,
  )
  tableReady = true
}

export async function readAllEvents(): Promise<EventRow[]> {
  return query<EventRow>('SELECT * FROM events')
}

export async function readActiveEvents(kind: EventKind, limit = 3): Promise<EventRow[]> {
  return query<EventRow>(
    `SELECT * FROM events
      WHERE event_status = 'active' AND kind = $2
      ORDER BY start_utc ASC NULLS LAST
      LIMIT $1`,
    [limit, kind],
  )
}

/** Looks up a single cached Eventbrite event by id. */
export async function readEventById(id: string): Promise<EventRow | null> {
  const rows = await query<EventRow>(
    `SELECT * FROM events WHERE id = $1 AND event_status = 'active'`,
    [id],
  )
  return rows[0] ?? null
}

export async function upsertEvents(rows: Omit<EventRow, 'created_at' | 'updated_at'>[]): Promise<void> {
  if (rows.length === 0) return
  const values = rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    title: r.title,
    description: r.description ?? null,
    location: r.location ?? null,
    image_url: r.image_url ?? null,
    image_width: r.image_width ?? null,
    image_height: r.image_height ?? null,
    start_utc: r.start_utc ?? null,
    event_status: r.event_status,
    eventbrite_url: r.eventbrite_url ?? null,
  }))

  await query(
    `INSERT INTO events
      (id, kind, title, description, location, image_url, image_width, image_height, start_utc, event_status, eventbrite_url, updated_at)
     VALUES
      ${values.map((_, i) => `($${i * 11 + 1},$${i * 11 + 2},$${i * 11 + 3},$${i * 11 + 4},$${i * 11 + 5},$${i * 11 + 6},$${i * 11 + 7},$${i * 11 + 8},$${i * 11 + 9},$${i * 11 + 10},$${i * 11 + 11},now())`).join(',')}
     ON CONFLICT (id) DO UPDATE SET
      kind = EXCLUDED.kind,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      location = EXCLUDED.location,
      image_url = EXCLUDED.image_url,
      image_width = EXCLUDED.image_width,
      image_height = EXCLUDED.image_height,
      start_utc = EXCLUDED.start_utc,
      event_status = EXCLUDED.event_status,
      eventbrite_url = EXCLUDED.eventbrite_url,
      updated_at = now()`,
    values.flatMap((v) => [
      v.id,
      v.kind,
      v.title,
      v.description,
      v.location,
      v.image_url,
      v.image_width,
      v.image_height,
      v.start_utc,
      v.event_status,
      v.eventbrite_url,
    ]),
  )
}

export async function archiveEvents(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await query(
    `UPDATE events SET event_status = 'past', updated_at = now() WHERE id = ANY($1::text[])`,
    [ids],
  )
}

// ---- Registrations ----

export interface RegistrationInsert {
  event_id: string
  event_title: string
  full_name: string
  email: string
  company_name: string | null
  role: string | null
  goal: string | null
  zoom_meeting_id: string | null
  join_url: string | null
}

let registrationsTableReady = false

/** Ensures the registrations table exists. Cheap no-op after first call. */
export async function ensureRegistrationsTable(): Promise<void> {
  if (registrationsTableReady) return
  await query(
    `CREATE TABLE IF NOT EXISTS registrations (
      id text PRIMARY KEY,
      event_id text NOT NULL,
      event_title text,
      full_name text NOT NULL,
      email text NOT NULL,
      company_name text,
      role text,
      goal text,
      zoom_meeting_id text,
      join_url text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
  )
  await query(
    `CREATE INDEX IF NOT EXISTS registrations_event_email_idx ON registrations (event_id, email)`,
  )
  registrationsTableReady = true
}

/**
 * Inserts a registration. A duplicate (same event + email) reuses the row and
 * refreshes the join link rather than failing.
 */
export async function insertRegistration(
  id: string,
  r: RegistrationInsert,
): Promise<void> {
  await ensureRegistrationsTable()
  await query(
    `INSERT INTO registrations
      (id, event_id, event_title, full_name, email, company_name, role, goal, zoom_meeting_id, join_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (id) DO NOTHING`,
    [
      id,
      r.event_id,
      r.event_title,
      r.full_name,
      r.email,
      r.company_name,
      r.role,
      r.goal,
      r.zoom_meeting_id,
      r.join_url,
    ],
  )
}
