import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, Cog, Factory, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import engineerImg from "@/assets/engineer-inspection.jpg";
import heroImg from "@/assets/hero-factory.jpg";
import { COMPANY } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Khodiyar Engineering | Valve Manufacturer Vastral Ahmedabad" },
      {
        name: "description",
        content:
          "Khodiyar Engineering is an Ahmedabad-based valve manufacturing company providing high-durability industrial valves, CNC machining, hydro testing and custom flow control solutions across India.",
      },
      { property: "og:title", content: "About Khodiyar Engineering Ahmedabad" },
      {
        property: "og:description",
        content:
          "Our history, CNC manufacturing capabilities, testing rigs, and commitment to industrial process plants.",
      },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "50,000+", label: "Products Delivered" },
  { value: "12+", label: "Industries Served" },
  { value: "800+", label: "Happy Customers" },
];

const CAPABILITIES = [
  {
    icon: Factory,
    title: "Precision Machining Shop",
    desc: "Equipped with CNC turning centres, heavy-duty lathes, radial drilling machines, and milling heads for machining valve bodies up to DN600.",
  },
  {
    icon: ShieldCheck,
    title: "In-House Hydro Testing Rig",
    desc: "Dedicated hydraulic test station capable of shell testing up to 100 bar and 0–10 bar air leak testing with high-precision calibrated digital gauges.",
  },
  {
    icon: Cog,
    title: "Automation & Actuator Bay",
    desc: "Assembly and torque calibration bay for double acting and spring return pneumatic actuators, solenoid valves, and valve positioners.",
  },
  {
    icon: Award,
    title: "Sanitary Mirror Polishing",
    desc: "Internal mechanical and electro-polishing for SS316L food and dairy valves achieving surface roughness Ra < 0.8µm for CIP circuits.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the company"
        title="An Ahmedabad Engineering House Built On Flow Control"
        description="Khodiyar Engineering manufactures and supplies reliable industrial valves, custom engineered valve packages, and precision machined flow equipment for process industries across India."
      />

      {/* Main Narrative & Facility */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <Reveal>
              <SectionHeading
                eyebrow="Our history"
                title="From Precision Machining to Full Valve Manufacturing"
              />
              <p className="mt-5 leading-relaxed text-muted-foreground text-sm sm:text-base">
                Established in the industrial hub of Vastral, Ahmedabad, Khodiyar Engineering
                started with a focus on high-precision machining of critical flow components. Over
                15+ years of continuous reinvestment in CNC technology, dedicated assembly fixtures,
                and pressure testing rigs, we evolved into a trusted manufacturer and supplier for
                chemical, pharmaceutical, dairy, water treatment, and power plants.
              </p>
            </Reveal>

            <div className="border-l-2 border-accent pl-5 space-y-4">
              {[
                {
                  title: "Manufacturing Breadth",
                  text: 'Standard and custom valve bodies from DN15 (½") to DN600 (24") in SS304, SS316, SS316L, WCB carbon steel, and cast iron.',
                },
                {
                  title: "Quality Rigour",
                  text: "Every batch follows strict process sheets: spectroscopic raw material check, dimensional inspection, shell hydro testing at 1.5x rating, and bubble-tight seat testing.",
                },
                {
                  title: "Speed & Reliability",
                  text: "Fast engineering quotations, technical datasheet support, transparent production timelines, and dependable dispatch schedules across all Indian industrial zones.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <h3 className="font-display text-base font-semibold uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3} className="pt-2 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/products">
                  Explore Valve Catalogue <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Our Works</Link>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="space-y-6">
            <img
              src={heroImg}
              alt="Khodiyar Engineering valve manufacturing facility in Ahmedabad"
              loading="lazy"
              width={1920}
              height={1088}
              className="w-full rounded-sm object-cover shadow-[var(--shadow-industrial)]"
            />
            <img
              src={engineerImg}
              alt="Engineer inspecting industrial valves at Khodiyar Engineering"
              loading="lazy"
              width={1400}
              height={1000}
              className="w-full rounded-sm object-cover shadow-[var(--shadow-industrial)]"
            />
          </Reveal>
        </div>
      </section>

      {/* Capabilities 4-Grid */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Plant infrastructure"
              title="In-House Manufacturing & Testing Capabilities"
              description="Our manufacturing setup is configured for both standard catalogue runs and made-to-drawing custom engineering orders."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="surface-panel h-full rounded-sm p-6 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:border-accent">
                  <div>
                    <c.icon className="h-7 w-7 text-accent" />
                    <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-wide">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-gradient py-14 text-navy-foreground">
        <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="font-display text-4xl font-bold text-accent sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.16em] opacity-80">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
