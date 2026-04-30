/**
 * SCORELY DESIGN TOKENS
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for every visual value in the app.
 * Pages MUST NOT use raw hex codes, raw px values, or arbitrary
 * Tailwind values like text-[18px] or bg-[#abc].
 *
 * Add a new color or size here, then expose it via:
 *   1. CSS variable in globals.css (light + dark)
 *   2. Tailwind theme.extend in tailwind.config.ts
 *
 * Pages and components reference values via Tailwind classes
 * (bg-surface, text-accent, etc) which read from CSS variables.
 */

export const tokens = {
  // ─── Color palette (semantic, not literal) ─────────────────
  // Each token has a job. Don't reference raw colors anywhere.
  color: {
    // Surfaces — vertical depth
    bg: "var(--color-bg)",                          // page background
    surface: "var(--color-surface)",                // cards, panels
    surfaceElevated: "var(--color-surface-elevated)", // modals, dropdowns
    surfaceOverlay: "var(--color-surface-overlay)",   // hover/active

    // Text
    text: "var(--color-text)",                      // primary text
    textMuted: "var(--color-text-muted)",           // secondary
    textSubtle: "var(--color-text-subtle)",         // tertiary, hints

    // Borders
    border: "var(--color-border)",                  // default
    borderStrong: "var(--color-border-strong)",     // emphasized

    // Accent — the one electric color
    accent: "var(--color-accent)",                  // CTAs, live, focus
    accentHover: "var(--color-accent-hover)",
    accentSoft: "var(--color-accent-soft)",         // tinted backgrounds
    accentFg: "var(--color-accent-fg)",             // text ON accent

    // Semantic
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
    info: "var(--color-info)",

    ring: "var(--color-ring)",                      // focus indicator
  },

  // ─── Spacing scale ─────────────────────────────────────────
  // Use Tailwind p-1, p-2, p-4 etc. which already follow this scale.
  // 4px increments up to 32px, then larger jumps.
  // Do not use arbitrary values like p-[18px].

  // ─── Border radius ─────────────────────────────────────────
  radius: {
    sm: "6px",   // small chips
    md: "10px",  // inputs, buttons
    lg: "14px",  // cards
    xl: "20px",  // big panels (rare)
  },

  // ─── Shadows ───────────────────────────────────────────────
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.08)",
    accent: "0 0 0 1px var(--color-accent), 0 4px 16px var(--color-accent-soft)",
  },

  // ─── Animation ─────────────────────────────────────────────
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  },
} as const;

// Theme metadata — used by ThemeProvider
export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];
