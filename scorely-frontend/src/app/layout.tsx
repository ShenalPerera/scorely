import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ThemeScript } from "@/lib/theme/ThemeScript";
import { THEME_COOKIE_NAME, parseThemeCookie } from "@/lib/theme/cookie";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
    title: "Scorely — Live scoring for every sport",
    description: "Score matches live, ball by ball, point by point. Spectators watch in real time. No refresh required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
    const initialTheme = parseThemeCookie(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
