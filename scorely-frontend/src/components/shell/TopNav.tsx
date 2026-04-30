import { type ReactNode } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils/cn";

export interface TopNavProps {
  /** Slot for navigation links shown in the center on desktop */
  links?: ReactNode;
  /** Slot for user-related actions on the right (sign in, avatar menu, etc) */
  actions?: ReactNode;
  /** When true, removes the bottom border (e.g. on landing pages with custom hero) */
  borderless?: boolean;
  className?: string;
}

export function TopNav({ links, actions, borderless, className }: TopNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 backdrop-blur-md",
        "bg-bg/80",
        !borderless && "border-b border-border",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          {links && <nav className="hidden md:flex items-center gap-1">{links}</nav>}
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
