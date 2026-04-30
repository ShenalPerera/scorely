import { AlertCircle, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const noticeVariants = cva(
  [
    "flex items-start gap-3 rounded-md border p-3",
    "text-body-sm",
  ],
  {
    variants: {
      tone: {
        info: "bg-info-soft border-info/30 text-info",
        warning: "bg-warning-soft border-warning/30 text-warning",
        danger: "bg-danger-soft border-danger/30 text-danger",
        success: "bg-success-soft border-success/30 text-success",
      },
    },
    defaultVariants: { tone: "info" },
  }
);

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle2,
};

export interface NoticeProps extends VariantProps<typeof noticeVariants> {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Notice({ tone = "info", title, children, className }: NoticeProps) {
  const Icon = iconMap[tone ?? "info"];
  return (
    <div role="alert" className={cn(noticeVariants({ tone }), className)}>
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-semibold text-text">{title}</p>}
        <p className={cn(title ? "text-text-muted mt-0.5" : "text-text")}>
          {children}
        </p>
      </div>
    </div>
  );
}
