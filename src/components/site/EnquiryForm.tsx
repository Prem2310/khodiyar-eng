import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Upload, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALVE_TYPES, whatsappLink, COMPANY } from "@/data/site";
import { useBom } from "./QuickQuoteDrawer";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your contact name").max(100),
  company: z.string().trim().min(2, "Please enter your company/plant name").max(120),
  email: z.string().trim().email("Enter a valid official email address").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone/mobile number").max(20),
  product: z.string().trim().max(120).optional(),
  valveType: z.string().trim().max(60),
  quantity: z.string().trim().max(40).optional(),
  material: z.string().trim().max(60).optional(),
  pressure: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1500).optional(),
});

export function EnquiryForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const { items } = useBom();
  const [values, setValues] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: defaultProduct,
    valveType: VALVE_TYPES[0],
    quantity: "5 pcs",
    material: "SS316 Stainless Steel",
    pressure: "Class 150 / PN16",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string | null>(null);

  const set = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error("File exceeds 15MB limit.");
        return;
      }
      setFileName(file.name);
      toast.success(`Attached drawing: ${file.name}`);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please fill in the required fields highlighted below.");
      return;
    }
    setErrors({});

    const bomDetails =
      items.length > 0
        ? `\n\nAlso include BOM items (${items.length} line items):\n` +
          items.map((i) => `• ${i.qty}x ${i.size} ${i.valveType} (${i.material})`).join("\n")
        : "";

    const text = [
      `Hello Khodiyar Engineering Sales Desk, I need a formal quotation:`,
      `• Name: ${values.name}`,
      `• Company: ${values.company}`,
      `• Email: ${values.email}`,
      `• Phone: ${values.phone}`,
      values.product ? `• Target Product: ${values.product}` : "",
      `• Valve Type: ${values.valveType}`,
      `• Material (MOC): ${values.material}`,
      `• Pressure Class: ${values.pressure}`,
      values.quantity ? `• Quantity: ${values.quantity}` : "",
      fileName ? `• Attached Drawing: ${fileName}` : "",
      values.message ? `• Requirements / Media: ${values.message}` : "",
      bomDetails,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(text), "_blank", "noopener");
    toast.success("Enquiry prepared — our WhatsApp desk will assist you with pricing.");
  };

  const field = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive font-medium">{errors[key]}</p> : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="name" className="text-xs font-semibold">Contact Person Name *</Label>
        <Input
          id="name"
          placeholder="e.g. Rajesh Patel"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="mt-1.5"
        />
        {field("name")}
      </div>

      <div>
        <Label htmlFor="company" className="text-xs font-semibold">Company / Plant Name *</Label>
        <Input
          id="company"
          placeholder="e.g. Apex Chemicals Ltd."
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
          className="mt-1.5"
        />
        {field("company")}
      </div>

      <div>
        <Label htmlFor="email" className="text-xs font-semibold">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="sales@company.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          className="mt-1.5"
        />
        {field("email")}
      </div>

      <div>
        <Label htmlFor="phone" className="text-xs font-semibold">Mobile / WhatsApp Number *</Label>
        <Input
          id="phone"
          placeholder="+91 9998725724"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="mt-1.5"
        />
        {field("phone")}
      </div>

      <div>
        <Label htmlFor="valveType" className="text-xs font-semibold">Required Valve Type</Label>
        <Select value={values.valveType} onValueChange={(v) => set("valveType", v)}>
          <SelectTrigger id="valveType" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VALVE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="material" className="text-xs font-semibold">Body Metallurgy (MOC)</Label>
        <Select value={values.material} onValueChange={(v) => set("material", v)}>
          <SelectTrigger id="material" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SS316 Stainless Steel">SS316 Stainless Steel (CF8M)</SelectItem>
            <SelectItem value="SS316L Food Grade">SS316L Food Grade / Dairy</SelectItem>
            <SelectItem value="SS304 Stainless Steel">SS304 Stainless Steel (CF8)</SelectItem>
            <SelectItem value="WCB Carbon Steel">WCB Cast Carbon Steel</SelectItem>
            <SelectItem value="Cast Iron / Ductile Iron">Cast Iron / Ductile Iron (CI)</SelectItem>
            <SelectItem value="PTFE / PFA Lined">PTFE / PFA Lined Body</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pressure" className="text-xs font-semibold">Pressure Rating</Label>
        <Select value={values.pressure} onValueChange={(v) => set("pressure", v)}>
          <SelectTrigger id="pressure" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Class 150 / PN16">Class 150 / PN16 (Standard Process)</SelectItem>
            <SelectItem value="Class 300 / PN25">Class 300 / PN25 (High Pressure / Steam)</SelectItem>
            <SelectItem value="PN10 Low Pressure">PN10 (Water / Utility / HVAC)</SelectItem>
            <SelectItem value="Class 600 / PN40">Class 600 / PN40 (Heavy Duty / Oil &amp; Gas)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity" className="text-xs font-semibold">Estimated Quantity / Order Size</Label>
        <Input
          id="quantity"
          placeholder="e.g. 10 pcs / Bulk Project Order"
          value={values.quantity}
          onChange={(e) => set("quantity", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="drawing" className="text-xs font-semibold">
          Upload Requirement Drawing / Line Schematic (PDF / DWG / JPG / PNG)
        </Label>
        <div className="mt-1.5 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-secondary/50 px-3.5 py-2 text-xs font-medium hover:bg-secondary transition-colors">
            <Upload className="h-4 w-4 text-accent" />
            <span>{fileName ? `File: ${fileName}` : "Choose file from device…"}</span>
            <input
              id="drawing"
              type="file"
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
              onChange={handleFile}
              className="sr-only"
            />
          </label>
          {fileName && (
            <button
              type="button"
              onClick={() => setFileName(null)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="message" className="text-xs font-semibold">
          Process Media, Temperature &amp; Notes
        </Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="e.g. Media is 98% Sulphuric Acid at 60°C, required with pneumatic double acting actuator and limit switch box."
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="sm:col-span-2 pt-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto shadow-md">
          <Send className="mr-2 h-4 w-4" /> Submit Quotation Request
        </Button>
        <p className="mt-2.5 text-xs text-muted-foreground">
          Enquiries route directly to our Ahmedabad sales engineering desk for instant pricing and technical review.
        </p>
      </div>
    </form>
  );
}
