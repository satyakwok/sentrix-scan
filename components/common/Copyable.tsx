"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "error";

interface CopyableProps {
  text: string | null | undefined;
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
  /** When true, render icon only without any wrapper children spacing */
  bare?: boolean;
}

export function Copyable({ text, children, className, iconClassName, bare }: CopyableProps) {
  const [state, setState] = useState<CopyState>("idle");

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  const disabled = !text;

  const iconBtn = (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      aria-label={state === "copied" ? "Copied" : "Copy to clipboard"}
      title={state === "error" ? "Clipboard blocked by browser" : state === "copied" ? "Copied!" : "Copy"}
      className={cn(
        "inline-flex items-center justify-center h-5 w-5 rounded hover:bg-accent transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed",
        iconClassName,
      )}
    >
      {state === "copied" ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : state === "error" ? (
        <X className="h-3.5 w-3.5 text-red-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );

  if (bare || !children) {
    return iconBtn;
  }

  return (
    <span className={cn("inline-flex items-center gap-1 min-w-0", className)}>
      {children}
      {iconBtn}
    </span>
  );
}
