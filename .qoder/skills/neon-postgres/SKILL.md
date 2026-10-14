---
name: neon-postgres
description: "Use when changing database access in lib/api/db.ts — the Neon Postgres pool, the events and registrations tables, schema bootstrap (ensure*Table), upserts, reads, and reconciliation helpers. Covers the pg Pool singleton, required SSL, parameterized queries, and idempotent table creation."
---

# Neon Postgres (pg)

All persistence is raw `pg` against Neon Postgres — there is **no ORM** (no Prisma).
Everything DB-related lives in `lib/api/db.ts`.

## Connection

- `getPool()` returns a module-scoped `Pool` cached on `global.__neonPool` (survives
  hot reload, avoids pool storms).
- Reads `DATABASE_URL`; **must** set `ssl: { rejectUnauthorized: false }` (Neon
  requires TLS) and a `connectionTimeoutMillis`. Throw a clear error if `DATABASE_URL`
  is missing.
- `query<T>(text, params)` is the only executor — always use **parameterized**
  queries (`$1`, `$2`, …). Never interpolate user input into SQL.

## Schema bootstrap

Tables are created idempotently at request time, guarded by a module boolean:
- `ensureEventsTable()` → `events` (+ `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
  for later columns, + index on `(kind, event_status, start_utc)`).
- `ensureRegistrationsTable()` → `registrations` (+ index on `(event_id, email)`).

Call the relevant `ensure*Table()` before first use in a code path (cheap no-op after
the first call). Add new columns via `ADD COLUMN IF NOT EXISTS`, not a migration tool.

## Key helpers

| Helper | Purpose |
| --- | --- |
| `readActiveEvents(kind, limit)` | upcoming events for a kind (`event_status='active'`, ordered by `start_utc`) |
| `readEventById(id)` | single active cached event for registration `resolveEvent` |
| `readAllEvents()` | used by reconciliation to find rows to archive |
| `upsertEvents(rows)` | batch `INSERT ... ON CONFLICT (id) DO UPDATE` |
| `archiveEvents(ids)` | set `event_status='past'` for stale rows |
| `insertRegistration(id, r)` | `INSERT ... ON CONFLICT (id) DO NOTHING` |

## Conventions

- Event rows are keyed by the **Eventbrite id** (`text` primary key).
- Timestamps are `timestamptz`; store explicit UTC (`start_utc`). Display conversion
  happens in `lib/utils/format.ts` / `convertUtcToPst`, never by trusting browser TZ.
- Multi-row inserts build a values list and `flatMap` params in the same order —
  keep placeholders and params aligned when adding columns.

## Validation

- Confirm the helper runs against a real Neon DB (`DATABASE_URL` set) and that
  `ensure*Table()` is invoked before reads/writes on new code paths.
