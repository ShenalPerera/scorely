import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const avatarVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full",
    "bg-accent text-accent-fg font-semibold",
    "select-none",
  ],
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-body-sm",
        md: "h-9 w-9 text-body",
        lg: "h-12 w-12 text-body-lg",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string;
  className?: string;
}

export function Avatar({ name, size, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      className={cn(avatarVariants({ size }), className)}
      aria-label={name}
      title={name}
    >
      {initial}
    </span>
  );
}
