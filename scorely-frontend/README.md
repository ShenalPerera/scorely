# Scorely

Live scoring for every sport. Built with Next.js 14 + Supabase.

> **Status: Foundation checkpoint.** The design system, theme system, and UI primitives are built. **Pages have not been built yet** — they will compose from primitives once the foundation is approved.

## Review the foundation

```bash
npm install
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000) — landing stub pointing at the components library
- [http://localhost:3000/_dev/components](http://localhost:3000/_dev/components) — **the review checkpoint**: every primitive, every variant, in both themes

Toggle the theme using the icon in the top-right. Cycles light → dark → system.

## What's built

### Layer 1 · Tokens
- `src/lib/theme/tokens.ts` — semantic token names
- `src/app/globals.css` — CSS variables for light + dark
- `tailwind.config.ts` — wires tokens into Tailwind

### Layer 2 · Theme system
- `ThemeProvider` with light/dark/system + cookie persistence
- `ThemeScript` injected into `<head>` to set theme before hydration (no flash)
- `ThemeToggle` button cycles modes

### Layer 3 · UI primitives (`src/components/ui/`)
Button, IconButton, Input, Pill (+ LiveDot), Card, Stat, Segmented, EmptyState, Notice, Skeleton, Divider, Avatar, ThemeToggle.

All built with `cva` for type-safe variants. All theme-aware.

### Layer 4 · Layout shell (`src/components/shell/`)
AppShell, TopNav, Container, Section, PageHeader, Logo, Footer.

## What's NOT built yet (intentional)

Pages, Supabase wiring, sport plugins, scorer pad, spectator view, auth, database schema, API routes — all coming in the next iteration once the foundation is approved.

## Aesthetic direction

Modern sport-tech. Dark slate base, electric lime accent (`#BEF264` in dark, `#84CC16` in light), Geist sans throughout, Geist Mono for stats. Sharp 6–14px radii. Tabular figures for all numbers. Grid-driven layout, no decorative blobs, restrained color use — accent appears only at moments of meaning.

## Read this before contributing

[`DESIGN.md`](./DESIGN.md) — the consistency rulebook. **Don't write any UI code without reading it.**

## Architecture summary (unchanged from the agreed plan)

```
Scorer → Next.js API → Supabase Postgres
                          ↓ (Realtime)
                     Spectators (WebSocket)
```

Frontend on Vercel. Postgres + Auth + Realtime on Supabase. Serverless API routes for write validation. Sport-as-plugin: each sport is a self-contained folder in `src/sports/` that registers its event types, scorer pad, and score display with the core registry.
