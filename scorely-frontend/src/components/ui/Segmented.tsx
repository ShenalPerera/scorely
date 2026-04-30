"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  block?: boolean;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
  block = false,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex gap-1 rounded-md border border-border bg-bg p-1",
        block && "w-full",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-sm font-medium transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-40 disabled:pointer-events-none",
              size === "sm" && "h-7 px-2.5 text-body-sm",
              size === "md" && "h-9 px-3 text-body",
              size === "lg" && "h-11 px-4 text-body-lg",
              active
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
