import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface AppShellProps {
  nav: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AppShell({ nav, children, footer, className }: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-bg", className)}>
      {nav}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
