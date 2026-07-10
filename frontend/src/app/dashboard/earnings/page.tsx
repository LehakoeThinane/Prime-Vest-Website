"use client";

import { useEffect, useState } from "react";
import { getEarningsSummary } from "@/lib/api";
import type { Earning } from "@/lib/types";
import { EmptyState, PageHeader, StatCard, formatCurrency } from "@/components/dashboard/DashboardUI";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [total, setTotal] = useState<string>("0");

  useEffect(() => {
    getEarningsSummary().then((data) => {
      setEarnings(data.earnings);
      setTotal(data.total_earnings);
    });
  }, []);

  return (
    <div>
      <PageHeader title="Earnings" description="Returns credited to your account." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Total earnings" value={formatCurrency(total)} />
        <StatCard label="Payouts received" value={earnings.length} />
      </div>

      {earnings.length === 0 ? (
        <EmptyState message="No earnings recorded yet." />
      ) : (
        <ul className="divide-y divide-surface-border rounded-xl border border-surface-border">
          {earnings.map((e) => (
            <li key={e.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{e.description || "Investment return"}</p>
                <p className="mt-1 text-xs text-muted">{new Date(e.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-sm font-semibold text-success">+{formatCurrency(e.amount)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
