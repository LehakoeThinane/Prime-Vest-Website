import type { InvestmentProduct } from "@/lib/types";

function formatRand(amount: number) {
  return `R${Math.round(amount).toLocaleString("en-ZA")}`;
}

function formatTerm(months: number) {
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} year${years === 1 ? "" : "s"}` : `${months} months`;
}

export function ReturnsTable({ product }: { product: InvestmentProduct }) {
  const min = Number(product.min_amount);
  const rate = Number(product.expected_return_rate);
  const tiers = [min, min * 5, min * 10, min * 50];

  return (
    <div className="overflow-hidden rounded-xl border border-gold-500/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-green-950 text-white">
              <th className="px-4 py-3 text-left font-semibold">Invested amount</th>
              <th className="px-4 py-3 text-left font-semibold">Term</th>
              <th className="px-4 py-3 text-left font-semibold">Projected payout</th>
              <th className="px-4 py-3 text-left font-semibold">Est. profit</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((amount, i) => {
              const profit = amount * (rate / 100) * (product.term_months / 12);
              const payout = amount + profit;
              return (
                <tr key={amount} className={i % 2 === 1 ? "bg-surface" : ""}>
                  <td className="border-t border-surface-border px-4 py-3 font-medium">
                    {formatRand(amount)}
                  </td>
                  <td className="border-t border-surface-border px-4 py-3 text-muted">
                    {formatTerm(product.term_months)}
                  </td>
                  <td className="border-t border-surface-border px-4 py-3 font-medium">
                    {formatRand(payout)}
                  </td>
                  <td className="border-t border-surface-border px-4 py-3 text-gold-600">
                    +{formatRand(profit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-surface-border bg-surface px-4 py-2.5 text-xs text-muted">
        Projected at the {rate}% annual rate over the full term - an estimate, not a guarantee.
        Actual returns vary with market performance.
      </p>
    </div>
  );
}
