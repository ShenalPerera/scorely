import { cn } from "@/lib/utils/cn";

export interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({
  label,
  orientation = "horizontal",
  className,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("h-full w-px bg-border", className)}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-3 text-text-subtle", className)}
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-label uppercase">{label}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return <div role="separator" className={cn("h-px w-full bg-border", className)} />;
}
