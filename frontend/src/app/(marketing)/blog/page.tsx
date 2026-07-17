import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BlogCard } from "@/components/marketing/BlogCard";
import { getBlogPosts } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on investing, financial education, property markets, and Prime Vest company updates.",
};

const categories = [
  { value: "", label: "All" },
  { value: "investing", label: "Investing" },
  { value: "financial_education", label: "Financial Education" },
  { value: "property_markets", label: "Property Markets" },
  { value: "market_insight", label: "Market Insight" },
  { value: "company_news", label: "Company Updates" },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getBlogPosts({ category });

  return (
    <Section>
      <SectionHeading
        eyebrow="Blog"
        title="Investing insights & company updates"
        description="Articles on investing, financial education, property markets, and Prime Vest news."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.value}
            href={c.value ? `/blog?category=${c.value}` : "/blog"}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              (category ?? "") === c.value
                ? "bg-gold-500 text-green-950"
                : "border border-surface-border text-muted"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted">No articles in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}
