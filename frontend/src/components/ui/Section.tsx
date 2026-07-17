import { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  children,
  className = "",
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "surface" | "green";
}) {
  const toneClass =
    tone === "surface"
      ? "bg-surface"
      : tone === "green"
        ? "bg-green-950 text-white"
        : "";

  return (
    <section id={id} className={`py-16 sm:py-20 ${toneClass} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base text-muted">{description}</p>}
    </div>
  );
}
