import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Calculator, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { INDUSTRIES, type Product } from "@/data/site";
import { Button } from "@/components/ui/button";
import pipelineImg from "@/assets/pipeline.jpg";
import engineerImg from "@/assets/engineer-inspection.jpg";
import heroImg from "@/assets/hero-factory.jpg";
import dairyImg from "@/assets/valve-dairy.jpg";

const IMAGES = [pipelineImg, engineerImg, heroImg, dairyImg];

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve | Process Valves for Chemical, Pharma & Dairy Plants" },
      {
        name: "description",
        content:
          "Industrial valves engineered for chemical, pharmaceutical, dairy, food processing, water treatment, oil & gas, power and textile plants across India.",
      },
      { property: "og:title", content: "Industry Applications | Khodiyar Engineering Ahmedabad" },
      {
        property: "og:description",
        content: "Valve selection guidance and construction matched to each process industry.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Plant Applications"
        title="Industrial Valves Engineered For Specific Process Duties"
        description="Every process industry faces unique challenges — aggressive acids, high-temperature saturated steam, CIP hygienic requirements, or abrasive slurries. We match the valve metallurgy and trim to the duty."
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 4) * 0.06}>
              <article className="surface-panel h-full overflow-hidden rounded-sm bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent">
                <img
                  src={IMAGES[i % IMAGES.length]}
                  alt={`${ind.name} valve applications in India`}
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-accent">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Application Specific
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                    {ind.name}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {ind.description}
                  </p>

                  <div className="mt-5 border-t border-border/70 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Recommended Valve Types:
                    </span>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {ind.valves.map((v) => (
                        <li
                          key={v}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="default">
                      <Link to="/contact">Request Proposal</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/products">Browse Range</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="container-x mt-14 flex flex-wrap items-center justify-between gap-4 surface-panel rounded-sm p-6 bg-navy-gradient text-navy-foreground">
            <div>
              <h3 className="font-display text-lg font-bold uppercase">
                Need technical valve sizing for your specific process line?
              </h3>
              <p className="text-xs opacity-80 mt-1">
                Use our interactive sizing desk to calculate required flow coefficient ($C_v$) and
                velocity limits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="default" size="sm">
                <Link to="/" hash="sizing-calculator">
                  <Calculator className="mr-1.5 h-4 w-4" /> Open Sizing Calculator
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/30 text-navy-foreground hover:bg-white/10"
              >
                <Link to="/contact">Discuss with Engineers</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
