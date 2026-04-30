"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, leadingIcon, trailingSlot, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-lg uppercase text-text-muted"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center rounded-md border bg-surface transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-bg",
          hasError ? "border-danger" : "border-border-strong",
          "hover:border-text-subtle"
        )}
      >
        {leadingIcon && (
          <span className="pl-3 text-text-subtle [&>svg]:h-4 [&>svg]:w-4">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-10 flex-1 bg-transparent px-3 text-body text-text",
            "placeholder:text-text-subtle",
            "focus:outline-none",
            leadingIcon && "pl-2",
            trailingSlot && "pr-2",
            className
          )}
          {...props}
        />
        {trailingSlot && <span className="pr-3">{trailingSlot}</span>}
      </div>
      {hint && !hasError && (
        <p id={`${inputId}-hint`} className="text-body-sm text-text-subtle">
          {hint}
        </p>
      )}
      {hasError && (
        <p id={`${inputId}-error`} className="text-body-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
