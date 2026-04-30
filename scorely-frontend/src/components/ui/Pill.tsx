"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const pillVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-sm px-2 py-0.5",
    "text-label uppercase",
    "border",
  ],
  {
    variants: {
      variant: {
        live: "bg-accent-soft text-accent border-accent/30",
        upcoming: "bg-info-soft text-info border-info/30",
        completed: "bg-surface-overlay text-text-muted border-border-strong",
        neutral: "bg-surface-overlay text-text-muted border-border",
        accent: "bg-accent text-accent-fg border-accent",
        danger: "bg-danger-soft text-danger border-danger/30",
        warning: "bg-warning-soft text-warning border-warning/30",
        success: "bg-success-soft text-success border-success/30",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2 py-0.5 text-label",
        lg: "px-2.5 py-1 text-label-lg",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface PillProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  children: ReactNode;
}

export function Pill({ className, variant, size, children, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}

/** Pulsing dot for "live" indicators. Pair with <Pill variant="live"> */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full bg-accent",
        "animate-pulse-dot",
        className
      )}
    />
  );
}
