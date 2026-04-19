import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  mono?: boolean;
  last?: boolean;
  className?: string;
}

export function InfoRow({ label, value, hint, mono = false, last = false, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-2 py-3",
        !last && "border-b border-border",
        className,
      )}
    >
      <div className="text-sm text-muted-foreground sm:w-52 shrink-0 flex items-start gap-1">
        <span>{label}</span>
      </div>
      <div className={cn("min-w-0 flex-1 text-sm", mono && "font-mono break-all")}>
        <div>{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}
