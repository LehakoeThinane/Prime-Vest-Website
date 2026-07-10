import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-xl border border-surface-border bg-surface/60 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "success" | "danger" | "muted";
}) {
  const toneClass = {
    gold: "bg-gold-500/15 text-gold-600",
    success: "bg-success/15 text-success",
    danger: "bg-danger/15 text-danger",
    muted: "bg-muted/15 text-muted",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}
