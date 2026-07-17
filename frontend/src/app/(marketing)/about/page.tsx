import type { Metadata } from "next";
import { Compass, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getMilestones, getTeamMembers } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Prime Vest's story, vision, mission, core values, leadership team, and milestones as a trusted investment partner.",
};

const values = [
  { icon: ShieldCheck, title: "Integrity", description: "We act transparently and in our investors' best interests, always." },
  { icon: Target, title: "Performance", description: "Disciplined investment selection focused on sustainable, real returns." },
  { icon: HeartHandshake, title: "Client-first", description: "Every product and process is designed around investor outcomes." },
  { icon: Sparkles, title: "Innovation", description: "We continuously improve how people access and manage investments." },
];

export default async function AboutPage() {
  const [team, milestones] = await Promise.all([getTeamMembers(), getMilestones()]);

  return (
    <>
      <Section className="pb-10">
        <SectionHeading
          eyebrow="About Prime Vest"
          title="A trusted partner in building lasting wealth"
          description="Prime Vest was founded on a simple idea: everyday investors deserve access to the same quality investment opportunities as institutions - with full transparency and hands-on support."
        />
      </Section>

      <Section tone="surface" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <Compass className="text-gold-500" size={24} />
            <h3 className="mt-4 text-lg font-semibold">Our Story</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Prime Vest started in 2018 with a single property fund and a handful of early
              investors who believed in a more transparent way to invest. Since then, we&apos;ve
              grown into a full-service investment platform spanning property, managed
              portfolios, wealth building, advisory, and business funding - while staying true
              to the principle that every investor deserves clear reporting and honest advice.
            </p>
          </Card>
          <Card>
            <Target className="text-gold-500" size={24} />
            <h3 className="mt-4 text-lg font-semibold">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              To be the most trusted investment partner in the region - the first name investors
              think of when they&apos;re ready to grow their wealth.
            </p>
            <h3 className="mt-6 text-lg font-semibold">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              To make quality, well-managed investment opportunities accessible to everyone,
              backed by transparent reporting, expert advice, and secure technology.
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What drives us" title="Our core values" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
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

      {team.length > 0 && (
        <Section tone="surface">
          <SectionHeading eyebrow="Leadership" title="Meet the team" align="center" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.id} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900 text-lg font-semibold text-gold-400">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
                <p className="text-xs text-gold-500">{member.role}</p>
                <p className="mt-2 text-sm text-muted">{member.bio}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {milestones.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Our journey" title="Company milestones" align="center" />
          <ol className="relative mx-auto max-w-2xl border-l border-surface-border pl-6">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="mb-8 last:mb-0">
                <div className="absolute -ml-[1.9rem] mt-1 h-3 w-3 rounded-full bg-gold-500" />
                <p className="text-sm font-semibold text-gold-500">{milestone.year}</p>
                <h3 className="text-base font-semibold">{milestone.title}</h3>
                <p className="mt-1 text-sm text-muted">{milestone.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </>
  );
}
