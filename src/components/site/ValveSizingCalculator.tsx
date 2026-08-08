import { useState, useMemo } from "react";
import { Calculator, CheckCircle2, Copy, FileSpreadsheet, Layers, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY, whatsappLink } from "@/data/site";

const PIPE_SIZES = [
  { dn: 15, inch: '1/2"', internalMm: 15.8, baseCv: 18, baseTorqueNm: 12 },
  { dn: 20, inch: '3/4"', internalMm: 20.9, baseCv: 32, baseTorqueNm: 16 },
  { dn: 25, inch: '1"', internalMm: 26.6, baseCv: 55, baseTorqueNm: 22 },
  { dn: 40, inch: '1.5"', internalMm: 40.9, baseCv: 125, baseTorqueNm: 38 },
  { dn: 50, inch: '2"', internalMm: 52.5, baseCv: 210, baseTorqueNm: 55 },
  { dn: 65, inch: '2.5"', internalMm: 62.7, baseCv: 340, baseTorqueNm: 80 },
  { dn: 80, inch: '3"', internalMm: 77.9, baseCv: 520, baseTorqueNm: 120 },
  { dn: 100, inch: '4"', internalMm: 102.3, baseCv: 920, baseTorqueNm: 190 },
  { dn: 150, inch: '6"', internalMm: 154.1, baseCv: 2200, baseTorqueNm: 360 },
  { dn: 200, inch: '8"', internalMm: 202.7, baseCv: 4100, baseTorqueNm: 680 },
  { dn: 250, inch: '10"', internalMm: 254.5, baseCv: 6800, baseTorqueNm: 1100 },
  { dn: 300, inch: '12"', internalMm: 304.8, baseCv: 10200, baseTorqueNm: 1800 },
];

export function ValveSizingCalculator() {
  const [fluidType, setFluidType] = useState<"liquid" | "steam" | "gas">("liquid");
  const [selectedDn, setSelectedDn] = useState<number>(50);
  const [flowRate, setFlowRate] = useState<number>(25); // m3/h for liquid, kg/h for steam, Nm3/h for gas
  const [p1Bar, setP1Bar] = useState<number>(6.0); // Upstream pressure
  const [p2Bar, setP2Bar] = useState<number>(5.2); // Downstream pressure
  const [specificGravity, setSpecificGravity] = useState<number>(1.0); // 1.0 for water
  const [tempC, setTempC] = useState<number>(25);

  const deltaP = Math.max(0.01, Math.round((p1Bar - p2Bar) * 100) / 100);

  const calculations = useMemo(() => {
    let reqCv = 0;
    let velocityMS = 0;

    const pipeInfo = PIPE_SIZES.find((p) => p.dn === selectedDn) ?? PIPE_SIZES[4];
    const areaM2 = (Math.PI * Math.pow(pipeInfo.internalMm / 1000, 2)) / 4;

    if (fluidType === "liquid") {
      // Cv = Q * sqrt(SG / deltaP) where Q is in US GPM and deltaP in psi
      // Q (GPM) = m3/h * 4.40287
      // deltaP (psi) = bar * 14.5038
      const qGpm = flowRate * 4.40287;
      const dpPsi = deltaP * 14.5038;
      reqCv = qGpm * Math.sqrt(specificGravity / dpPsi);

      // velocity v = Q(m3/s) / A(m2)
      velocityMS = flowRate / 3600 / areaM2;
    } else if (fluidType === "steam") {
      // Saturated steam approximation: Cv = W / (2.1 * sqrt(deltaP * (P1 + P2)))
      // where W is in lb/h, P is in psia
      const wLbH = flowRate * 2.20462;
      const p1Psia = p1Bar * 14.5038 + 14.7;
      const p2Psia = p2Bar * 14.5038 + 14.7;
      const dpPsi = deltaP * 14.5038;
      reqCv = wLbH / (2.1 * Math.sqrt(dpPsi * (p1Psia + p2Psia)));
      // Approx steam specific volume at P1
      const specVol = 1.67 / Math.pow(p1Bar, 0.94);
      velocityMS = (flowRate * specVol) / 3600 / areaM2;
    } else {
      // Gas approximation
      // Cv = Q_scfh * sqrt(G * (T_degR)) / (963 * sqrt(deltaP * P2_psia))
      const qScfh = flowRate * 35.3147;
      const p2Psia = p2Bar * 14.5038 + 14.7;
      const dpPsi = deltaP * 14.5038;
      const tRankine = ((tempC * 9) / 5 + 32) + 459.67;
      reqCv = (qScfh * Math.sqrt(specificGravity * tRankine)) / (963 * Math.sqrt(dpPsi * p2Psia));
      velocityMS = (flowRate * (1.013 / p1Bar)) / 3600 / areaM2;
    }

    reqCv = Math.max(0.1, Math.round(reqCv * 10) / 10);
    const reqKv = Math.round(reqCv * 0.865 * 10) / 10;
    const vRounded = Math.round(velocityMS * 100) / 100;

    // Estimate actuator torque based on pressure differential and nominal size
    // Torque = baseTorque * (1 + deltaP/16) * safetyFactor (1.3)
    const torqueNm = Math.round(pipeInfo.baseTorqueNm * (1 + deltaP / 16) * 1.3);

    // Recommend nominal valve size
    const recommendedPipe =
      PIPE_SIZES.find((p) => p.baseCv >= reqCv * 1.25) ?? PIPE_SIZES[PIPE_SIZES.length - 1];

    let velocityStatus = "Optimal Line Velocity (< 3.0 m/s)";
    let velocityColor = "text-emerald-500";
    if (vRounded > 5.0) {
      velocityStatus = "Critical High Velocity (> 5 m/s: Risk of Cavitation & Erosion)";
      velocityColor = "text-destructive";
    } else if (vRounded > 3.0) {
      velocityStatus = "Elevated Velocity (3 - 5 m/s: Acceptable for short runs)";
      velocityColor = "text-amber-500";
    }

    return {
      reqCv,
      reqKv,
      velocityMS: vRounded,
      torqueNm,
      recommendedSize: recommendedPipe.inch,
      recommendedDn: recommendedPipe.dn,
      pipeBoreMm: pipeInfo.internalMm,
      velocityStatus,
      velocityColor,
    };
  }, [fluidType, selectedDn, flowRate, p1Bar, p2Bar, deltaP, specificGravity, tempC]);

  const copySizingSummary = () => {
    const summary = [
      `Khodiyar Engineering — Valve Sizing Calculation Report`,
      `Fluid Type: ${fluidType.toUpperCase()}`,
      `Line Nominal Size: DN${selectedDn} (${PIPE_SIZES.find((p) => p.dn === selectedDn)?.inch})`,
      `Design Flow Rate: ${flowRate} ${fluidType === "liquid" ? "m³/h" : fluidType === "steam" ? "kg/h" : "Nm³/h"}`,
      `Inlet Pressure (P1): ${p1Bar} bar`,
      `Outlet Pressure (P2): ${p2Bar} bar (Delta P: ${deltaP} bar)`,
      `Operating Temperature: ${tempC} °C`,
      `---------------------------------------`,
      `Calculated Required Cv: ${calculations.reqCv} GPM/psi½`,
      `Calculated Required Kv: ${calculations.reqKv} m³/h/bar½`,
      `Pipe Fluid Velocity: ${calculations.velocityMS} m/s`,
      `Recommended Valve Size: DN${calculations.recommendedDn} (${calculations.recommendedSize})`,
      `Estimated Breakaway Actuator Torque: ${calculations.torqueNm} Nm (with 30% Safety Margin)`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
    toast.success("Sizing calculation copied to clipboard.");
  };

  const sendSizingToWhatsApp = () => {
    const text = [
      `Hello Khodiyar Engineering, please review this valve sizing requirement:`,
      `• Fluid: ${fluidType.toUpperCase()}`,
      `• Line Size: DN${selectedDn}`,
      `• Flow: ${flowRate} ${fluidType === "liquid" ? "m³/h" : fluidType === "steam" ? "kg/h" : "Nm³/h"}`,
      `• P1: ${p1Bar} bar, P2: ${p2Bar} bar (ΔP: ${deltaP} bar)`,
      `• Req Cv: ${calculations.reqCv} | Req Kv: ${calculations.reqKv}`,
      `• Recommended Size: DN${calculations.recommendedDn} (${calculations.recommendedSize})`,
      `• Estimated Actuator Torque: ${calculations.torqueNm} Nm`,
      `Please provide a formal quotation for suitable valves.`,
    ].join("\n");

    window.open(whatsappLink(text), "_blank", "noopener");
  };

  return (
    <section className="bg-surface py-20 sm:py-24" id="sizing-calculator">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow justify-center">
            <Calculator className="h-3.5 w-3.5 text-accent" />
            Engineering Calculation Desk
          </div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Industrial Valve Sizing &amp; $C_v / K_v$ Calculator
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Accurately size industrial valves against standard flow coefficients, velocity limits,
            and pressure drop before ordering. Sized according to ISA-75 / IEC 60534 standards.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Input Parameters Form */}
          <div className="surface-panel rounded-sm p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold uppercase tracking-wide">
              Process &amp; Line Parameters
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Fluid Phase */}
              <div>
                <Label htmlFor="fluidType">Fluid Phase</Label>
                <Select
                  value={fluidType}
                  onValueChange={(v) => setFluidType(v as "liquid" | "steam" | "gas")}
                >
                  <SelectTrigger id="fluidType" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liquid">Liquid (Water / Acids / Chemicals)</SelectItem>
                    <SelectItem value="steam">Saturated Steam</SelectItem>
                    <SelectItem value="gas">Compressed Gas / Air</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pipe Bore Size */}
              <div>
                <Label htmlFor="pipeSize">Pipeline Nominal Diameter</Label>
                <Select
                  value={String(selectedDn)}
                  onValueChange={(v) => setSelectedDn(Number(v))}
                >
                  <SelectTrigger id="pipeSize" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PIPE_SIZES.map((p) => (
                      <SelectItem key={p.dn} value={String(p.dn)}>
                        DN{p.dn} ({p.inch}) — {p.internalMm} mm ID
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flow Rate */}
              <div>
                <Label htmlFor="flowRate">
                  Flow Rate ({fluidType === "liquid" ? "m³/hr" : fluidType === "steam" ? "kg/hr" : "Nm³/hr"})
                </Label>
                <Input
                  id="flowRate"
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Math.max(0.1, Number(e.target.value)))}
                  className="mt-1.5 font-mono"
                />
              </div>

              {/* Specific Gravity */}
              <div>
                <Label htmlFor="sg">
                  {fluidType === "liquid"
                    ? "Specific Gravity (Water = 1.0)"
                    : "Gas Molecular Weight / Density"}
                </Label>
                <Input
                  id="sg"
                  type="number"
                  min="0.1"
                  step="0.05"
                  value={specificGravity}
                  onChange={(e) => setSpecificGravity(Math.max(0.1, Number(e.target.value)))}
                  className="mt-1.5 font-mono"
                />
              </div>

              {/* Inlet Pressure */}
              <div>
                <Label htmlFor="p1">Inlet Pressure $P_1$ (bar g)</Label>
                <Input
                  id="p1"
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={p1Bar}
                  onChange={(e) => setP1Bar(Math.max(0.5, Number(e.target.value)))}
                  className="mt-1.5 font-mono"
                />
              </div>

              {/* Outlet Pressure */}
              <div>
                <Label htmlFor="p2">Outlet Pressure $P_2$ (bar g)</Label>
                <Input
                  id="p2"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={p2Bar}
                  onChange={(e) => setP2Bar(Math.max(0.1, Number(e.target.value)))}
                  className="mt-1.5 font-mono"
                />
              </div>

              {/* Operating Temp */}
              <div className="sm:col-span-2">
                <Label htmlFor="temp">Design Temperature (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="mt-1.5 font-mono"
                />
              </div>
            </div>

            {/* Delta P Display Bar */}
            <div className="mt-6 flex items-center justify-between rounded-sm border border-border/80 bg-background px-4 py-3 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">
                Calculated Differential ($\Delta P = P_1 - P_2$):
              </span>
              <span className="font-mono text-sm font-bold text-accent">{deltaP} bar ({Math.round(deltaP * 14.5038 * 10) / 10} psi)</span>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="space-y-6">
            <div className="rounded-sm bg-navy-gradient p-6 text-navy-foreground sm:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                Calculation Output
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide">
                Recommended Valve Size: DN{calculations.recommendedDn} ({calculations.recommendedSize})
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Required $C_v$</div>
                  <div className="font-mono text-2xl font-bold text-accent">
                    {calculations.reqCv}{" "}
                    <span className="text-xs font-normal opacity-70">GPM/psi½</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Metric $K_v$</div>
                  <div className="font-mono text-2xl font-bold text-navy-foreground">
                    {calculations.reqKv}{" "}
                    <span className="text-xs font-normal opacity-70">m³/h/bar½</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Line Velocity</div>
                  <div className="font-mono text-xl font-bold text-navy-foreground">
                    {calculations.velocityMS}{" "}
                    <span className="text-xs font-normal opacity-70">m/s</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Actuator Torque</div>
                  <div className="font-mono text-xl font-bold text-accent">
                    {calculations.torqueNm}{" "}
                    <span className="text-xs font-normal opacity-70">Nm (+30% SF)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4 text-xs">
                <span className="opacity-80">Flow Status: </span>
                <span className={`font-semibold ${calculations.velocityColor}`}>
                  {calculations.velocityStatus}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="surface-panel flex flex-wrap items-center justify-between gap-3 rounded-sm p-4">
              <Button variant="outline" size="sm" onClick={copySizingSummary}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Report
              </Button>
              <Button size="sm" onClick={sendSizingToWhatsApp}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> Send to Engineers via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
