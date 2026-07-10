import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { categoryIcons } from "@/components/marketing/ProductCard";
import { getInvestmentProducts } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Investment Services",
  description:
    "Explore Prime Vest's investment services: Property Investments, Portfolio Management, Wealth Building, Investment Advisory, Business Funding Solutions, and Future Opportunities.",
};

const categoryOrder: Record<string, number> = {
  property: 1,
  portfolio: 2,
  wealth: 3,
  advisory: 4,
  business_funding: 5,
  future: 6,
};

export default async function ServicesPage() {
  const products = await getInvestmentProducts();
  const sorted = [...products].sort(
    (a, b) => (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99)
  );

  return (
    <>
      <Section className="pb-6">
        <SectionHeading
          eyebrow="Investment Services"
          title="Every product you need to build wealth, in one place"
          description="From property to business funding, each Prime Vest product is professionally managed and fully transparent from your dashboard."
        />
        <nav className="flex flex-wrap gap-2">
          {sorted.map((product) => (
            <a
              key={product.id}
              href={`#${product.category}`}
              className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-muted hover:border-gold-500 hover:text-foreground"
            >
              {product.name}
            </a>
          ))}
        </nav>
      </Section>

      {sorted.map((product, i) => {
        const Icon = categoryIcons[product.category];
        return (
          <Section key={product.id} id={product.category} tone={i % 2 === 1 ? "surface" : "default"}>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500/15 text-gold-500">
                  <Icon size={24} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">{product.name}</h2>
                <p className="mt-3 text-base text-muted">{product.description}</p>
                <div className="mt-6">
                  <ButtonLink href="/register">Invest Now</ButtonLink>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-surface-border p-5">
                  <dt className="text-xs text-muted">Minimum investment</dt>
                  <dd className="mt-1 text-xl font-semibold">
                    R{Number(product.min_amount).toLocaleString()}
                  </dd>
                </div>
                <div className="rounded-xl border border-surface-border p-5">
                  <dt className="text-xs text-muted">Expected annual return</dt>
                  <dd className="mt-1 text-xl font-semibold">{product.expected_return_rate}%</dd>
                </div>
                <div className="col-span-2 rounded-xl border border-surface-border p-5">
                  <dt className="text-xs text-muted">Term</dt>
                  <dd className="mt-1 text-xl font-semibold">{product.term_months} months</dd>
                </div>
              </dl>
            </div>
          </Section>
        );
      })}

      <Section tone="navy">
        <div className="text-center">
          <SectionHeading
            eyebrow="Not sure where to start?"
            title="Talk to an investment advisor"
            align="center"
          />
          <ButtonLink href="/contact">Contact Us</ButtonLink>
          <p className="mt-4 text-sm text-white/60">
            or read <Link href="/how-it-works" className="underline">how the investment process works</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}
