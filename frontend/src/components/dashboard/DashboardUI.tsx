import { ReactNode } from "react";
import { Badge } from "@/components/ui/Card";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface/60 p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-surface-border p-8 text-center text-sm text-muted">
      {message}
    </div>
  );
}

const statusTones: Record<string, "gold" | "success" | "danger" | "muted"> = {
  pending: "gold",
  active: "success",
  completed: "success",
  verified: "success",
  paid: "success",
  approved: "success",
  matured: "muted",
  cancelled: "muted",
  failed: "danger",
  rejected: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTones[status] ?? "muted"}>{status.replace("_", " ")}</Badge>;
}

export function formatCurrency(value: string | number) {
  return `R${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
