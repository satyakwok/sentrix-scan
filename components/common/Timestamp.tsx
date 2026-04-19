"use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { timeAgo, formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TimestampProps {
  timestamp: string | number;
  className?: string;
  /** If true, show absolute timestamp with relative in tooltip (for detail pages) */
  absolute?: boolean;
}

// DECISION: Re-render every 30s to keep relative time fresh.
// Uses @base-ui tooltip (this project's UI lib), prop name is `delay`.
export function Timestamp({ timestamp, className, absolute = false }: TimestampProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const abs = formatTimestamp(timestamp);
  const rel = timeAgo(timestamp);

  const primary = absolute ? abs : rel;
  const secondary = absolute ? rel : abs;

  return (
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger
          render={<span className={cn("cursor-help", className)}>{primary}</span>}
        />
        <TooltipContent side="top" className="font-mono text-xs">
          {secondary}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
