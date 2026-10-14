---
name: eventbrite-events
description: "Use when changing how events are fetched, filtered, cached, or displayed from Eventbrite. Covers lib/api/eventbrite.ts (getEventsByKind, LiveEvent normalization), title-keyword kind matching, Neon cache writes with past-event reconciliation, cache fallback, and the /api/events/* routes that feed the schedule tables and modal."
---

# Eventbrite Events

Events are pulled live from the Eventbrite Organizers API and cached in Neon so the
site still renders when Eventbrite is unreachable.

## Entry points (`lib/api/eventbrite.ts`)

- `getEventsByKind(kind, limit)` — core: fetch → filter → normalize → cache → return.
- `getRoundTableEvents(limit=3)` / `getWorkshopEvents(limit=6)` — thin wrappers.
- Returns `EventsResult { events: LiveEvent[]; total; source: 'database'|'eventbrite'|'none'; ... }`.

## Fetch & filter rules

- Endpoint: `GET /v3/organizers/{organizerId}/events/?status=live&expand=venue`,
  `Authorization: Bearer ${EVENTBRITE_TOKEN}`, `cache: 'no-store'`.
- Organizer id from `EVENTBRITE_ORGANIZER_ID` (default `76183053353`).
- **Kind matching is by title keyword**: roundtable ⟺ name contains "roundtable";
  workshop ⟺ contains "workshop" (`matchesKind`). Keep other event types out of both
  lists — do not loosen this to date/venue based bucketing.
- Only events with a `start.utc` and not already past (Pacific time) become `active`;
  past ones are marked `past`.

## Cache + reconciliation (invariant)

1. `ensureEventsTable()` then read existing rows.
2. Upsert the active/upcoming rows for this kind (`upsertEvents`).
3. **Archive** cached `active` rows of this kind that are no longer active matches
   (`archiveEvents`) — this is what removes stale/duplicate events from the UI.
4. Return the freshest view from the cache (`readActiveEvents`), falling back to the
   just-processed list.

Preserve this reconcile step when editing; without it, past or renamed events linger.

## Fallback behavior

- No `EVENTBRITE_TOKEN` → serve cached rows with `source:'database'`.
- Eventbrite request fails → serve cached rows; message notes the error.
- Total failure → `source:'none'` (routes map this to HTTP 502).

## Consumers

- `app/api/events/roundtables` + `/workshops` → `LiveEvent[]` for the schedule tables
  (`RoundtableSchedule`, `WorkshopSchedule`).
- `app/api/events/upcoming` → maps `LiveEvent` → `SummitEvent` (needs `startsAt`) for
  the registration modal dropdown.
- Frontend shows ONLY live upcoming events; the static catalog is a fallback used only
  while live data loads or if the API is unreachable (see `RegistrationModal`).

## Validation

- `GET /api/events/roundtables`, `/workshops`, `/upcoming` return expected shapes and
  only upcoming, correctly-bucketed events.
