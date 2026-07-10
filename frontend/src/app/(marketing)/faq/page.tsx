import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { getFaqs } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about investing, registration, security, withdrawals, and support at Prime Vest.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <Section>
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know about investing with Prime Vest."
      />
      <FaqAccordion faqs={faqs} />
    </Section>
  );
}
