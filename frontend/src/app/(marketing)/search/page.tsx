"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { searchSite } from "@/lib/api";
import { Section, SectionHeading } from "@/components/ui/Section";

type SearchResults = {
  blog_posts: { id: number; title: string; slug: string; excerpt: string }[];
  faqs: { id: number; question: string; answer: string }[];
  products: { id: number; name: string; slug: string }[];
};

function SearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the search request below
    setLoading(true);
    searchSite(initialQuery)
      .then((r) => setResults(r as SearchResults))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const hasResults =
    results && (results.blog_posts.length > 0 || results.faqs.length > 0 || results.products.length > 0);

  return (
    <Section>
      <SectionHeading eyebrow="Search" title="Search Prime Vest" />
      <form onSubmit={handleSubmit} className="mb-10 flex max-w-md gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, FAQs, products..."
            className="w-full rounded-md border border-surface-border bg-transparent py-2 pl-9 pr-3 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-green-950">
          Search
        </button>
      </form>

      {loading && <p className="text-sm text-muted">Searching…</p>}

      {!loading && initialQuery && !hasResults && (
        <p className="text-sm text-muted">No results for &ldquo;{initialQuery}&rdquo;.</p>
      )}

      {results && results.products.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            Investment products
          </h3>
          <ul className="space-y-2">
            {results.products.map((p) => (
              <li key={p.id}>
                <Link href={`/services#${p.slug}`} className="text-sm text-gold-500 hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && results.blog_posts.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Articles</h3>
          <ul className="space-y-3">
            {results.blog_posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-gold-500 hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-muted">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && results.faqs.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">FAQs</h3>
          <ul className="space-y-3">
            {results.faqs.map((faq) => (
              <li key={faq.id}>
                <p className="text-sm font-medium">{faq.question}</p>
                <p className="text-sm text-muted">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsView />
    </Suspense>
  );
}
