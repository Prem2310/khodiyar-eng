import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  Info,
  Maximize2,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type ValveKind = "ball" | "butterfly" |  "y-type-strainer" | "t-type-strainer" | "gate" | "globe" | "check" | "plug" ;

interface MediaOption {
  id: string;
  name: string;
  density: number; // kg/m3
  viscosity: number; // cP
  color: string;
  particleColor: string;
  description: string;
  icon: typeof Droplets;
}

const MEDIA_TYPES: MediaOption[] = [
  {
    id: "water",
    name: "Industrial Water (20°C)",
    density: 1000,
    viscosity: 1.0,
    color: "#38bdf8",
    particleColor: "#7dd3fc",
    description: "Standard industrial cooling, utility & process water.",
    icon: Droplets,
  },
  {
    id: "steam",
    name: "Saturated Steam (180°C / 10 bar)",
    density: 5.1,
    viscosity: 0.015,
    color: "#e2e8f0",
    particleColor: "#f8fafc",
    description: "Boiler steam headers & thermal jacket systems.",
    icon: Flame,
  },
  {
    id: "hydrocarbon",
    name: "Process Oil / Hydrocarbons",
    density: 850,
    viscosity: 32.0,
    color: "#fbbf24",
    particleColor: "#fde68a",
    description: "Mineral oils, diesel & hydrocarbon transfer lines.",
    icon: Zap,
  },
  {
    id: "acid",
    name: "Chemical Acids (98% H₂SO₄)",
    density: 1840,
    viscosity: 25.0,
    color: "#a855f7",
    particleColor: "#c084fc",
    description: "Aggressive acids requiring SS316 or PTFE lining.",
    icon: Activity,
  },
  {
    id: "dairy",
    name: "Sanitary Milk & CIP Fluid (4°C)",
    density: 1030,
    viscosity: 2.1,
    color: "#ffffff",
    particleColor: "#f1f5f9",
    description: "Food-grade hygienic fluid requiring Ra < 0.8µm finish.",
    icon: Sparkles,
  },
];

const VALVE_SCHEMATICS: Record<
  ValveKind,
  {
    name: string;
    title: string;
    description: string;
    maxCv: number;
    inherentCharacteristic: "Equal Percentage" | "Linear" | "Quick Opening";
    leakageClass: string;
    bestFor: string;
    hotspots: { name: string; x: number; y: number; info: string }[];
  }
> = {
  ball: {
    name: "Ball Valve",
    title: "Quarter-Turn Full-Bore Ball Valve",
    description:
      "Precision spherical ball with cylindrical port aligned to line bore. Offers bubble-tight Class VI shut-off and minimal pressure drop.",
    maxCv: 120,
    inherentCharacteristic: "Equal Percentage",
    leakageClass: "ANSI Class VI (Zero Leakage)",
    bestFor: "Chemical, Hydrocarbons, Water Isolation & Tight Shutoff",
    hotspots: [
      { name: "Stem & Gland Packing", x: 200, y: 70, info: "Live-loaded PTFE/Graphite packing rings preventing fugitive emissions." },
      { name: "SS316 Mirror Ball", x: 200, y: 150, info: "Precision machined and diamond polished sphere for minimal operating torque." },
      { name: "RPTFE Resilient Seat", x: 170, y: 150, info: "Pre-stressed seat rings providing bubble-tight seal even at low differential pressure." },
      { name: "Body Flange ASME B16.5", x: 80, y: 150, info: "Raised face flange standard for bolt alignment and gasket seating." },
    ],
  },
  butterfly: {
    name: "Butterfly Valve",
    title: "Concentric Resilient-Seated Butterfly Valve",
    description:
      "Compact disc rotating on a transverse axis. Lightweight, space-saving design ideal for large diameter water and HVAC isolation.",
    maxCv: 95,
    inherentCharacteristic: "Equal Percentage",
    leakageClass: "ANSI Class VI / Class A (EN 12266-1)",
    bestFor: "Water Treatment, Dairy Lines, Fire Fighting & Bulk Isolation",
    hotspots: [
      { name: "Disc Edge", x: 200, y: 150, info: "Streamlined SS316 disc profiled to minimize head loss and turbulence." },
      { name: "Replaceable EPDM/PTFE Liner", x: 200, y: 110, info: "Full body lining that isolates the body casting from the process fluid." },
      { name: "Upper Stem Bushing", x: 200, y: 60, info: "PTFE coated bearings ensuring low torque across thousands of cycles." },
      { name: "Wafer / Lug Flange Face", x: 120, y: 150, info: "Fits between ANSI 150 / PN16 line flanges with standard stud bolts." },
    ],
  },
    "y-type-strainer": {
    name: "Y-Type Strainer",
    title: "Y-Type Inline Strainer",
    description:
      "Compact inline strainer with removable mesh basket. Protects downstream valves and equipment from debris and particulate contamination.",
    maxCv: 90,
    inherentCharacteristic: "Quick Opening",
    leakageClass: "ANSI Class IV",
    bestFor: "Pipelines, Pumps, and Equipment Protection",
    hotspots: [
      { name: "Mesh Basket", x: 200, y: 150, info: "Removable stainless steel mesh basket for filtering debris." },
      { name: "Body & Cover", x: 200, y: 100, info: "Durable body with bolted cover for easy maintenance." },
      { name: "Drain Plug", x: 200, y: 180, info: "Drain plug for easy cleaning and flushing of collected debris." },
    ],
  },
  "t-type-strainer": {
    name: "T-Type Strainer",
    title: "T-Type Inline Strainer",
    description:
      "Inline strainer with T-shaped body and removable mesh element. Ideal for high-flow applications requiring effective debris filtration.",
    maxCv: 95,
    inherentCharacteristic: "Quick Opening",
    leakageClass: "ANSI Class IV",
    bestFor: "High-Flow Pipelines, Pumps, and Equipment Protection",
    hotspots: [
      { name: "Mesh Element", x: 200, y: 150, info: "Removable stainless steel mesh element for filtering debris." },
      { name: "Body & Cover", x: 200, y: 100, info: "Robust T-shaped body with bolted cover for easy maintenance." },
      { name: "Drain Plug", x: 200, y: 180, info: "Drain plug for easy cleaning and flushing of collected debris." },
    ],
  },
  gate: {
    name: "Gate Valve",
    title: "Solid Wedge Rising Stem Gate Valve",
    description:
      "Straight-through full bore with wedge gate moving perpendicular to flow. Minimizes friction loss in fully open position.",
    maxCv: 140,
    inherentCharacteristic: "Quick Opening",
    leakageClass: "API 598 / ANSI Class IV",
    bestFor: "Main Line Steam, Water Pipelines, Oil Terminals & On/Off Duty",
    hotspots: [
      { name: "Rising Stem Thread", x: 200, y: 40, info: "External trapezoidal ACME thread indicates visual valve position." },
      { name: "Solid Wedge Gate", x: 200, y: 140, info: "Precision ground wedge guided in body ribs to eliminate chattering." },
      { name: "Hard-Faced Stellite Seat", x: 180, y: 165, info: "Weld-deposited wear resistant seat for high temperature steam." },
      { name: "Full Flow Passage", x: 100, y: 150, info: "Zero obstruction when fully open, allowing pipeline pigging." },
    ],
  },
  globe: {
    name: "Globe Valve",
    title: "Z-Body Regulating & Throttling Globe Valve",
    description:
      "S-shaped internal path with plug moving parallel to flow direction. Unmatched precision for continuous flow throttling and steam pressure reduction.",
    maxCv: 60,
    inherentCharacteristic: "Linear",
    leakageClass: "ANSI Class IV / Class V",
    bestFor: "Steam Throttling, Thermal Oil Regulation & Pressure Letdown",
    hotspots: [
      { name: "Contoured Regulating Plug", x: 200, y: 140, info: "Parabolic plug trim tailored for repeatable throttling and linear Cv curve." },
      { name: "Threaded Seat Ring", x: 200, y: 165, info: "Replaceable stainless seat ring allowing in-line maintenance." },
      { name: "Bonnet & Packing Chamber", x: 200, y: 70, info: "Deep gland chamber designed for high thermal expansion cycles." },
      { name: "Curved Z-Body Chamber", x: 140, y: 150, info: "Controlled flow path maximizes regulation stability across pressure drops." },
    ],
  },
  check: {
    name: "Check Valve / NRV",
    title: "Self-Actuating Swing Non-Return Valve",
    description:
      "Automatic reverse flow prevention mechanism using differential pressure and gravity disc. Protects pumps and compressors from backpressure shocks.",
    maxCv: 85,
    inherentCharacteristic: "Quick Opening",
    leakageClass: "API 598 Metal-to-Metal",
    bestFor: "Pump Discharge Lines, Compressed Air, Water Supply & Backflow Protection",
    hotspots: [
      { name: "Hinge Pin & Disc Arm", x: 170, y: 100, info: "High-tensile SS316 hinge pin with stainless cotter pin retention." },
      { name: "Swing Disc", x: 200, y: 130, info: "Balanced disc swings clear of flow stream under minimal forward differential." },
      { name: "Machined Body Seat", x: 170, y: 150, info: "Precision angled seat prevents disc sticking and ensures rapid closure." },
      { name: "Top Inspection Cover", x: 200, y: 60, info: "Removable bolted cover allows seat and disc inspection without line removal." },
    ],
  },
  plug: {
    name: "Plug Valve",
    title: "PTFE Sleeved Quarter-Turn Plug Valve",
    description:
      "Tapered or cylindrical plug rotating inside a fluoropolymer sleeve. Non-cavity body prevents crystallization and slurry solids accumulation.",
    maxCv: 105,
    inherentCharacteristic: "Equal Percentage",
    leakageClass: "ANSI Class VI (Zero Leakage)",
    bestFor: "Chemical Slurries, Viscous Resins, Sludge Lines & Bleaching Media",
    hotspots: [
      { name: "Tapered Plug Core", x: 200, y: 150, info: "360° contact plug supported by full circumference PTFE sleeve." },
      { name: "Full-Body PTFE Sleeve", x: 180, y: 140, info: "Self-lubricating sleeve eliminates body cavities where solids can settle." },
      { name: "Top Seal & Adjusting Screws", x: 200, y: 65, info: "Independent stem seal and plug adjustment for in-line wear compensation." },
      { name: "Straight Rectangular Port", x: 120, y: 150, info: "Streamlined port minimizes erosion from abrasive slurries." },
    ],
  },
};

export function ValveFlowSimulator() {
  const [valveType, setValveType] = useState<ValveKind>("ball");
  const [mediaId, setMediaId] = useState<string>("water");
  const [openPercent, setOpenPercent] = useState<number>(75);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const selectedMedia = useMemo(
    () => MEDIA_TYPES.find((m) => m.id === mediaId) ?? MEDIA_TYPES[0],
    [mediaId],
  );

  const valveInfo = VALVE_SCHEMATICS[valveType];

  // Engineering calculations
  const normalizedOpen = openPercent / 100;
  const effectiveCv = useMemo(() => {
    if (openPercent === 0) return 0;
    if (valveInfo.inherentCharacteristic === "Equal Percentage") {
      // Cv = R^(x-1) * Cv_max
      const R = 50;
      return Math.round(valveInfo.maxCv * Math.pow(R, normalizedOpen - 1) * 10) / 10;
    } else if (valveInfo.inherentCharacteristic === "Linear") {
      return Math.round(valveInfo.maxCv * normalizedOpen * 10) / 10;
    } else {
      // Quick opening
      return Math.round(valveInfo.maxCv * Math.sqrt(normalizedOpen) * 10) / 10;
    }
  }, [openPercent, valveInfo, normalizedOpen]);

  const flowRateM3H = useMemo(() => {
    if (openPercent === 0) return 0;
    // Q = 0.865 * Cv * sqrt(deltaP / G)
    const deltaPBar = 2.5; // baseline nominal pressure drop
    const specificGravity = selectedMedia.density / 1000;
    return Math.round(0.865 * effectiveCv * Math.sqrt(deltaPBar / specificGravity) * 10) / 10;
  }, [effectiveCv, selectedMedia, openPercent]);

  const fluidVelocity = useMemo(() => {
    if (openPercent === 0) return 0;
    // Assume DN50 (50mm pipe ID, area = 0.00196 m2)
    const areaM2 = (Math.PI * Math.pow(0.05, 2)) / 4;
    const qM3S = flowRateM3H / 3600;
    return Math.round((qM3S / areaM2) * 10) / 10;
  }, [flowRateM3H, openPercent]);

  const pressureDropBar = useMemo(() => {
    if (openPercent === 0) return 6.0; // full shutoff differential
    if (effectiveCv === 0) return 6.0;
    const specificGravity = selectedMedia.density / 1000;
    // DeltaP = G * (Q / (0.865 * Cv))^2
    const dp = specificGravity * Math.pow(flowRateM3H / (0.865 * effectiveCv), 2);
    return Math.min(6.0, Math.max(0.05, Math.round(dp * 100) / 100));
  }, [effectiveCv, flowRateM3H, selectedMedia, openPercent]);

  const reynoldsNumber = useMemo(() => {
    if (fluidVelocity === 0) return 0;
    // Re = rho * v * D / mu
    const dM = 0.05;
    const muPaS = selectedMedia.viscosity * 0.001;
    return Math.round((selectedMedia.density * fluidVelocity * dM) / muPaS);
  }, [fluidVelocity, selectedMedia]);

  const flowRegime = useMemo(() => {
    if (openPercent === 0) return { label: "No Flow (Isolated)", color: "text-muted-foreground" };
    if (reynoldsNumber < 2300) return { label: "Laminar Flow (Smooth)", color: "text-emerald-500" };
    if (reynoldsNumber < 4000) return { label: "Transitional Flow", color: "text-amber-500" };
    return { label: "Turbulent Flow (High Energy)", color: "text-accent" };
  }, [reynoldsNumber, openPercent]);

  // Particle speed based on velocity
  const particleSpeed = openPercent > 0 ? Math.max(0.4, 2.8 - (openPercent / 100) * 1.8) : 0;

  const isStrainer = valveType === "y-type-strainer" || valveType === "t-type-strainer";
  const strainerOpenFactor = isStrainer ? Math.max(0.4, normalizedOpen) : 1;
  const strainerMeshOpacity = isStrainer ? 0.35 + strainerOpenFactor * 0.55 : 1;
  const strainerMeshScale = isStrainer ? 0.72 + strainerOpenFactor * 0.28 : 1;
  const throatWidth = isStrainer ? Math.max(54, 80 * (0.7 + strainerOpenFactor * 0.18)) : 80;
  const throatX = isStrainer ? 160 + (80 - throatWidth) / 2 : 160;
  const controlLabel = isStrainer
    ? "Flow Restriction / Screen Clearance"
    : "Valve Position / Trim Open Percentage";
  const minLabel = isStrainer ? "0% (Blocked / Cleanout)" : "0% (Full Isolation)";
  const midLabel = isStrainer ? "50% (Partial Restriction)" : "50% (Throttling)";
  const maxLabel = isStrainer ? "100% (Clear Passage)" : "100% (Full Bore Flow)";

  return (
    <section className="relative overflow-hidden py-24 sm:py-28" id="simulator">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow justify-center">
            <Activity className="h-3.5 w-3.5 text-accent animate-pulse" />
            Engineering Simulation Suite
          </div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Interactive Valve Cutaway &amp; Flow Simulator
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Simulate real-time fluid dynamics, pressure drop ($\Delta P$), and flow velocity through
            Khodiyar industrial valves. Select media, rotate the positioner, and inspect cutaway
            components.
          </p>
        </div>

        {/* Valve Type Switcher */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {(Object.keys(VALVE_SCHEMATICS) as ValveKind[]).map((key) => {
            const v = VALVE_SCHEMATICS[key];
            const isSel = valveType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setValveType(key);
                  setActiveHotspot(null);
                }}
                className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isSel
                    ? "bg-navy-gradient text-navy-foreground shadow-md ring-2 ring-accent"
                    : "surface-panel text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.name}
              </button>
            );
          })}
        </div>

        {/* Simulator Core Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main Visualizer Stage */}
          <div className="surface-panel relative overflow-hidden rounded-sm p-6 sm:p-8">
            {/* Header with Title & Media Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                  Schematic View · DN50 (2 Inch) Line
                </span>
                <h3 className="text-xl font-bold uppercase tracking-wide">{valveInfo.title}</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedMedia.color }}
                />
                <span className="font-medium">{selectedMedia.name}</span>
              </div>
            </div>

            {/* Interactive SVG Stage */}
            <div className="relative my-6 flex min-h-[320px] items-center justify-center overflow-hidden rounded-md bg-navy/90 p-4">
              <svg
                viewBox="0 0 400 240"
                className="h-full w-full max-w-[540px] select-none"
                style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))" }}
              >
                <defs>
                  <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={selectedMedia.color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={selectedMedia.color} stopOpacity="0.95" />
                  </linearGradient>
                  <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path
                      d="M 16 0 L 0 0 0 16"
                      fill="none"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                {/* Blueprint Background Grid */}
                <rect width="400" height="240" fill="url(#grid)" />

                {/* Upstream & Downstream Pipes */}
                <rect x="20" y="110" width="140" height="80" fill="url(#pipeGrad)" rx="2" />
                <rect x="240" y="110" width="140" height="80" fill="url(#pipeGrad)" rx="2" />
                <rect x="20" y="125" width="140" height="50" fill="#0f172a" />
                <rect x="240" y="125" width="140" height="50" fill="#0f172a" />

                {/* Upstream Flange */}
                <rect x="60" y="95" width="22" height="110" fill="#64748b" rx="2" />
                <circle cx="71" cy="110" r="3.5" fill="#1e293b" />
                <circle cx="71" cy="190" r="3.5" fill="#1e293b" />

                {/* Downstream Flange */}
                <rect x="318" y="95" width="22" height="110" fill="#64748b" rx="2" />
                <circle cx="329" cy="110" r="3.5" fill="#1e293b" />
                <circle cx="329" cy="190" r="3.5" fill="#1e293b" />

                {/* Valve Body Chamber */}
                <path
                  d="M 160 110 C 160 80, 240 80, 240 110 L 250 190 C 250 215, 150 215, 150 190 Z"
                  fill="#475569"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <circle cx="200" cy="150" r="42" fill="#0f172a" />

                {/* Fluid Flow Representation */}
                {openPercent > 0 && (
                  <g>
                    {/* Upstream Fluid Block */}
                    <rect
                      x="20"
                      y="125"
                      width="140"
                      height="50"
                      fill="url(#fluidGrad)"
                      opacity="0.8"
                    />

                    {/* Throttle Throat Flow */}
                    <rect
                      x={throatX}
                      y={150 - (25 * openPercent) / 100}
                      width={throatWidth}
                      height={Math.max(10, (50 * openPercent) / 100)}
                      fill="url(#fluidGrad)"
                      opacity={isStrainer ? 0.75 : 0.9}
                    />

                    {/* Downstream Fluid Block */}
                    <rect
                      x="240"
                      y="125"
                      width="140"
                      height="50"
                      fill="url(#fluidGrad)"
                      opacity={0.3 + (openPercent / 100) * 0.55}
                    />

                    {/* Animated Streamline Particles */}
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <circle
                        key={idx}
                        cy={130 + idx * 7}
                        r={openPercent > 40 ? 2.5 : 1.8}
                        fill={selectedMedia.particleColor}
                      >
                        <animate
                          attributeName="cx"
                          from="25"
                          to="375"
                          dur={`${particleSpeed}s`}
                          begin={`${idx * 0.25}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          dur={`${particleSpeed}s`}
                          begin={`${idx * 0.25}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    ))}
                  </g>
                )}

                {/* Valve Trim Specific Rendering based on Open Percentage */}
                {valveType === "ball" && (
                  <g>
                    {/* Ball Sphere rotating */}
                    <circle
                      cx="200"
                      cy="150"
                      r="34"
                      fill="#94a3b8"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    <rect
                      x="180"
                      y="132"
                      width="40"
                      height="36"
                      rx="3"
                      fill="#0f172a"
                      transform={`rotate(${(1 - normalizedOpen) * 90} 200 150)`}
                    />
                  </g>
                )}

                {valveType === "butterfly" && (
                  <g>
                    {/* Butterfly Disc rotating on axis */}
                    <line x1="200" y1="110" x2="200" y2="190" stroke="#38bdf8" strokeWidth="4" />
                    <ellipse
                      cx="200"
                      cy="150"
                      rx={Math.max(4, 32 * (1 - normalizedOpen))}
                      ry="34"
                      fill="#94a3b8"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {valveType === "gate" && (
                  <g>
                    {/* Gate Wedge sliding up/down */}
                    <rect
                      x="188"
                      y={118 - normalizedOpen * 50}
                      width="24"
                      height="64"
                      fill="#94a3b8"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                      rx="2"
                    />
                  </g>
                )}

                {valveType === "globe" && (
                  <g>
                    {/* Globe Plug moving vertically */}
                    <path
                      d="M 180 180 L 220 180 L 210 168 L 190 168 Z"
                      fill="#64748b"
                      stroke="#cbd5e1"
                    />
                    <path
                      d={`M 186 ${160 - normalizedOpen * 25} L 214 ${160 - normalizedOpen * 25} L 206 ${170 - normalizedOpen * 25} L 194 ${170 - normalizedOpen * 25} Z`}
                      fill="#cbd5e1"
                      stroke="#f8fafc"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {valveType === "check" && (
                  <g>
                    {/* Swing check disc opening angle */}
                    <circle cx="175" cy="115" r="4" fill="#38bdf8" />
                    <line
                      x1="175"
                      y1="115"
                      x2={175 + Math.cos(((1 - normalizedOpen) * 60 * Math.PI) / 180) * 32}
                      y2={115 + Math.sin(((1 - normalizedOpen) * 60 * Math.PI) / 180) * 32}
                      stroke="#cbd5e1"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {valveType === "plug" && (
                  <g>
                    {/* Tapered plug core rotating */}
                    <path
                      d="M 185 120 L 215 120 L 210 180 L 190 180 Z"
                      fill="#94a3b8"
                      stroke="#f1f5f9"
                      strokeWidth="2"
                      transform={`rotate(${(1 - normalizedOpen) * 90} 200 150)`}
                    />
                  </g>
                )}

                {valveType === "y-type-strainer" && (
                  <g opacity={strainerMeshOpacity} transform={`translate(200 150) scale(${strainerMeshScale})`}>
                    {/* Y-Strainer Mesh Basket */}
                    <rect x="-14" y="-20" width="28" height="40" rx="3" fill="#94a3b8" stroke="#f1f5f9" strokeWidth="2" />
                    <line x1="-12" y1="-16" x2="12" y2="18" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="12" y1="-16" x2="-12" y2="18" stroke="#e2e8f0" strokeWidth="1.5" />
                    <rect x="-20" y="-8" width="40" height="10" rx="2" fill="#64748b" />
                  </g>
                )}

                {valveType === "t-type-strainer" && (
                  <g opacity={strainerMeshOpacity} transform={`translate(200 150) scale(${strainerMeshScale})`}>
                    {/* T-Strainer Mesh Element */}
                    <rect x="-16" y="-20" width="32" height="40" rx="3" fill="#94a3b8" stroke="#f1f5f9" strokeWidth="2" />
                    <line x1="-12" y1="-16" x2="12" y2="18" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="12" y1="-16" x2="-12" y2="18" stroke="#e2e8f0" strokeWidth="1.5" />
                    <rect x="-24" y="-8" width="48" height="10" rx="2" fill="#64748b" />
                  </g>
                )}


                {/* Bonnet & Stem */}
                <rect x="194" y="45" width="12" height="60" fill="#64748b" rx="2" />
                <rect x="180" y="28" width="40" height="18" fill="#475569" rx="3" />
                {/* Handwheel / Actuator Indicator */}
                <ellipse cx="200" cy="22" rx="36" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />

                {/* Interactive Hotspot Pins */}
                {valveInfo.hotspots.map((hs) => {
                  const isActive = activeHotspot === hs.name;
                  return (
                    <g
                      key={hs.name}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setActiveHotspot(isActive ? null : hs.name)}
                    >
                      <circle
                        cx={hs.x}
                        cy={hs.y}
                        r="6.5"
                        fill={isActive ? "#38bdf8" : "rgba(56, 189, 248, 0.4)"}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle cx={hs.x} cy={hs.y} r="2.5" fill="#0369a1" />
                    </g>
                  );
                })}
              </svg>

              {/* Hotspot Popover info */}
              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 rounded-md border border-accent/40 bg-navy/95 p-3.5 text-xs text-navy-foreground shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold uppercase text-accent">
                        {activeHotspot}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-navy-foreground/80">
                      {valveInfo.hotspots.find((h) => h.name === activeHotspot)?.info}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slider Controls */}
            <div className="mt-6 space-y-4 rounded-sm border border-border/80 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {controlLabel}
                </span>
                <span className="font-display text-2xl font-bold text-accent">{openPercent}%</span>
              </div>
              <Slider
                value={[openPercent]}
                onValueChange={(val) => setOpenPercent(val[0])}
                min={0}
                max={100}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground uppercase tracking-wider">
                <span className={openPercent === 0 ? "text-accent font-bold" : ""}>
                  {minLabel}
                </span>
                <span className={openPercent === 50 ? "text-accent font-bold" : ""}>
                  {midLabel}
                </span>
                <span className={openPercent === 100 ? "text-accent font-bold" : ""}>
                  {maxLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right Control & Diagnostics Sidebar */}
          <div className="space-y-5">
            {/* Fluid Media Selector */}
            <div className="surface-panel rounded-sm p-5">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide">
                Select Process Fluid Media
              </h4>
              <div className="mt-3 space-y-2">
                {MEDIA_TYPES.map((m) => {
                  const isSel = m.id === mediaId;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMediaId(m.id)}
                      className={`flex w-full items-center justify-between rounded-sm border p-2.5 text-left text-xs transition-colors ${
                        isSel
                          ? "border-accent bg-accent/10 font-semibold text-foreground"
                          : "border-border/60 hover:bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" style={{ color: m.color }} />
                        <span>{m.name}</span>
                      </div>
                      {isSel && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Calculated Diagnostics */}
            <div className="surface-panel rounded-sm p-5">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide">
                Real-Time Flow Diagnostics
              </h4>
              <dl className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Effective Flow Coeff ($C_v$):</dt>
                  <dd className="font-mono font-bold text-foreground">
                    {effectiveCv} GPM/psi½
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Volumetric Flow ($Q$):</dt>
                  <dd className="font-mono font-bold text-foreground">{flowRateM3H} m³/hr</dd>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Line Fluid Velocity ($v$):</dt>
                  <dd className="font-mono font-bold text-foreground">{fluidVelocity} m/s</dd>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Pressure Drop ($\Delta P$):</dt>
                  <dd className="font-mono font-bold text-foreground">
                    {pressureDropBar} bar
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">Reynolds Number ($Re$):</dt>
                  <dd className="font-mono font-bold text-foreground">{reynoldsNumber.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <dt className="text-muted-foreground">Flow Regime:</dt>
                  <dd className={`font-semibold ${flowRegime.color}`}>{flowRegime.label}</dd>
                </div>
              </dl>

              {/* Cavitation / High velocity warning if applicable */}
              {fluidVelocity > 5.0 && (
                <div className="mt-3.5 flex items-start gap-2 rounded-sm border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Velocity exceeds 5 m/s. Consider stepping up nominal bore size to avoid seat erosion.</span>
                </div>
              )}
            </div>

            {/* Quick Sizing summary badge */}
            <div className="rounded-sm bg-navy-gradient p-4 text-navy-foreground">
              <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                Factory Standard
              </div>
              <div className="mt-1 font-display text-base font-bold uppercase">
                {valveInfo.leakageClass}
              </div>
              <p className="mt-1 text-[11px] opacity-80">{valveInfo.bestFor}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
