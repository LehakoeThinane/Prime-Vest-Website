"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/api";
import type { AdminStats } from "@/lib/types";
import { PageHeader, StatCard, formatCurrency } from "@/components/dashboard/DashboardUI";

const backendOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const quickLinks = [
  { label: "Manage users", href: `${backendOrigin}/admin/users/user/` },
  { label: "Approve investors", href: `${backendOrigin}/admin/users/investorprofile/` },
  { label: "Publish blog posts", href: `${backendOrigin}/admin/content/blogpost/` },
  { label: "Manage investment products", href: `${backendOrigin}/admin/investments/investmentproduct/` },
  { label: "Review deposits", href: `${backendOrigin}/admin/transactions/deposit/` },
  { label: "Review withdrawals", href: `${backendOrigin}/admin/transactions/withdrawal/` },
  { label: "Contact messages", href: `${backendOrigin}/admin/content/contactmessage/` },
  { label: "Site content & settings", href: `${backendOrigin}/admin/content/sitesetting/` },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <div>
      <PageHeader title="Admin Overview" description="Key metrics and quick links to manage Prime Vest." />

      {stats && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={stats.total_users} />
          <StatCard label="Pending verifications" value={stats.pending_verifications} />
          <StatCard label="Total deposits" value={formatCurrency(stats.total_deposits_amount)} />
          <StatCard
            label="Pending withdrawals"
            value={stats.pending_withdrawals_count}
            hint={formatCurrency(stats.pending_withdrawals_amount)}
          />
          <StatCard label="Active investments" value={stats.active_investments} />
          <StatCard label="Unread contact messages" value={stats.unread_contact_messages} />
          <StatCard label="Newsletter subscribers" value={stats.newsletter_subscribers} />
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">Manage</h2>
      <p className="mb-4 text-sm text-muted">
        Full management tools live in the Django admin - approve investors, publish content, review
        transactions, send announcements, and generate CSV reports.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-surface-border p-4 text-sm font-medium hover:border-gold-500"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
