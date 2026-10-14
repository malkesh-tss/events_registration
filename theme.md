# Theme — The Scale Summit (Design Source of Truth)

This file is the design brief for "The Scale Summit" brand theme. It is the
source of truth for palette, typography, layout, motion, and voice. The
implementation files listed in **Source Of Truth** below must stay aligned with
this spec.

## 1. Palette

| Token          | Hex        | Usage                                        |
| -------------- | ---------- | -------------------------------------------- |
| `navy-deep`    | `#1a2332`  | Primary dark surfaces, headings, hero bg     |
| `navy`         | `#24344d`  | Secondary dark, buttons, links               |
| `navy-muted`   | `#3a4a63`  | Subdued text on dark, borders on dark        |
| `gold`         | `#d4af37`  | Primary accent, CTAs, highlights             |
| `gold-hover`   | `#c0a02e`  | CTA hover / active states                    |
| `gold-muted`   | `#e5c86a`  | Accent tints, focus rings                    |
| `ivory`        | `#f5f1e8`  | Warm background surfaces                     |
| `ink`          | `#1a2332`  | Default body text on light                   |
| `body`         | `#4a5568`  | Muted body copy on light                     |
| `border-soft`  | `#e6e0d3`  | Hairline borders on light                    |

## 2. Typography

- **Body / UI:** DM Sans (`--font-sans`)
- **Display headings:** Playfair Display (`--font-display`) — h1/h2/h3 and hero
- **Editorial / quotes:** Lora (`--font-editorial`) — blockquotes, founder letter

## 3. Layout & Interaction

- Max content width `72rem` (max-w-6xl), generous vertical rhythm (py-20).
- Cards: 1.5px borders, rounded-2xl/3xl, soft shadow, hover lift (translateY).
- Motion: 150ms ease transitions on hover/focus; respect `prefers-reduced-motion`.
- Responsive: single column on mobile, 2–3 column grids from `md:`.

## 4. Voice / Visible Copy

Confident, warm, zero-fluff, founder-first. CTAs lead with value:
"Join Our Free Roundtable", "Reserve Free Seat", "Be Part of It".

## 5. Source Of Truth (implementation files)

- `app/globals.css` — `:root` raw variables + `@theme inline` token mapping
  (Tailwind v4). Use in components as `text-navy-deep`, `bg-gold`, `bg-ivory`.
- `app/layout.tsx` — loads DM Sans, Playfair Display, Lora via `next/font/google`
  and exposes `--font-sans`, `--font-display`, `--font-editorial`.
- `components/viewer/Header.tsx` — public header / nav copy.
