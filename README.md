# Restaurant POS (Next.js)

A point-of-sale system rewritten from the Vite + React app into Next.js (App Router) with Tailwind CSS v4.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Radix UI primitives
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app` — App Router entry (`layout.tsx`, `page.tsx`, `globals.css`)
- `src/components/pos` — POS feature components (menu, cart, tables, history, payment)
- `src/components/ui` — Reusable UI primitives (button, input, dialog, etc.)
- `src/components/figma` — Image-with-fallback helper
- `src/lib` — Shared types, menu data, and utilities

## Features

- Dine-in (floor + table selection) and takeaway order types
- Menu browsing with category filter and search by name / code / barcode
- Portion selection (medium / large)
- Cart with per-item and bill-level discounts (percentage or amount)
- Hold / resume / new bill handling
- Order history (completed and on-hold)
- Mock payment flow (cash, card, Lanka Pay QR, cheque)
