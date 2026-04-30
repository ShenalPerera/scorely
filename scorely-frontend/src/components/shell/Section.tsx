import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const sectionVariants = cva("", {
  variants: {
    spacing: {
      sm: "py-6",
      md: "py-10",
      lg: "py-16",
    },
  },
  defaultVariants: { spacing: "md" },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export function Section({ className, spacing, ...props }: SectionProps) {
  return <section className={cn(sectionVariants({ spacing }), className)} {...props} />;
}
