"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { IconButton } from "./IconButton";
import type { Theme } from "@/lib/theme/tokens";

const order: Theme[] = ["light", "dark", "system"];
const labelMap: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <IconButton
      onClick={cycle}
      variant="ghost"
      size="md"
      aria-label={`Theme: ${labelMap[theme]}. Click to change.`}
      title={`Theme: ${labelMap[theme]}`}
    >
      <Icon />
    </IconButton>
  );
}
