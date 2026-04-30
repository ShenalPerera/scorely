# Scorely Design System

This document is the rulebook. Read it before adding any UI.

## The single rule

**Pages compose primitives. Pages never style raw HTML.**

If you find yourself writing `className="bg-[#..] text-[18px]"` in a page or feature file, you're doing it wrong. Use a primitive, or extend one.

## Where things live

```
src/lib/theme/
├── tokens.ts         ← Token names (colors, radius, shadow, motion)
└── ThemeProvider.tsx ← Light/dark/system state + cookie persistence

src/app/globals.css   ← CSS variables for both themes (the only place hex codes live)

src/components/ui/    ← Every visual primitive. Import from here.
src/components/shell/ ← Layout primitives (AppShell, TopNav, Container, Section, PageHeader)
```

## Token reference

### Color tokens (always use these names, never raw hex)

| Token              | Job                                            |
|--------------------|------------------------------------------------|
| `bg`               | Page background                                |
| `surface`          | Cards, panels                                  |
| `surface-elevated` | Modals, dropdowns                              |
| `surface-overlay`  | Hover states                                   |
| `text`             | Primary text                                   |
| `text-muted`       | Secondary text                                 |
| `text-subtle`      | Tertiary text, hints                           |
| `border`           | Default borders                                |
| `border-strong`    | Emphasized borders                             |
| `accent`           | The one electric color (CTAs, live, focus)     |
| `accent-soft`      | Tinted accent backgrounds                      |
| `accent-fg`        | Text ON accent (for buttons)                   |
| `success`/`-soft`  | Positive feedback                              |
| `warning`/`-soft`  | Caution feedback                               |
| `danger`/`-soft`   | Destructive/error feedback                    |
| `info`/`-soft`     | Informational                                  |
| `ring`             | Focus indicator                                |

Use as Tailwind classes: `bg-surface`, `text-text-muted`, `border-border-strong`.

### Type sizes

- Display: `text-display-xl/lg/md/sm` (page titles, hero text)
- Score-specific: `text-score-xl/lg/md` (huge numerals, always with `tabular`)
- Body: `text-body-lg/body/body-sm`
- Mono: `text-mono` for stats, `text-label/label-lg` for uppercase eyebrows
- Always use `font-mono` class with mono sizes
- Always use `tabular` class for numeric displays

### Radii

`rounded-sm` (chips), `rounded-md` (default), `rounded-lg` (cards), `rounded-xl` (rare big panels)

### Shadows

`shadow-sm/md/lg` for surfaces. `shadow-accent` for emphasized accent buttons.

## Theme toggle

`<ThemeToggle />` from `@/components/ui` lives in the top nav. Cycles light → dark → system. State persists per-user via cookie. SSR renders the right theme via `<ThemeScript>` in the root layout — no flash on load.

## Adding new components

1. Need something not in `src/components/ui/`?
2. Build it as a typed component in `src/components/ui/`.
3. Use `cva` for variants.
4. Use only token-based Tailwind classes (no hex, no arbitrary values).
5. Export from `src/components/ui/index.ts`.
6. Add a demo to `/_dev/components`.

## Adding a new sport

Follow the plugin pattern in `src/sports/`. Each sport implements the `SportPlugin` interface and registers itself. Core pages render via the registry — no core changes needed.

## Reviewing your work

Open `/_dev/components` in dev. Toggle the theme. If anything looks wrong, **fix it in the primitive, not in the page that uses it.**

## Anti-patterns to reject in code review

- Raw hex codes outside `globals.css` and `tokens.ts`
- Arbitrary Tailwind values (`text-[18px]`, `bg-[#abc]`, `p-[13px]`)
- Inline `style={{ ... }}` props (almost always wrong)
- A page that imports nothing from `@/components/ui` but has lots of `className`
- Reinventing a primitive that already exists
- Putting layout decisions in pages instead of in `Container`/`Section`
