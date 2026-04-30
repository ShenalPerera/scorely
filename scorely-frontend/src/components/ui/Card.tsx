"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const cardVariants = cva(
  [
    "rounded-lg border bg-surface",
    "transition-all duration-150",
  ],
  {
    variants: {
      interactive: {
        true: [
          "cursor-pointer",
          "hover:border-border-strong hover:bg-surface-overlay",
          "active:scale-[0.995]",
        ],
        false: "",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
      },
      tone: {
        default: "border-border",
        accent: "border-accent/30 bg-accent-soft",
        muted: "border-border bg-bg",
      },
    },
    defaultVariants: {
      interactive: false,
      padding: "md",
      tone: "default",
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive, padding, tone, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ interactive, padding, tone }), className)}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 mb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-display-sm text-text", className)}
      {...props}
    />
  );
}
