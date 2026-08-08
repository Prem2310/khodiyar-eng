import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck, Calculator, Sparkles, Layers, FileSpreadsheet } from "lucide-react";
import engineerImg from "@/assets/engineer-inspection.jpg";
import pipelineImg from "@/assets/pipeline.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Section";
import { CinematicHero } from "@/components/site/CinematicHero";
import { ValveOrbit } from "@/components/site/ValveOrbit";
import { ScrollStory } from "@/components/site/ScrollStory";
import { Reveal } from "@/components/site/Reveal";
import { ParticleField } from "@/components/site/ParticleField";
import { ValveFlowSimulator } from "@/components/site/ValveFlowSimulator";
import { ValveSizingCalculator } from "@/components/site/ValveSizingCalculator";
import { ValveComparisonMatrix } from "@/components/site/ValveComparisonMatrix";
import { StructuredData } from "@/components/site/StructuredData";
import { INDUSTRIES, PRODUCTS } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Industrial Valve Manufacturer Ahmedabad | Khodiyar Engineering" },
      {
        name: "description",
        content:
          "Precision engineered ball, butterfly, gate, globe, check, plug, dairy and pneumatic valves manufactured in Ahmedabad, Gujarat for critical chemical, pharma, dairy, water, and oil & gas plants.",
      },
      { property: "og:title", content: "Khodiyar Engineering | Industrial Valve Manufacturer Ahmedabad" },
      {
        property: "og:description",
        content:
          "Reliable industrial valves designed for performance, durability and safety. Supplying chemical, pharma, dairy, water and oil & gas plants across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STATS = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 50000, suffix: "+", label: "Products Delivered" },
  { value: 12, suffix: "+", label: "Industries Served" },
  { value: 800, suffix: "+", label: "Happy Customers" },
];

const MARQUEE = [
  "Ball Valves (DN15 - DN300)",
  "Butterfly Valves (Wafer & Lug)",
  "Gate Valves (API 600)",
  "Globe Valves (Throttling Trim)",
  "Check / NRV (Dual Plate & Swing)",
  "PTFE Sleeved Plug Valves",
  "Sanitary Dairy Valves (SS316L)",
  "Pneumatic Actuated Assemblies",
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 800 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <>
      <StructuredData />

      {/* Cinematic Hero */}
      <CinematicHero />

      {/* Industrial Marquee Bar */}
      <div className="relative overflow-hidden border-y border-border bg-surface py-3.5">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={`${m}-${i}`}
              className="font-display text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground"
            >
              {m} <span className="text-accent ml-4">◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Interactive 3D Product Orbit Ring */}
      <ValveOrbit />

      {/* Interactive 2D/3D Cutaway Flow Simulator */}
      <ValveFlowSimulator />

      {/* About the Engineering Company */}
      <section className="py-24 sm:py-28" ref={aboutRef}>
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="About Khodiyar Engineering"
                title="Precision Flow Control Engineering Built in Ahmedabad"
                description="Khodiyar Engineering manufactures and supplies high-durability industrial valves and custom engineered flow packages for process plants across India."
              />
            </Reveal>
            <div className="mt-8 grid gap-5">
              {[
                {
                  title: "In-House Precision Machining",
                  text: "CNC turning centres, boring machines, dedicated assembly fixtures, and hydro-test facilities supporting standard and custom builds from DN15 to DN600.",
                },
                {
                  title: "Documented Quality Assurance",
                  text: "Raw material spectroscopic grade verification, 100% shell hydro testing at 1.5x rating, seat leak tests to API 598, and full batch traceability.",
                },
                {
                  title: "Fast Quotations & Dependable Dispatch",
                  text: "Application-matched valve selection support, instant Bill of Materials quotation desk, and reliable dispatch timelines for projects and maintenance shutdowns.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <div className="border-l-2 border-accent pl-5 transition-transform duration-300 hover:translate-x-1">
                    <h3 className="font-display text-base sm:text-lg font-semibold uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/about">More About Our Facility</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/contact">Request Technical Offer</Link>
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="relative overflow-hidden rounded-sm shadow-[var(--shadow-industrial)]">
            <motion.img
              src={engineerImg}
              alt="Engineer inspecting a stainless steel industrial valve in Ahmedabad"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-[460px] w-full object-cover"
              style={{ y: imgY, scale: 1.15 }}
            />
          </div>
        </div>
      </section>

      {/* Industrial Valve Sizing & Cv Calculator */}
      <ValveSizingCalculator />

      {/* Pinned Manufacturing Process Story */}
      <ScrollStory />

      {/* Side-by-Side Comparison Matrix */}
      <ValveComparisonMatrix />

      {/* Proven Performance Stats Bar */}
      <section className="relative isolate overflow-hidden bg-navy-gradient py-16 text-navy-foreground">
        <ParticleField density={0.00005} />
        <div className="container-x relative grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="font-display text-4xl font-bold text-accent sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.16em] opacity-80">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-surface py-24 sm:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Plant Applications"
              title="Valves Engineered for the Process Duty"
              description="From hygienic CIP dairy headers to high-temperature steam lines and aggressive chemical reactors, we specify construction matched to the media."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i, idx) => (
              <Reveal key={i.slug} delay={idx * 0.05}>
                <TiltCard>
                  <div className="surface-panel h-full rounded-sm p-5 flex flex-col justify-between">
                    <div>
                      <ShieldCheck className="h-6 w-6 text-accent" />
                      <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-wide">
                        {i.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{i.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Recommended:
                      </span>
                      <div className="mt-1 text-xs font-medium text-foreground">
                        {i.valves.join(" · ")}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/industries">Explore All Industry Applications</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/custom-solutions">Custom Engineered Solutions</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality Commitment Section */}
      <section className="relative isolate overflow-hidden py-28">
        <motion.img
          src={pipelineImg}
          alt="Industrial pipeline system with valves"
          loading="lazy"
          width={1400}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.18 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading
              eyebrow="Quality assurance"
              title="Quality Is Our Commitment"
              description="Spectroscopic material testing, 1.5x pressure testing, bubble-tight leak testing, and dimensional inspection on every batch."
              invert
            />
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              "100% Hydro Shell Tested",
              "API 598 Seat Leak Verified",
              "EN 10204 3.1 Traceability",
              "ISO 5211 Direct Mount Ready",
            ].map((c, i) => (
              <Reveal key={c} delay={i * 0.1}>
                <div className="flex items-center gap-2 text-navy-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{c}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <Button
              asChild
              variant="outline"
              className="mt-9 border-white/40 bg-white/5 text-navy-foreground hover:bg-white/15 hover:text-navy-foreground"
            >
              <Link to="/quality">Inspect Our Quality Assurance Process</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-24">
        <Reveal>
          <div className="container-x surface-panel relative flex flex-col items-start gap-6 overflow-hidden rounded-sm p-10 md:flex-row md:items-center md:justify-between bg-navy-gradient text-navy-foreground">
            <div className="relative">
              <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl text-navy-foreground">
                Need a formal quotation or custom valve design?
              </h2>
              <p className="mt-2.5 max-w-xl text-sm text-navy-foreground/85">
                Share your line drawing, media specifications, or Bill of Materials. Our sales
                engineering desk responds with technical data and competitive factory pricing.
              </p>
            </div>
            <div className="relative flex flex-wrap gap-3 shrink-0">
              <Button asChild size="lg" className="group shadow-lg">
                <Link to="/contact">
                  Request Quotation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-navy-foreground hover:bg-white/15 hover:text-navy-foreground"
              >
                <Link to="/products">Browse Product Catalogue</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
