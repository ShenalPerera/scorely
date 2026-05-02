import type { Theme } from "./tokens";

export const THEME_COOKIE_NAME = "scorely-theme";

export function isValidTheme(value: string | undefined): value is Theme {
    return value === "light" || value === "dark" || value === "system";
}

export function parseThemeCookie(value: string | undefined): Theme {
    return isValidTheme(value) ? value : "dark";
}