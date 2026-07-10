"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEarningsSummary, getNotifications, getPortfolioSummary } from "@/lib/api";
import type { Notification, PortfolioSummary } from "@/lib/types";
import { EmptyState, PageHeader, StatCard, formatCurrency } from "@/components/dashboard/DashboardUI";

export default function DashboardOverviewPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPortfolioSummary(), getEarningsSummary(), getNotifications()])
      .then(([portfolio, earnings, notifs]) => {
        setSummary(portfolio);
        setTotalEarnings(earnings.total_earnings);
        setNotifications(notifs.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Overview" description="Your investment account at a glance." />

      {loading ? (
        <p className="text-sm text-muted">Loading your portfolio…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Account value" value={formatCurrency(summary?.total_value ?? 0)} />
            <StatCard label="Available cash" value={formatCurrency(summary?.available_cash ?? 0)} />
            <StatCard
              label="Active investments"
              value={summary?.active_investment_count ?? 0}
            />
            <StatCard label="Total earnings" value={formatCurrency(totalEarnings ?? 0)} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent notifications</h2>
                <Link href="/dashboard/notifications" className="text-sm text-gold-500 hover:underline">
                  View all
                </Link>
              </div>
              {notifications.length === 0 ? (
                <EmptyState message="No notifications yet." />
              ) : (
                <ul className="divide-y divide-surface-border rounded-xl border border-surface-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="p-4">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-1 text-sm text-muted">{n.body}</p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard/deposits"
                  className="rounded-lg border border-surface-border p-4 text-sm font-medium hover:border-gold-500"
                >
                  Make a deposit
                </Link>
                <Link
                  href="/dashboard/portfolio"
                  className="rounded-lg border border-surface-border p-4 text-sm font-medium hover:border-gold-500"
                >
                  Choose an investment
                </Link>
                <Link
                  href="/dashboard/withdrawals"
                  className="rounded-lg border border-surface-border p-4 text-sm font-medium hover:border-gold-500"
                >
                  Request a withdrawal
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
