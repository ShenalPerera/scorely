import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-6 text-center",
        "rounded-lg border border-dashed border-border-strong bg-bg",
        className
      )}
    >
      {icon && (
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-surface text-text-subtle [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </div>
      )}
      <h3 className="text-display-sm text-text">{title}</h3>
      {description && (
        <p className="max-w-sm text-body-sm text-text-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
