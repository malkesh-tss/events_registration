---
name: verification
description: "Use before declaring any change complete in this repo. Covers the available checks (tsc typecheck, eslint, next build, dev smoke tests), the absence of a test framework, PowerShell (Windows) command syntax, and common false-error pitfalls (stale .next validator, cacheComponents dynamic export)."
---

# Verification

No automated test framework is configured. Prove a change with the checks below and
report any you could not run.

## Commands (Windows PowerShell — use `;`, not `&&`)

```powershell
npx tsc --noEmit      # type check (fastest signal; run first)
npm run lint          # eslint (eslint-config-next)
npm run build         # full production build (catches cacheComponents/route errors)
npm run dev           # start dev server for manual smoke tests (port 3000)
```

A clean run prints no errors and exits 0. If a prior command's output is buffered in
a reused shell, re-run once and read the final `EXIT=`.

## Smoke tests by area

- **Events:** `GET /api/events/upcoming`, `/api/events/roundtables`,
  `/api/events/workshops` return only upcoming, correctly-bucketed events.
- **Registration:** `POST /api/registrations` for valid + each failure case
  (missing required field, unknown `eventId`, no matching Zoom meeting, unconfigured
  Zoom env → 502).
- **UI:** modal opens instantly (prefetched), dropdown lists live events, required
  fields block submit, success shows the Zoom join link.

## Known pitfalls (not real code errors)

- **Stale route types:** after deleting `app/api/**/route.ts`, `.next/types/validator.ts`
  may still reference it and fail `tsc`. Restart `next dev` or delete the stale block.
- **`export const dynamic`:** build fails under `cacheComponents` — remove it; routes
  are request-time automatically. See the `nextjs-app-router` skill.
- **Prerender + Date.now():** avoid wall-clock/locale calls in static server render;
  use `lib/utils/format.ts`.

## Definition of done

`npx tsc --noEmit` and `npm run build` pass, relevant smoke tests exercised, and the
summary states what changed, files touched, commands run + results, any env
prerequisites, and remaining risk.
