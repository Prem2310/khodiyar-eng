import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Flame, ShieldAlert, Sparkles, X, ArrowRight, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValveSpecMatrix {
  slug: string;
  name: string;
  shutoffClass: string;
  maxPressure: string;
  tempRange: string;
  throttling: "Excellent" | "Good" | "Fair" | "Poor / Not Recommended";
  pressureDrop: "Very Low" | "Low" | "Medium" | "High";
  spaceEnvelope: "Compact" | "Standard" | "Bulky";
  costIndex: "$" | "$$" | "$$$" | "$$$$";
  cipSanitary: boolean;
  slurrySolids: "High" | "Moderate" | "Low";
  standardStandards: string;
  idealApplication: string;
}

const MATRIX_DATA: ValveSpecMatrix[] = [
  {
    slug: "ball-valves",
    name: "Ball Valves",
    shutoffClass: "ANSI Class VI (Bubble-Tight)",
    maxPressure: "Class 150 – 600 / PN16 – PN100",
    tempRange: "-20°C to 200°C (PTFE) / 350°C (Metal)",
    throttling: "Fair",
    pressureDrop: "Very Low",
    spaceEnvelope: "Standard",
    costIndex: "$$",
    cipSanitary: true,
    slurrySolids: "Moderate",
    standardStandards: "BS 5351 / API 6D / ASME B16.34",
    idealApplication: "Chemical lines, Hydrocarbons, Gas isolation & Tight shutoff",
  },
  {
    slug: "butterfly-valves",
    name: "Butterfly Valves",
    shutoffClass: "ANSI Class VI / Class A (EN 12266-1)",
    maxPressure: "PN10 / PN16 / Class 150",
    tempRange: "-10°C to 180°C (EPDM/PTFE)",
    throttling: "Good",
    pressureDrop: "Low",
    spaceEnvelope: "Compact",
    costIndex: "$",
    cipSanitary: true,
    slurrySolids: "Moderate",
    standardStandards: "API 609 / BS 5155 / EN 593",
    idealApplication: "Large bore water, Dairy lines, HVAC & Effluent treatment",
  },
  {
    slug: "y-type-strainers",
    name: "Y-Type Strainers",
    shutoffClass: "ANSI Class IV / API 598 Metal",
    maxPressure: "Class 150 – 300 / PN16 – PN40",
    tempRange: "-10°C to 400°C (Stellite)",
    throttling: "Poor / Not Recommended",
    pressureDrop: "Very Low",
    spaceEnvelope: "Bulky",
    costIndex: "$$",
    cipSanitary: false,
    slurrySolids: "Low",
    standardStandards: "API 600 / BS 1414 / ASME B16.34",
    idealApplication: "Steam lines, Water distribution, Oil pipelines (On/Off only)",
  },
  {
    slug: "t-type-strainers",
    name: "T-Type Strainers",
    shutoffClass: "ANSI Class IV / API 598 Metal",
    maxPressure: "Class 150 – 300 / PN16 – PN40",
    tempRange: "-10°C to 400°C (Stellite)",
    throttling: "Poor / Not Recommended",
    pressureDrop: "Very Low",
    spaceEnvelope: "Bulky",
    costIndex: "$$",
    cipSanitary: false,
    slurrySolids: "Low",
    standardStandards: "API 600 / BS 1414 / ASME B16.34",
    idealApplication: "Steam lines, Water distribution, Oil pipelines (On/Off only)", 
  },
  {
    slug: "gate-valves",
    name: "Gate Valves",
    shutoffClass: "ANSI Class IV / API 598 Metal",
    maxPressure: "Class 150 – 300 / PN16 – PN40",
    tempRange: "-10°C to 400°C (Stellite)",
    throttling: "Poor / Not Recommended",
    pressureDrop: "Very Low",
    spaceEnvelope: "Bulky",
    costIndex: "$$",
    cipSanitary: false,
    slurrySolids: "Low",
    standardStandards: "API 600 / BS 1414 / ASME B16.34",
    idealApplication: "Steam lines, Water distribution, Oil pipelines (On/Off only)",
  },
  {
    slug: "globe-valves",
    name: "Globe Valves",
    shutoffClass: "ANSI Class IV / Class V",
    maxPressure: "Class 150 – 300 / PN25 – PN40",
    tempRange: "-10°C to 425°C",
    throttling: "Excellent",
    pressureDrop: "High",
    spaceEnvelope: "Bulky",
    costIndex: "$$$",
    cipSanitary: false,
    slurrySolids: "Low",
    standardStandards: "BS 1873 / ASME B16.34",
    idealApplication: "Steam regulation, Boiler feed & Precise continuous throttling",
  },
  {
    slug: "check-valves",
    name: "Check / NRV",
    shutoffClass: "API 598 Metal / Soft Seat",
    maxPressure: "PN16 / Class 150",
    tempRange: "-10°C to 300°C",
    throttling: "Poor / Not Recommended",
    pressureDrop: "Low",
    spaceEnvelope: "Compact (Wafer) / Standard",
    costIndex: "$$",
    cipSanitary: true,
    slurrySolids: "Moderate",
    standardStandards: "BS 1868 / API 594",
    idealApplication: "Pump discharge headers & Reverse flow pipeline protection",
  },
  {
    slug: "plug-valves",
    name: "Plug Valves",
    shutoffClass: "ANSI Class VI (Sleeved)",
    maxPressure: "PN16 / Class 150",
    tempRange: "-10°C to 200°C",
    throttling: "Fair",
    pressureDrop: "Low",
    spaceEnvelope: "Standard",
    costIndex: "$$$",
    cipSanitary: false,
    slurrySolids: "High",
    standardStandards: "API 599 / BS 5353",
    idealApplication: "Chemical slurries, Viscous media, Resins & Textile dyeing",
  },
  {
    slug: "sanitary-dairy-valves",
    name: "Sanitary Dairy",
    shutoffClass: "100% Leak-Tight (Food Grade)",
    maxPressure: "10 bar",
    tempRange: "-10°C to 140°C (CIP/SIP)",
    throttling: "Good",
    pressureDrop: "Very Low",
    spaceEnvelope: "Compact",
    costIndex: "$$$",
    cipSanitary: true,
    slurrySolids: "High",
    standardStandards: "DIN 11851 / SMS 1145 / 3A Hygienic",
    idealApplication: "Milk processing, Brewing, Pharmaceutical GMP & Food slurries",
  },
  {
    slug: "pneumatic-valves",
    name: "Pneumatic Valves",
    shutoffClass: "ANSI Class VI Fast Acting",
    maxPressure: "PN16 / Class 150",
    tempRange: "-10°C to 180°C",
    throttling: "Excellent (with Positioner)",
    pressureDrop: "Low",
    spaceEnvelope: "Standard + Actuator",
    costIndex: "$$$$",
    cipSanitary: true,
    slurrySolids: "High",
    standardStandards: "ISO 5211 / NAMUR / ATEX",
    idealApplication: "Plant automation, Emergency shutoff, PLC sequenced batching",
  },
];

export function ValveComparisonMatrix() {
  const [filterDuty, setFilterDuty] = useState<string>("all");

  const filtered = MATRIX_DATA.filter((v) => {
    if (filterDuty === "sanitary") return v.cipSanitary;
    if (filterDuty === "throttling") return v.throttling === "Excellent" || v.throttling === "Good";
    if (filterDuty === "tight") return v.shutoffClass.includes("Class VI") || v.shutoffClass.includes("Tight");
    if (filterDuty === "high-pressure") return v.maxPressure.includes("PN40") || v.maxPressure.includes("Class 300");
    return true;
  });

  return (
    <section className="py-20 sm:py-24" id="comparison-matrix">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">
              <Table className="h-3.5 w-3.5 text-accent" />
              Technical Decision Framework
            </div>
            <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Valve Selection &amp; Comparison Matrix
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Compare shut-off class, pressure envelope, throttling capability, and plant duty
              across our entire manufactured range.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Valves" },
              { id: "tight", label: "Class VI Tight Shutoff" },
              { id: "throttling", label: "Throttling / Regulating" },
              { id: "sanitary", label: "Hygienic / CIP Ready" },
              { id: "high-pressure", label: "High Pressure / Steam" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterDuty(f.id)}
                className={`rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterDuty === f.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="surface-panel mt-8 overflow-x-auto rounded-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/50 font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Valve Type</th>
                <th className="p-4">Shut-Off Class</th>
                <th className="p-4">Pressure Rating</th>
                <th className="p-4">Temp Envelope</th>
                <th className="p-4">Throttling</th>
                <th className="p-4">$\Delta P$ Drop</th>
                <th className="p-4">CIP / Sanitary</th>
                <th className="p-4">Cost Index</th>
                <th className="p-4">Primary Application</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.slug} className="transition-colors hover:bg-secondary/30">
                  <td className="p-4 font-display font-semibold uppercase text-foreground">
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.slug }}
                      className="hover:text-accent hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="p-4 font-mono font-medium">{item.shutoffClass}</td>
                  <td className="p-4">{item.maxPressure}</td>
                  <td className="p-4 font-mono text-[11px]">{item.tempRange}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.throttling === "Excellent"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : item.throttling === "Good"
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            : item.throttling === "Fair"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {item.throttling}
                    </span>
                  </td>
                  <td className="p-4">{item.pressureDrop}</td>
                  <td className="p-4">
                    {item.cipSanitary ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-accent">{item.costIndex}</td>
                  <td className="p-4 max-w-xs text-muted-foreground">{item.idealApplication}</td>
                  <td className="p-4 text-right">
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                      <Link to="/products/$slug" params={{ slug: item.slug }}>
                        Specs <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
