"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createDeposit,
  getDeposits,
  getSiteSettingsClient,
  initializePaystackDeposit,
  verifyPaystackDeposit,
} from "@/lib/api";
import type { Deposit, SiteSettings } from "@/lib/types";
import { EmptyState, PageHeader, StatusBadge, formatCurrency } from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const cryptoEnabled = process.env.NEXT_PUBLIC_CRYPTO_PAYMENTS_ENABLED === "true";

function DepositVerifier({ onVerified }: { onVerified: () => void }) {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) return;
    verifyPaystackDeposit(reference).finally(onVerified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return null;
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [method, setMethod] = useState<"paystack" | "bank_transfer" | "crypto">("paystack");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function loadDeposits() {
    getDeposits().then(setDeposits);
  }

  useEffect(() => {
    loadDeposits();
    getSiteSettingsClient().then(setSettings);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      if (method === "paystack") {
        const { authorization_url } = await initializePaystackDeposit(amount);
        window.location.href = authorization_url;
        return;
      }
      await createDeposit(amount, method, notes);
      setMessage("Deposit submitted — it will be confirmed once processed.");
      setAmount("");
      setNotes("");
      loadDeposits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deposit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Suspense fallback={null}>
        <DepositVerifier onVerified={loadDeposits} />
      </Suspense>

      <PageHeader title="Deposits" description="Fund your account by card, bank transfer, or crypto." />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Deposit history</h2>
          {deposits.length === 0 ? (
            <EmptyState message="No deposits yet." />
          ) : (
            <ul className="space-y-3">
              {deposits.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-xl border border-surface-border p-4">
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(d.amount)}</p>
                    <p className="text-xs text-muted">
                      {d.method.replace("_", " ")} · {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">New deposit</h2>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-surface-border p-5">
            <div>
              <label className="mb-1 block text-xs text-muted">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof method)}
                className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              >
                <option value="paystack">Card (Visa / Mastercard / Apple Pay / Google Pay)</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="crypto" disabled={!cryptoEnabled}>
                  Cryptocurrency {!cryptoEnabled && "(coming soon)"}
                </option>
              </select>
            </div>
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

            {method === "bank_transfer" && settings && (
              <Card className="text-xs">
                <p className="font-semibold">Bank details</p>
                <p className="mt-2">Bank: {settings.bank_name}</p>
                <p>Account name: {settings.bank_account_name}</p>
                <p>Account number: {settings.bank_account_number}</p>
                <p>Branch code: {settings.bank_branch_code}</p>
                <label className="mt-3 mb-1 block text-muted">Reference / proof of payment note</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. transaction reference"
                  className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
              </Card>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}
            <Button type="submit" disabled={submitting || (method === "crypto" && !cryptoEnabled)} className="w-full">
              {submitting ? "Processing…" : method === "paystack" ? "Continue to payment" : "Submit deposit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
