import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        "surface-overlay": "var(--color-surface-overlay)",

        // Text
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-subtle": "var(--color-text-subtle)",

        // Borders
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",

        // Accent (the one electric color)
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-soft": "var(--color-accent-soft)",
        "accent-fg": "var(--color-accent-fg)",

        // Semantic
        success: "var(--color-success)",
        "success-soft": "var(--color-success-soft)",
        warning: "var(--color-warning)",
        "warning-soft": "var(--color-warning-soft)",
        danger: "var(--color-danger)",
        "danger-soft": "var(--color-danger-soft)",
        info: "var(--color-info)",
        "info-soft": "var(--color-info-soft)",

        // Focus ring
        ring: "var(--color-ring)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
      },
      fontSize: {
        // Display sizes
        "display-xl": ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["1.5rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],

        // Score-specific (for huge numbers)
        "score-xl": ["clamp(4rem, 12vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" }],
        "score-lg": ["clamp(3rem, 8vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" }],
        "score-md": ["2.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],

        // Body
        "body-lg": ["1.125rem", { lineHeight: "1.55" }],
        body: ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],

        // Mono / labels
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "label-lg": ["0.75rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        mono: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
      },
      animation: {
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
