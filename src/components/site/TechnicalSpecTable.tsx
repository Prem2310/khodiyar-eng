import { useState } from "react";
import { Layers, ShieldCheck, Download, FileSpreadsheet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product, whatsappLink } from "@/data/site";
import { useBom } from "./QuickQuoteDrawer";

const FLANGE_STANDARDS = [
  { size: '1/2" (DN15)', pcdMm: 60.3, odMm: 89, holes: 4, boltDia: "M12", f2fMm: 108 },
  { size: '3/4" (DN20)', pcdMm: 69.9, odMm: 98, holes: 4, boltDia: "M12", f2fMm: 117 },
  { size: '1" (DN25)', pcdMm: 79.4, odMm: 108, holes: 4, boltDia: "M12", f2fMm: 127 },
  { size: '1.5" (DN40)', pcdMm: 98.4, odMm: 127, holes: 4, boltDia: "M14", f2fMm: 165 },
  { size: '2" (DN50)', pcdMm: 120.7, odMm: 152, holes: 4, boltDia: "M16", f2fMm: 178 },
  { size: '2.5" (DN65)', pcdMm: 139.7, odMm: 178, holes: 4, boltDia: "M16", f2fMm: 190 },
  { size: '3" (DN80)', pcdMm: 152.4, odMm: 190, holes: 4, boltDia: "M16", f2fMm: 203 },
  { size: '4" (DN100)', pcdMm: 190.5, odMm: 229, holes: 8, boltDia: "M16", f2fMm: 229 },
  { size: '6" (DN150)', pcdMm: 241.3, odMm: 279, holes: 8, boltDia: "M20", f2fMm: 267 },
  { size: '8" (DN200)', pcdMm: 298.5, odMm: 343, holes: 8, boltDia: "M20", f2fMm: 292 },
  { size: '10" (DN250)', pcdMm: 362.0, odMm: 406, holes: 12, boltDia: "M22", f2fMm: 330 },
  { size: '12" (DN300)', pcdMm: 431.8, odMm: 483, holes: 12, boltDia: "M22", f2fMm: 356 },
];

const MOC_PARTS = [
  { part: "Body & Bonnet", ss316: "ASTM A351 Gr. CF8M", ss304: "ASTM A351 Gr. CF8", wcb: "ASTM A216 Gr. WCB", ci: "IS 210 Gr. FG 260" },
  { part: "Ball / Disc / Wedge", ss316: "ASTM A351 CF8M (Mirror Finish)", ss304: "ASTM A351 CF8", wcb: "SS304 / SS316", ci: "Cast Iron + SS Trim" },
  { part: "Stem / Shaft", ss316: "AISI SS316 / SS316L", ss304: "AISI SS304", wcb: "AISI 410 / SS304", ci: "AISI 410" },
  { part: "Seat Rings", ss316: "Virgin PTFE / RPTFE / PEEK", ss304: "Virgin PTFE / RPTFE", wcb: "PTFE / Stellite Faced", ci: "Nitrile / EPDM / Bronze" },
  { part: "Gland Packing", ss316: "Graphite / Pure PTFE Rings", ss304: "Pure PTFE Chevron", wcb: "Die-Formed Flexible Graphite", ci: "PTFE Impregnated" },
  { part: "Fasteners & Studs", ss316: "ASTM A193 Gr. B8M / B8MA", ss304: "ASTM A193 Gr. B8", wcb: "ASTM A193 Gr. B7", ci: "High Tensile Carbon Steel" },
];

export function TechnicalSpecTable({ product }: { product: Product }) {
  const [tab, setTab] = useState<"flange" | "moc" | "testing">("flange");
  const { addItem } = useBom();

  return (
    <div className="mt-12 rounded-sm border border-border bg-card shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-secondary/50">
        <button
          type="button"
          onClick={() => setTab("flange")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === "flange"
              ? "bg-card border-b-2 border-accent text-accent font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Flange Dimensions (ASME B16.5)
        </button>
        <button
          type="button"
          onClick={() => setTab("moc")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === "moc"
              ? "bg-card border-b-2 border-accent text-accent font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Material of Construction (MOC)
        </button>
        <button
          type="button"
          onClick={() => setTab("testing")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === "testing"
              ? "bg-card border-b-2 border-accent text-accent font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Testing &amp; Inspection Standards
        </button>
      </div>

      {/* Tab 1: Flange Dimensions */}
      {tab === "flange" && (
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Standard Flange Drilling: ASME B16.5 Class 150 Raised Face (RF) &amp; DIN PN16</span>
            <span className="font-mono text-accent">Tolerance: ±1.5 mm per ASME B16.34</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/40 font-display text-[11px] font-bold uppercase text-muted-foreground">
              <tr>
                <th className="p-2.5">Nominal Size</th>
                <th className="p-2.5">PCD (mm)</th>
                <th className="p-2.5">Flange OD (mm)</th>
                <th className="p-2.5">Bolt Holes</th>
                <th className="p-2.5">Bolt Size</th>
                <th className="p-2.5">Face-to-Face (mm)</th>
                <th className="p-2.5 text-right">Add to Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {FLANGE_STANDARDS.map((f) => (
                <tr key={f.size} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-2.5 font-bold font-sans text-foreground">{f.size}</td>
                  <td className="p-2.5">{f.pcdMm}</td>
                  <td className="p-2.5">{f.odMm}</td>
                  <td className="p-2.5">{f.holes} holes</td>
                  <td className="p-2.5">{f.boltDia}</td>
                  <td className="p-2.5">{f.f2fMm}</td>
                  <td className="p-2.5 text-right font-sans">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[11px] px-2"
                      onClick={() =>
                        addItem({
                          valveType: product.name,
                          size: f.size,
                          material: "SS316",
                          pressure: "Class 150 / PN16",
                          connection: "Flanged ASME B16.5",
                          qty: 1,
                        })
                      }
                    >
                      + Add BOM
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: MOC Matrix */}
      {tab === "moc" && (
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="mb-4 text-xs text-muted-foreground">
            Complete Material Specification matrix for Stainless Steel, Carbon Steel, and Cast Iron builds.
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/40 font-display text-[11px] font-bold uppercase text-muted-foreground">
              <tr>
                <th className="p-2.5">Component</th>
                <th className="p-2.5">SS316 / CF8M Build</th>
                <th className="p-2.5">SS304 / CF8 Build</th>
                <th className="p-2.5">WCB Carbon Steel</th>
                <th className="p-2.5">Cast Iron Build</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOC_PARTS.map((m) => (
                <tr key={m.part} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-2.5 font-display font-semibold uppercase text-foreground">
                    {m.part}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-accent font-medium">{m.ss316}</td>
                  <td className="p-2.5 font-mono text-[11px]">{m.ss304}</td>
                  <td className="p-2.5 font-mono text-[11px]">{m.wcb}</td>
                  <td className="p-2.5 font-mono text-[11px] text-muted-foreground">{m.ci}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Testing & Standards */}
      {tab === "testing" && (
        <div className="p-6 space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-panel rounded-sm p-4">
              <h4 className="font-display text-sm font-bold uppercase text-accent">
                Hydro Shell Test
              </h4>
              <p className="mt-1 text-muted-foreground">
                Conducted at 1.5x maximum working pressure (e.g. 30 bar for PN16) with zero visible
                shell sweating or leakage.
              </p>
            </div>
            <div className="surface-panel rounded-sm p-4">
              <h4 className="font-display text-sm font-bold uppercase text-accent">
                Seat Leak Tightness
              </h4>
              <p className="mt-1 text-muted-foreground">
                Air and water seat leakage verified against API 598 and ISO 5208 Rate A (Zero
                bubbles).
              </p>
            </div>
            <div className="surface-panel rounded-sm p-4">
              <h4 className="font-display text-sm font-bold uppercase text-accent">
                Mill Test Traceability
              </h4>
              <p className="mt-1 text-muted-foreground">
                EN 10204 3.1 inspection certificates verifying chemical heat analysis and mechanical
                yield properties.
              </p>
            </div>
          </div>
          <div className="rounded-sm bg-secondary/50 p-3 text-[11px] text-muted-foreground">
            All valves are serialised and shipped with full dimensional test reports, hydro test
            records, and warranty certificates.
          </div>
        </div>
      )}
    </div>
  );
}
