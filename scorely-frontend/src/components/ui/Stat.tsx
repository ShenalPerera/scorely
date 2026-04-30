import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const valueVariants = cva("font-display tabular text-text", {
  variants: {
    size: {
      sm: "text-display-sm",
      md: "text-display-md",
      lg: "text-display-lg",
      xl: "text-display-xl",
      score: "text-score-md",
      "score-lg": "text-score-lg",
      "score-xl": "text-score-xl",
    },
  },
  defaultVariants: { size: "md" },
});

export interface StatProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof valueVariants> {
  label?: string;
  value: ReactNode;
  hint?: string;
  align?: "left" | "right" | "center";
  accent?: boolean;
}

export function Stat({
  label,
  value,
  hint,
  size,
  align = "left",
  accent = false,
  className,
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "right" && "items-end",
        align === "center" && "items-center",
        className
      )}
      {...props}
    >
      {label && (
        <span className="text-label uppercase text-text-subtle font-mono">
          {label}
        </span>
      )}
      <span
        className={cn(
          valueVariants({ size }),
          accent && "text-accent"
        )}
      >
        {value}
      </span>
      {hint && (
        <span className="text-body-sm text-text-muted">{hint}</span>
      )}
    </div>
  );
}
