import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-label uppercase text-accent font-mono">
            {eyebrow}
          </span>
        )}
        <h1 className="text-display-lg text-text">{title}</h1>
        {description && (
          <p className="max-w-2xl text-body-lg text-text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
