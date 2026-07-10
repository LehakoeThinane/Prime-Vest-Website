"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createInvestment,
  getInvestmentProductsClient,
  getMyInvestments,
  getPortfolioSummary,
  getProfile,
} from "@/lib/api";
import type { Investment, InvestmentProduct, PortfolioSummary, Profile } from "@/lib/types";
import { EmptyState, PageHeader, StatusBadge, formatCurrency } from "@/components/dashboard/DashboardUI";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PortfolioPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadAll() {
    const [portfolio, myInvestments, productList, me] = await Promise.all([
      getPortfolioSummary(),
      getMyInvestments(),
      getInvestmentProductsClient(),
      getProfile(),
    ]);
    setSummary(portfolio);
    setInvestments(myInvestments);
    setProducts(productList);
    setProfile(me);
  }

  useEffect(() => {
    // One-time data load on mount; loadAll only sets state after its awaits resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  async function handleInvest(e: FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await createInvestment(selectedProduct, amount);
      setMessage("Investment created successfully.");
      setAmount("");
      setSelectedProduct(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create investment");
    } finally {
      setSubmitting(false);
    }
  }

  const isVerified = profile?.profile.verification_status === "verified";

  return (
    <div>
      <PageHeader title="Portfolio" description="Your investments and performance over time." />

      {summary && (
        <Card className="mb-8">
          <PortfolioChart snapshots={summary.snapshots} />
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Your investments</h2>
          {investments.length === 0 ? (
            <EmptyState message="You haven't made any investments yet." />
          ) : (
            <ul className="space-y-3">
              {investments.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between rounded-xl border border-surface-border p-4">
                  <div>
                    <p className="text-sm font-medium">{inv.product.name}</p>
                    <p className="text-xs text-muted">
                      Started {new Date(inv.start_date).toLocaleDateString()} · Matures{" "}
                      {new Date(inv.maturity_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(inv.amount)}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Choose an investment</h2>
          {!isVerified ? (
            <EmptyState message="Your investor profile must be verified before you can invest. Check your Profile page for status." />
          ) : (
            <form onSubmit={handleInvest} className="space-y-4 rounded-xl border border-surface-border p-5">
              <div>
                <label className="mb-1 block text-xs text-muted">Product</label>
                <select
                  required
                  value={selectedProduct ?? ""}
                  onChange={(e) => setSelectedProduct(Number(e.target.value))}
                  className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (min {formatCurrency(p.min_amount)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted">Amount</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-transparent px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-muted">
                Available cash: {formatCurrency(summary?.available_cash ?? 0)}
              </p>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-success">{message}</p>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Investing…" : "Invest"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
