"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  // Base — applied to every variant
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium",
    "rounded-md border border-transparent",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:pointer-events-none",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-accent-fg",
          "hover:bg-accent-hover",
          "active:scale-[0.98]",
        ],
        secondary: [
          "bg-surface text-text border-border-strong",
          "hover:bg-surface-overlay hover:border-text-subtle",
          "active:scale-[0.98]",
        ],
        ghost: [
          "text-text-muted",
          "hover:bg-surface-overlay hover:text-text",
        ],
        danger: [
          "bg-danger text-white",
          "hover:opacity-90",
          "active:scale-[0.98]",
        ],
        outline: [
          "bg-transparent text-text border-border-strong",
          "hover:bg-surface-overlay",
        ],
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body",
        lg: "h-12 px-6 text-body-lg",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, block, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, block }), className)}
        {...props}
      />
    );
  }
);
