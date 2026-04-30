"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-md border border-transparent",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:pointer-events-none",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent-hover",
        secondary: "bg-surface text-text border-border-strong hover:bg-surface-overlay",
        ghost: "text-text-muted hover:bg-surface-overlay hover:text-text",
      },
      size: {
        sm: "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4",
        md: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
        lg: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, variant, size, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
