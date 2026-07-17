import { ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { BlogCard } from "@/components/marketing/BlogCard";
import { ProductCard } from "@/components/marketing/ProductCard";
import {
  getBlogPosts,
  getInvestmentProducts,
  getSiteSettings,
  getTestimonials,
} from "@/lib/server-api";

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Secure & regulated",
    description: "Bank-grade encryption, SSL security, and diversified, vetted investment products.",
  },
  {
    icon: TrendingUp,
    title: "Consistent returns",
    description: "A track record of steady, transparent returns across property and portfolio products.",
  },
  {
    icon: Users,
    title: "Dedicated advisors",
    description: "Real investment professionals guiding your strategy, not just an algorithm.",
  },
  {
    icon: Wallet,
    title: "Full transparency",
    description: "Track every deposit, investment, and return live from your investor dashboard.",
  },
];

export default async function HomePage() {
  const [settings, testimonials, posts, products] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
    getBlogPosts(),
    getInvestmentProducts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-green-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,152,46,0.18),_transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-400">
            Prime Vest Investment
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {settings.hero_headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">{settings.company_intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/register" size="lg">
              Invest Now
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Learn More
            </ButtonLink>
          </div>
        </div>
      </section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Investment highlights"
          title="Many ways to grow your wealth with Prime Vest"
          description="From property to business funding, choose the products that fit your goals and risk profile."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Why Prime Vest" title="Why choose Prime Vest Investment" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-gold-500/15 text-gold-500">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section tone="surface">
          <SectionHeading eyebrow="Client stories" title="What our investors say" align="center" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Section>
      )}

      {posts.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Insights"
            title="Latest news & market insights"
            description="Analysis and updates from the Prime Vest investment team."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/blog" variant="ghost">
              Read more articles
            </ButtonLink>
          </div>
        </Section>
      )}

      <Section tone="green">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title="Ready to start building wealth?"
              description="Speak to an investment advisor or reach out with any questions - we usually respond within a business day."
            />
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/contact">Contact Us</ButtonLink>
              <ButtonLink href="/register" variant="ghost" className="border-white/20 text-white hover:bg-white/10">
                Create an account
              </ButtonLink>
            </div>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p>
              <span className="font-semibold text-white">Phone:</span> {settings.phone}
            </p>
            <p>
              <span className="font-semibold text-white">Email:</span> {settings.email}
            </p>
            <p>
              <span className="font-semibold text-white">Office:</span> {settings.address}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
