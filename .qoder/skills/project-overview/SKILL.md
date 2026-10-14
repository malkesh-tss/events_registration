---
name: project-overview
description: "Orientation for The Scale Summit events_registration app. Use when first approaching the codebase or when unsure where features live: single Next.js 16 App Router project with Eventbrite event fetching, Neon Postgres caching, and Zoom registration. Maps responsibilities to app/, components/viewer, and lib/api."
---

# Project Overview — The Scale Summit Events

Single-package **Next.js 16 (App Router)** landing page + registration flow. NOT a
monorepo: there is no `apps/`, `packages/`, Express, Prisma, Firebase, or R2. Data
lives in **Neon Postgres** (via `pg`); events come from **Eventbrite**; registrations
create **Zoom** attendees.

## Stack

- next 16.4.0 (Turbopack, `cacheComponents: true`, `partialPrefetching: true`)
- react 19, typescript 5, tailwindcss v4 (`@tailwindcss/turbopack`)
- `pg` (Neon Postgres). No ORM.
- No test framework configured — verification is typecheck + lint + build + manual smoke (see `verification` skill).

## Directory map

| Path | Responsibility |
| --- | --- |
| `app/(viewer)/page.tsx` | Public landing page (server component, static) |
| `app/api/events/upcoming` | Live upcoming events (roundtable + workshop) as `SummitEvent[]` for the modal |
| `app/api/events/roundtables`, `/workshops` | Per-kind live `LiveEvent[]` for the schedule tables |
| `app/api/registrations` | `POST` registration → validates, resolves event, registers in Zoom, persists to Neon |
| `components/viewer/` | UI: `RegistrationProvider`, `RegistrationModal`, `RegisterButton`, `Roundtable(Schedule)`, `Workshop(Schedule)`, `Hero`, `Header`, `FinalCTA`, `Footer` |
| `lib/types.ts` | Shared `SummitEvent`/`RoundtableEvent`/`WorkshopEvent`/`RegistrationPayload` — single source of truth |
| `lib/api/eventbrite.ts` | Eventbrite fetch + normalize + Neon cache reconciliation |
| `lib/api/zoom.ts` | Zoom Server-to-Server OAuth client (`findMeeting`, `registerAttendee`) |
| `lib/api/db.ts` | `pg` pool, `events` + `registrations` tables, upsert/read helpers |
| `lib/api/registrations.ts` | Validation + `resolveEvent` + `createRegistration` orchestration |
| `lib/api/client.ts` | Browser helpers (`fetchUpcomingEvents`, `submitRegistration`) |
| `lib/utils/format.ts` | Timezone-pinned date/price formatting (PT) |
| `theme.md` | Design source of truth (navy/gold/ivory, DM Sans/Playfair/Lora) |

## Environment variables (server-only; never `NEXT_PUBLIC_*`)

- `DATABASE_URL` — Neon Postgres connection string (requires SSL)
- `EVENTBRITE_TOKEN`, `EVENTBRITE_ORGANIZER_ID` (default `76183053353`)
- `ZOOM_ACCOUNT_ID` + (`ZOOM_BASIC_AUTH` or `ZOOM_CLIENT_ID` + `ZOOM_CLIENT_SECRET`); `ZOOM_TOKEN_URL` optional

## Core flows

1. **Browse:** page renders static shell → schedule tables + modal fetch `/api/events/*` client-side → Eventbrite (cached in Neon).
2. **Register:** `RegistrationModal` → `POST /api/registrations` → validate → `resolveEvent` (Neon) → `zoom.findMeeting` → `zoom.registerAttendee` → `insertRegistration` → returns `joinUrl`.

## Related skills

`nextjs-app-router`, `eventbrite-events`, `zoom-registration`, `neon-postgres`, `verification`.
