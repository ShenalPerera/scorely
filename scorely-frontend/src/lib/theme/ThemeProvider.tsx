"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { THEME_COOKIE_NAME, parseThemeCookie } from "@/lib/theme/cookie";
import type { Theme } from "@/lib/theme/tokens";

interface ThemeContextValue {
  theme: Theme;            // user's preference: light | dark | system
  resolvedTheme: "light" | "dark"; // what's actually applied
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // Suppress transitions during the swap to prevent visual jank
  root.classList.add("no-transitions");
  root.dataset.theme = resolved;
  // Re-enable transitions on next frame
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove("no-transitions");
    });
  });
}

function setCookie(value: string) {
  document.cookie = `${THEME_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Theme read from cookie on the server, used as initial state */
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = "dark" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    initialTheme === "system" ? "dark" : initialTheme
  );

  // Resolve "system" preference and apply
  useEffect(() => {
    const resolved = theme === "system" ? readSystemTheme() : theme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme]);

  // React to system theme changes when user picked "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = mq.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setCookie(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
