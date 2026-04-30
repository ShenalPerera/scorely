import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
}

export function Logo({ size = "md", href = "/", className }: LogoProps) {
  const sizeClass =
    size === "sm" ? "text-body-lg" : size === "lg" ? "text-display-md" : "text-display-sm";

  const content = (
    <span
      className={cn(
        "inline-flex items-baseline font-display font-bold tracking-tight",
        sizeClass,
        className
      )}
    >
      <span className="text-text">Score</span>
      <span className="text-accent">.</span>
      <span className="text-text">ly</span>
    </span>
  );

  if (href === null) return content;
  return <Link href={href}>{content}</Link>;
}
