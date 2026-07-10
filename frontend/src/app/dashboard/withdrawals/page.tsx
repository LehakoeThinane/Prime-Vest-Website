"use client";

import { FormEvent, useEffect, useState } from "react";
import { createWithdrawal, getPortfolioSummary, getWithdrawals } from "@/lib/api";
import type { Withdrawal } from "@/lib/types";
import { EmptyState, PageHeader, StatusBadge, formatCurrency } from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/Button";

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [availableCash, setAvailableCash] = useState<string>("0");
  const [amount, setAmount] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    getWithdrawals().then(setWithdrawals);
    getPortfolioSummary().then((s) => setAvailableCash(s.available_cash));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await createWithdrawal(amount, "bank_transfer", bankDetails);
      setMessage("Withdrawal request submitted for review.");
      setAmount("");
      setBankDetails("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Withdrawals" description="Request a withdrawal to your bank account." />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Withdrawal requests</h2>
          {withdrawals.length === 0 ? (
            <EmptyState message="No withdrawal requests yet." />
          ) : (
            <ul className="space-y-3">
              {withdrawals.map((w) => (
                <li key={w.id} className="rounded-xl border border-surface-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{formatCurrency(w.amount)}</p>
                    <StatusBadge status={w.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Requested {new Date(w.created_at).toLocaleDateString()}
                    {w.processed_at && ` · Processed ${new Date(w.processed_at).toLocaleDateString()}`}
                  </p>
                  {w.admin_notes && <p className="mt-2 text-xs text-muted">Note: {w.admin_notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">New withdrawal</h2>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-surface-border p-5">
            <p className="text-xs text-muted">Available cash: {formatCurrency(availableCash)}</p>
            <div>
              <label className="mb-1 block text-xs text-muted">Amount</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Bank details</label>
              <textarea
                required
                rows={3}
                placeholder="Bank name, account number, branch code"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting…" : "Request withdrawal"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
