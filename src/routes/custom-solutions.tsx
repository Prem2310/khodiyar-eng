import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Cog, Layers, Users, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { whatsappLink } from "@/data/site";

export const Route = createFileRoute("/custom-solutions")({
  head: () => ({
    meta: [
      { title: "Custom Valve Design & Made-to-Order Manufacturing | Khodiyar Engineering" },
      {
        name: "description",
        content:
          "Customised valve design, special alloy metallurgy (SS316L, Duplex, Monel, PTFE lining), bulk project manufacturing and engineering consultation from Ahmedabad.",
      },
      { property: "og:title", content: "Custom Valve Engineering Solutions | Khodiyar" },
      {
        property: "og:description",
        content:
          "Custom valve design, non-standard face-to-face dimensions, special alloys and project batch production.",
      },
    ],
  }),
  component: CustomSolutionsPage,
});

const FEATURES = [
  {
    icon: Cog,
    title: "Custom Valve Trim & Dimensions",
    text: "Non-standard face-to-face lengths, custom port configurations, extended stems for cryogenic/lagging insulation, and custom ISO 5211 direct-mount pads built to your drawing.",
  },
  {
    icon: Layers,
    title: "Special Material & Lining Options",
    text: "SS316L, duplex stainless, super duplex, pure PTFE/PFA fully lined bodies for aggressive acids, chlorine, solvent headers, and corrosive slurry service.",
  },
  {
    icon: Boxes,
    title: "Bulk Project & EPC Manufacturing",
    text: "Scheduled batch manufacturing for new plant greenfield expansions, EPC packages, annual maintenance shutdown replacements, and direct export shipments.",
  },
  {
    icon: Users,
    title: "Plant Engineering Consultation",
    text: "Application review, piping layout valve selection, pressure drop calculation, and actuation torque sizing support directly from our experienced Ahmedabad team.",
  },
];

function CustomSolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering services"
        title="When Off-the-Shelf Catalogue Valves Won't Do"
        description="When your process requires special face-to-face dimensions, custom porting, high corrosion metallurgy, or unique actuation packages, we manufacture made-to-order valve solutions."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#enquiry">Submit Engineering Requirement</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-navy-foreground hover:bg-white/10"
          >
            <a
              href={whatsappLink(
                "Hello Khodiyar Engineering, I want to discuss a custom valve requirement.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss on WhatsApp
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Feature Grid */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.1}>
              <div className="surface-panel h-full rounded-sm p-7 flex flex-col justify-between bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent">
                <div>
                  <f.icon className="h-7 w-7 text-accent" />
                  <h2 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">
                    {f.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {f.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process Flow */}
      <section className="bg-navy-gradient py-16 sm:py-20 text-navy-foreground">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-accent">Design &amp; Build Lifecycle</div>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-3xl text-navy-foreground">
                How Custom Orders Are Executed
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1. Drawing Review",
                desc: "We review your line schematic, fluid media, operating envelope, and dimensional constraints.",
              },
              {
                step: "2. CAD & GA Drawing",
                desc: "Our design desk prepares a General Arrangement (GA) drawing with cross-section for approval.",
              },
              {
                step: "3. Precision CNC Run",
                desc: "Machined from certified billets/castings on CNC centres to tight tolerances.",
              },
              {
                step: "4. Certified Testing",
                desc: "100% shell hydro tested, seat leak verified, and shipped with complete EN 10204 3.1 documentation.",
              },
            ].map((p, i) => (
              <Reveal key={p.step} delay={i * 0.08}>
                <div className="h-full rounded-sm border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-display text-base font-bold text-accent">{p.step}</div>
                  <p className="mt-2 text-xs text-navy-foreground/80 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="bg-surface py-16 sm:py-20">
        <div className="container-x max-w-4xl">
          <Reveal>
            <div className="eyebrow">Direct factory proposal</div>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Share Your Drawing &amp; Technical Requirements
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Upload your requirement drawing or line parameters. Our engineering team reviews the
              specification and responds with a technical proposal and quotation.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="surface-panel mt-8 rounded-sm p-6 sm:p-8 bg-card">
              <EnquiryForm defaultProduct="Customised valve solution" />
            </div>
          </Reveal>
          <p className="mt-6 text-xs text-muted-foreground">
            Looking for standard catalogue valves? View our{" "}
            <Link to="/products" className="font-semibold text-primary hover:underline">
              standard industrial product range
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
