import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2
        className={cn(
          "mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl",
          invert ? "text-navy-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      <div className={cn("mt-4 h-1 w-16 rule-accent", align === "center" && "mx-auto")} />
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed", invert ? "text-navy-foreground/80" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-navy-gradient py-16 text-navy-foreground sm:py-20">
      <div className="container-x fade-up">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/80">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
