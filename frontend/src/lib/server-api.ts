import type {
  BlogPostDetail,
  BlogPostSummary,
  FAQ,
  InvestmentProduct,
  Milestone,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

const API_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function serverFetch<T>(path: string, fallback: T, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function getSiteSettings() {
  return serverFetch<SiteSettings>("/api/content/site-settings/", {
    hero_headline: "Building Wealth Through Smart Investments.",
    company_intro:
      "Prime Vest is a trusted investment partner helping individuals and businesses grow wealth through property, portfolio management, and business funding solutions.",
    phone: "",
    email: "",
    whatsapp_number: "",
    address: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    bank_branch_code: "",
    google_maps_embed_url: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
  });
}

export function getTestimonials() {
  return serverFetch<Testimonial[]>("/api/content/testimonials/", []);
}

export function getTeamMembers() {
  return serverFetch<TeamMember[]>("/api/content/team/", []);
}

export function getMilestones() {
  return serverFetch<Milestone[]>("/api/content/milestones/", []);
}

export function getFaqs(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return serverFetch<FAQ[]>(`/api/content/faqs/${query}`, []);
}

export function getBlogPosts(params: { category?: string; q?: string } = {}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  const query = search.toString() ? `?${search.toString()}` : "";
  return serverFetch<BlogPostSummary[]>(`/api/content/blog/${query}`, []);
}

export function getBlogPost(slug: string) {
  return serverFetch<BlogPostDetail | null>(`/api/content/blog/${slug}/`, null, 30);
}

export function getInvestmentProducts() {
  return serverFetch<InvestmentProduct[]>("/api/investments/products/", []);
}

export function absoluteMediaUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${publicUrl}${path}`;
}
