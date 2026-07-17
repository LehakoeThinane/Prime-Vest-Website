"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { FAQ } from "@/lib/types";

const categoryLabels: Record<FAQ["category"], string> = {
  investments: "Investments",
  registration: "Registration",
  security: "Security",
  withdrawals: "Withdrawals",
  support: "Support",
};

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  const categories = useMemo(() => Array.from(new Set(faqs.map((f) => f.category))), [faqs]);

  const filtered = faqs.filter((faq) => {
    const matchesCategory = category === "all" || faq.category === category;
    const matchesQuery =
      !query ||
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="search"
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-surface-border bg-transparent py-2 pl-9 pr-3 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${category === "all" ? "bg-gold-500 text-green-950" : "border border-surface-border text-muted"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${category === c ? "bg-gold-500 text-green-950" : "border border-surface-border text-muted"}`}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-sm text-muted">No FAQs match your search.</p>}

      <div className="divide-y divide-surface-border rounded-xl border border-surface-border">
        {filtered.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <p className="px-5 pb-4 text-sm text-muted">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
