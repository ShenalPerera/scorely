import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    width: {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "lg" },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, width, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ width }), className)} {...props} />;
}
