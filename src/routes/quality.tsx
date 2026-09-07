import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  FlaskConical,
  Gauge,
  Ruler,
  ShieldCheck,
  Droplets,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import engineerImg from "@/assets/engineer-inspection.jpg";
import pipelineImg from "@/assets/pipeline.jpg";
import { whatsappLink } from "@/data/site";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality Assurance, Testing & Standards | Khodiyar Engineering Ahmedabad" },
      {
        name: "description",
        content:
          "Spectrometric material verification, hydro shell pressure testing at 1.5x, API 598 seat tightness leak checks, dimensional inspection and EN 10204 3.1 certification on every valve batch.",
      },
      { property: "og:title", content: "Quality Assurance & Valve Testing | Khodiyar Engineering" },
      {
        property: "og:description",
        content:
          "How we inspect, pressure test, and certify every industrial valve before dispatch.",
      },
    ],
  }),
  component: QualityPage,
});

const CHECKS = [
  {
    icon: FlaskConical,
    title: "Spectroscopic Material Verification",
    text: "Raw material chemical analysis and optical emission spectroscopy ensuring precise Nickel, Chromium, and Molybdenum content in SS316, SS304, and WCB heats.",
  },
  {
    icon: Gauge,
    title: "1.5x Shell Hydro Pressure Testing",
    text: "Hydrostatic testing at 150% of maximum design pressure (e.g. 30 bar for PN16 lines) to verify casting integrity, body wall thickness, and bonnet joints.",
  },
  {
    icon: Droplets,
    title: "API 598 Seat Leak Tightness",
    text: "Zero-bubble air and liquid seat tightness checks to ANSI Class VI and ISO 5208 Rate A for tight shut-off in critical chemical and process headers.",
  },
  {
    icon: Ruler,
    title: "Precision Dimensional Inspection",
    text: "Coordinate and micrometric verification of face-to-face dimensions (ASME B16.10), flange drilling (B16.5 / DIN 2501), and ISO 5211 actuator mounting pads.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable Quality Control",
    text: "Serialised identification, batch heat tracking, and documented inspection checklists accompanying every dispatch to plant sites.",
  },
  {
    icon: Award,
    title: "Standard Compliance & Approvals",
    text: "Engineered and manufactured to API 6D, API 600, API 609, BS 5351, BS 1873, and ASME B16.34 industrial specifications.",
  },
];

const TEST_STEPS = [
  {
    step: "01",
    title: "Raw Material Inflow",
    desc: "Chemical heat analysis, PMI test verification, and ultrasonic check for casting voids.",
  },
  {
    step: "02",
    title: "CNC Machining & Bore Check",
    desc: "Seat diameter, stem finish Ra < 0.4µm, and flange face serration inspection.",
  },
  {
    step: "03",
    title: "Clean Assembly",
    desc: "Torque-controlled gland packing installation and precision seat ring seating.",
  },
  {
    step: "04",
    title: "Hydro & Pneumatic Testing",
    desc: "Full shell test, high-pressure liquid seat test, and 6 bar pneumatic bubble test.",
  },
  {
    step: "05",
    title: "Final Documentation",
    desc: "EN 10204 3.1 MTC generation, protective end capping, and rust-proof packaging.",
  },
];

function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality assurance"
        title="Zero-Defect Flow Control Through Rigorous Testing"
        description="A valve that fails in service costs far more than the valve itself. Our multi-stage inspection regime guarantees dependable pressure containment and leak-tight operation."
      />

      {/* Six Pillars of Quality Grid */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.08}>
                <div className="surface-panel h-full rounded-sm p-6 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:border-accent">
                  <div>
                    <c.icon className="h-7 w-7 text-accent" />
                    <h2 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide">
                      {c.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {c.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Inspection Lifecycle */}
      <section className="bg-navy-gradient py-16 sm:py-20 text-navy-foreground">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow text-accent">Inspection roadmap</div>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-3xl text-navy-foreground">
                From Raw Ingot to Dispatched Valve
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TEST_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <div className="h-full rounded-sm border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-display text-2xl font-bold text-accent">{s.step}</div>
                  <h3 className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-navy-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs text-navy-foreground/75 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection Facility Showcase */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={engineerImg}
              alt="Quality inspection and hydro testing of industrial valves"
              loading="lazy"
              width={1400}
              height={1000}
              className="w-full rounded-sm object-cover shadow-[var(--shadow-industrial)]"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <SectionHeading
              eyebrow="Documentation & Traceability"
              title="Test Certificates Shipped With Every Order"
              description="We provide comprehensive test dossiers for plant audit compliance and technical qualification."
            />
            <ul className="mt-6 space-y-3 text-xs sm:text-sm">
              {[
                "EN 10204 Type 3.1 Material Test Certificate (MTC)",
                "Hydrostatic Shell & Seat Pressure Test Reports",
                "PMI (Positive Material Identification) Spectro Logs",
                "Dimensional Inspection & Flange Face Reports",
                "Certificate of Compliance & 12-Month Performance Warranty",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact">Request Sample MTC &amp; Test Certificates</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={whatsappLink(
                    "Hello Khodiyar Engineering, please share a sample EN 10204 3.1 test certificate.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileCheck className="mr-2 h-4 w-4 text-accent" /> WhatsApp for Test Certs
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
