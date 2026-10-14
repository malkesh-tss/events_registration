---
name: nextjs-app-router
description: "Use when editing app/ routes, route handlers, layouts, page.tsx, or next.config.ts in this Next.js 16 App Router project. Covers server vs client components, route handler conventions, the cacheComponents constraint that forbids `export const dynamic`, hydration-safe date formatting, and Tailwind v4 theme tokens."
---

# Next.js 16 App Router

This is **Next.js 16.4.0** with breaking changes vs. older models. Before writing
route/config code, read the relevant guide in `node_modules/next/dist/docs/` (see
`AGENTS.md`). Do not rely on memory of prior Next versions.

## Config constraints (`next.config.ts`)

`cacheComponents: true` and `partialPrefetching: true` are enabled.

- **Never add `export const dynamic = '...'`** (or `revalidate`, `fetchCache`) to a
  route/page — it is incompatible with `cacheComponents` and fails the build with
  `Route segment config "dynamic" is not compatible with nextConfig.cacheComponents`.
- Route handlers run at request time automatically when they read `request.url`
  search params or hit the DB/network. A comment noting this is enough; no config
  export is needed. (See `app/api/events/upcoming/route.ts`.)

## Components

- Default to **server components**. Add `'use client'` only where interactivity is
  required (modal, provider, schedule tables, buttons).
- Client data comes from in-app `fetch('/api/...')` in `useEffect`, not from passing
  server-only objects with functions.
- The landing page (`app/(viewer)/page.tsx`) stays **static/prerenderable**: it does
  not fetch at render time; schedule tables + modal hydrate live data client-side.

## Hydration safety

- Do not call `Date.now()`/locale-dependent formatting during server render of a
  static page (causes prerender errors / mismatches).
- All date/time formatting goes through `lib/utils/format.ts`, pinned to
  `America/Los_Angeles`, so server output matches client hydration.

## Route handler pattern

```ts
import { NextResponse } from 'next/server'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // ...call lib/api helpers, return NextResponse.json(...)
}
```

Keep handlers thin: validate + delegate to `lib/api/*`. Return typed error shapes
(`{ message, errors? }`) so the client can render them.

## Styling / theme

- Tailwind v4 tokens are defined in `app/globals.css` (`@theme inline`). Use semantic
  classes (`text-ink`, `bg-gold`, `border-border-soft`, `btn btn-primary`) per
  `theme.md`. Do not hardcode hex values.
- Fonts (DM Sans, Playfair Display, Lora) load via `next/font/google` in
  `app/layout.tsx`.

## Cleanup pitfall

After deleting an `app/api/**/route.ts`, the running dev server may keep a stale
`.next/types/validator.ts` referencing it. Restart `next dev` (or remove the stale
block) rather than assuming a code error.
