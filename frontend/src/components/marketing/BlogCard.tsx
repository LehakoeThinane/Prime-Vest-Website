import Link from "next/link";
import { Badge, Card } from "@/components/ui/Card";
import type { BlogPostSummary } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  investing: "Investing",
  financial_education: "Financial Education",
  property_markets: "Property Markets",
  company_news: "Company Updates",
  market_insight: "Market Insight",
};

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full transition-colors hover:border-gold-500/50">
        <Badge>{categoryLabels[post.category] ?? post.category}</Badge>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>
        <p className="mt-4 text-xs text-muted">
          {new Date(post.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.author_name}
        </p>
      </Card>
    </Link>
  );
}
