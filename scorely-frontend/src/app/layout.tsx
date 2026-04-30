import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ThemeScript } from "@/lib/theme/ThemeScript";
import { readThemeFromCookie } from "@/lib/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scorely — Live scoring for every sport",
  description:
    "Score matches live, ball by ball, point by point. Spectators watch in real time. No refresh required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("scorely-theme")?.value;
  const initialTheme = readThemeFromCookie(
    themeCookie ? `scorely-theme=${themeCookie}` : undefined
  );

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
