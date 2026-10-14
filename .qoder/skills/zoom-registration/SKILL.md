---
name: zoom-registration
description: "Use when changing event registration, the POST /api/registrations flow, Zoom Server-to-Server OAuth, meeting lookup, attendee signup, or ZOOM_* env vars. Covers lib/api/registrations.ts (validateRegistrationAsync, resolveEvent, createRegistration), lib/api/zoom.ts, required form fields, and the registrations Neon table."
---

# Zoom Event Registration

Attendees register through the modal; the server finds the matching scheduled Zoom
meeting, adds the attendee, and persists the row (with the join URL) to Neon.

## Flow

`POST /api/registrations` (`app/api/registrations/route.ts`)
→ `validateRegistrationAsync` → `createRegistration` (`lib/api/registrations.ts`)
→ `zoom.findMeeting` → `zoom.registerAttendee` → `insertRegistration` (`lib/api/db.ts`).

## Validation (server is the source of truth)

Required fields (`validateRegistrationAsync`): `eventId`, `fullName` (≥2 chars),
`email` (regex), **`companyName`**, **`role`** — all trimmed non-empty. `goal` is
optional. Return `{ message, errors }` with HTTP 422; the modal renders `errors`
per-field. Keep the modal's `required` inputs in sync with server rules.

## Event resolution — never trust the browser

- `resolveEvent(id)` loads the event **server-side from the Neon Eventbrite cache**
  (`readEventById`, active only). The client sends only the event id + attendee
  fields — never a title, start time, or meeting id.
- If the event has no `startsAt`, fail with a clear message (cannot match Zoom).

## Zoom client (`lib/api/zoom.ts`)

- Server-to-Server OAuth: token via `account_credentials` grant using
  `ZOOM_ACCOUNT_ID` + (`ZOOM_BASIC_AUTH` or `ZOOM_CLIENT_ID`+`ZOOM_CLIENT_SECRET`);
  `ZOOM_TOKEN_URL` optional (defaults to `https://zoom.us/oauth/token`).
- `findMeeting(title, startAt)`: paginates scheduled meetings
  (`next_page_token`, `page_size=300`); matches within a **90-second** start-time
  window; title comparison is normalized (lowercase, alphanumerics only) with
  exact → substring → time-only fallbacks. Preserve the 90s tolerance.
- `registerAttendee` POSTs to `/meetings/{id}/registrants`; Zoom emails the join link.
  Use `join_url ?? start_url`.
- Throw `ZoomError` for auth/matching failures; the route maps it to HTTP 502.
  A registration is only successful if Zoom signup succeeds.

## Persistence (`lib/api/db.ts`)

`insertRegistration` writes to the `registrations` table
(`event_id, event_title, full_name, email, company_name, role, goal, zoom_meeting_id,
join_url`). Email is stored trimmed-lowercase. Id is a `crypto.randomUUID()`.

## Constraints

- Zoom credentials are server-only; never expose via `NEXT_PUBLIC_*`.
- A matching scheduled Zoom meeting must already exist for the Eventbrite event
  (same normalized title + start time); otherwise registration fails with 502.

## Validation

Smoke-test `POST /api/registrations` for: valid, missing required field, unknown
`eventId`, no matching Zoom meeting, and unconfigured Zoom env.
