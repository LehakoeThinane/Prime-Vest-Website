import type { Metadata } from "next";
import { BadgeCheck, LineChart, PiggyBank, TrendingUp, UserPlus, Wallet } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "The Prime Vest investment process: Register, Verify Account, Choose Investment, Invest, Track Portfolio, Receive Returns.",
};

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your free Prime Vest account with your email in under two minutes.",
  },
  {
    icon: BadgeCheck,
    title: "Verify Account",
    description: "Complete your investor profile so our team can verify your identity and approve your account.",
  },
  {
    icon: LineChart,
    title: "Choose Investment",
    description: "Browse property, portfolio, wealth building, advisory, and business funding products.",
  },
  {
    icon: Wallet,
    title: "Invest",
    description: "Fund your account by card, bank transfer, or crypto, then allocate to your chosen product.",
  },
  {
    icon: PiggyBank,
    title: "Track Portfolio",
    description: "Monitor performance, deposits, and withdrawals live from your investor dashboard.",
  },
  {
    icon: TrendingUp,
    title: "Receive Returns",
    description: "Returns are credited to your account and reflected in your earnings summary as they're paid.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section className="pb-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Six simple steps to start investing"
          description="From registration to receiving returns, here's exactly what to expect."
          align="center"
        />
      </Section>

      <Section tone="surface" className="pt-0">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <Card key={title} className="relative">
              <span className="absolute right-6 top-6 text-3xl font-bold text-surface-border">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-500/15 text-gold-500">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="navy" className="text-center">
        <SectionHeading eyebrow="Ready?" title="Start your investment journey today" align="center" />
        <ButtonLink href="/register">Invest Now</ButtonLink>
      </Section>
    </>
  );
}
