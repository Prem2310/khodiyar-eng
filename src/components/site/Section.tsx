import type { ReactNode } from "react";
import { motion } from "motion/react";
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
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            invert ? "text-navy-foreground/80" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

const easeOut = [0.16, 1, 0.3, 1] as const;

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
    <section className="relative isolate overflow-hidden bg-navy-gradient py-20 text-navy-foreground sm:py-24">
      <div className="absolute inset-0 tech-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 [background-image:var(--gradient-mesh)]" />
      <motion.div
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-x relative">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {eyebrow}
        </motion.div>
        <motion.h1
          className="mt-3 max-w-3xl text-4xl font-bold uppercase tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: easeOut }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: easeOut }}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: easeOut }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
