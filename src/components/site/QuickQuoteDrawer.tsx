import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Layers,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Trash2,
  X,
  FileText,
  Copy,
  CheckCircle2,
} from "lucide-react";
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

export interface BomItem {
  id: string;
  valveType: string;
  size: string;
  material: string;
  pressure: string;
  connection: string;
  qty: number;
}

const STORAGE_KEY = "ke_bom_items";

export function useBom() {
  const [items, setItems] = useState<BomItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const save = (next: BomItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const addItem = (item: Omit<BomItem, "id">) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    const next = [...items, newItem];
    save(next);
    toast.success(`Added ${item.size} ${item.valveType} to Bill of Materials (BOM).`);
  };

  const removeItem = (id: string) => {
    save(items.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    save(
      items.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.qty + delta);
          return { ...i, qty: newQty };
        }
        return i;
      }),
    );
  };

  const clearAll = () => {
    save([]);
  };

  return { items, addItem, removeItem, updateQty, clearAll };
}

export function QuickQuoteDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQty, clearAll, addItem } = useBom();

  const [valveType, setValveType] = useState("Ball Valve");
  const [size, setSize] = useState('2" (DN50)');
  const [material, setMaterial] = useState("SS316");
  const [pressure, setPressure] = useState("Class 150 / PN16");
  const [connection, setConnection] = useState("Flanged ASME B16.5");
  const [qty, setQty] = useState(5);

  const handleAdd = () => {
    addItem({ valveType, size, material, pressure, connection, qty });
  };

  const totalValves = items.reduce((acc, curr) => acc + curr.qty, 0);

  const copyBomText = () => {
    if (items.length === 0) {
      toast.error("Your BOM list is currently empty.");
      return;
    }
    const lines = [
      `Khodiyar Engineering — Bill of Materials (BOM) Enquiry`,
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      `Total Line Items: ${items.length} (${totalValves} total valves)`,
      `----------------------------------------------------`,
      ...items.map(
        (i, idx) =>
          `[${idx + 1}] ${i.qty}x ${i.size} ${i.valveType} | MOC: ${i.material} | Rating: ${i.pressure} | End: ${i.connection}`,
      ),
    ].join("\n");

    navigator.clipboard.writeText(lines);
    toast.success("BOM copied to clipboard!");
  };

  const exportCsv = () => {
    if (items.length === 0) return;
    const header = "Item,Valve Type,Size,Material,Pressure Rating,End Connection,Quantity\n";
    const rows = items
      .map(
        (i, idx) =>
          `"${idx + 1}","${i.valveType}","${i.size}","${i.material}","${i.pressure}","${i.connection}",${i.qty}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Khodiyar_Engineering_BOM_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("BOM CSV exported.");
  };

  const sendBomWhatsApp = () => {
    if (items.length === 0) {
      toast.error("Please add at least one valve to your quotation list.");
      return;
    }
    const lines = [
      `Hello Khodiyar Engineering, please provide a formal quotation for this BOM:`,
      ...items.map(
        (i, idx) =>
          `• ${i.qty} pcs - ${i.size} ${i.valveType} (${i.material}, ${i.pressure}, ${i.connection})`,
      ),
      `Total valves required: ${totalValves} pcs.`,
      `Please provide unit rates, lead time, and test cert availability.`,
    ].join("\n");

    window.open(whatsappLink(lines), "_blank", "noopener");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="flex h-full w-full max-w-lg flex-col bg-background shadow-2xl border-l border-border animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Bill of Materials & Quotation Builder"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border p-5 bg-navy-gradient text-navy-foreground">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                BOM &amp; Quotation Builder
              </h2>
              <p className="text-xs text-navy-foreground/80">
                {items.length} line items ({totalValves} valves)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-navy-foreground/70 hover:text-navy-foreground hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Add Form */}
          <div className="surface-panel rounded-sm p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-accent">
                Configure New Valve Item
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Valve Type</Label>
                <Select value={valveType} onValueChange={setValveType}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ball Valve">Ball Valve</SelectItem>
                    <SelectItem value="Butterfly Valve">Butterfly Valve</SelectItem>
                    <SelectItem value="Y-Type Strainer">Y-Type Strainer</SelectItem>
                    <SelectItem value="T-Type Strainer">T-Type Strainer</SelectItem>
                    <SelectItem value="Gate Valve">Gate Valve</SelectItem>
                    <SelectItem value="Globe Valve">Globe Valve</SelectItem>
                    <SelectItem value="Check Valve">Check / NRV</SelectItem>
                    <SelectItem value="Plug Valve">Plug Valve</SelectItem>
                    <SelectItem value="Sanitary Dairy Valve">Sanitary Dairy Valve</SelectItem>
                    <SelectItem value="Pneumatic Actuated Valve">Pneumatic Actuated Valve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Nominal Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1/2" (DN15)'>1/2" (DN15)</SelectItem>
                    <SelectItem value='3/4" (DN20)'>3/4" (DN20)</SelectItem>
                    <SelectItem value='1" (DN25)'>1" (DN25)</SelectItem>
                    <SelectItem value='1.5" (DN40)'>1.5" (DN40)</SelectItem>
                    <SelectItem value='2" (DN50)'>2" (DN50)</SelectItem>
                    <SelectItem value='2.5" (DN65)'>2.5" (DN65)</SelectItem>
                    <SelectItem value='3" (DN80)'>3" (DN80)</SelectItem>
                    <SelectItem value='4" (DN100)'>4" (DN100)</SelectItem>
                    <SelectItem value='6" (DN150)'>6" (DN150)</SelectItem>
                    <SelectItem value='8" (DN200)'>8" (DN200)</SelectItem>
                    <SelectItem value='10" (DN250)'>10" (DN250)</SelectItem>
                    <SelectItem value='12" (DN300)'>12" (DN300)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Body Material (MOC)</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SS316">SS316 Stainless Steel</SelectItem>
                    <SelectItem value="SS316L">SS316L Food Grade</SelectItem>
                    <SelectItem value="SS304">SS304 Stainless Steel</SelectItem>
                    <SelectItem value="WCB Carbon Steel">WCB Carbon Steel</SelectItem>
                    <SelectItem value="Cast Iron / DI">Cast Iron / Ductile Iron</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Pressure Rating</Label>
                <Select value={pressure} onValueChange={setPressure}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class 150 / PN16">Class 150 / PN16</SelectItem>
                    <SelectItem value="Class 300 / PN25">Class 300 / PN25</SelectItem>
                    <SelectItem value="PN10 (Low Pressure)">PN10 (Low Pressure)</SelectItem>
                    <SelectItem value="Class 600 (High Pressure)">Class 600 (High Pressure)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label className="text-xs">End Connection</Label>
                <Select value={connection} onValueChange={setConnection}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flanged ASME B16.5 RF">Flanged ASME B16.5 RF</SelectItem>
                    <SelectItem value="Wafer Sandwich Style">Wafer Sandwich Style</SelectItem>
                    <SelectItem value="Lugged Full Tapped">Lugged Full Tapped</SelectItem>
                    <SelectItem value="Tri-Clamp Hygienic">Tri-Clamp Hygienic (SMS / DIN)</SelectItem>
                    <SelectItem value="Screwed BSP / NPT">Screwed BSP / NPT</SelectItem>
                    <SelectItem value="Socket Weld (SW)">Socket Weld (SW)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Qty:</Label>
                  <Input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="h-8 w-20 text-xs font-mono"
                  />
                </div>
                <Button size="sm" onClick={handleAdd}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add to List
                </Button>
              </div>
            </div>
          </div>

          {/* Current BOM Items List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
                Quotation Line Items
              </h3>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="surface-panel rounded-sm p-8 text-center text-muted-foreground">
                <Layers className="mx-auto h-8 w-8 opacity-40 mb-2" />
                <p className="text-xs">No valves in your quotation list yet.</p>
                <p className="text-[11px] opacity-70 mt-1">
                  Configure an item above or click "Add to BOM" on any product page.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="surface-panel flex items-center justify-between rounded-sm p-3 text-xs"
                  >
                    <div>
                      <div className="font-display font-semibold uppercase text-foreground">
                        {idx + 1}. {item.size} {item.valveType}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {item.material} · {item.pressure} · {item.connection}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-sm border border-border bg-background">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="px-2 py-1 hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-mono font-bold text-foreground">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="px-2 py-1 hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="border-t border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <Button size="sm" variant="outline" onClick={copyBomText}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy BOM
              </Button>
              <Button size="sm" variant="outline" onClick={exportCsv}>
                <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>

            <Button size="lg" className="w-full" onClick={sendBomWhatsApp}>
              <Send className="mr-2 h-4 w-4" /> Request Official Quotation on WhatsApp
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Instant response from Ahmedabad sales engineering desk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
