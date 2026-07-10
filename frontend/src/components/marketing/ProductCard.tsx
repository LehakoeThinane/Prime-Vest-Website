import { Briefcase, Building2, LineChart, PiggyBank, Rocket, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { InvestmentProduct } from "@/lib/types";

export const categoryIcons: Record<InvestmentProduct["category"], typeof Building2> = {
  property: Building2,
  portfolio: LineChart,
  wealth: PiggyBank,
  advisory: Users,
  business_funding: Briefcase,
  future: Rocket,
};

export function ProductCard({ product, id }: { product: InvestmentProduct; id?: string }) {
  const Icon = categoryIcons[product.category];

  return (
    <Card id={id} className="scroll-mt-24">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-500/15 text-gold-500">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm text-muted">{product.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-surface-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted">Min. investment</dt>
          <dd className="font-semibold">R{Number(product.min_amount).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Expected return</dt>
          <dd className="font-semibold">{product.expected_return_rate}% p.a.</dd>
        </div>
      </dl>
    </Card>
  );
}
