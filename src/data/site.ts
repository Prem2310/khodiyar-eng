import ball from "@/assets/valve-ball.jpg";
import butterfly from "@/assets/valve-butterfly.jpg";
import gate from "@/assets/valve-gate.jpg";
import globe from "@/assets/valve-globe.jpg";
import check from "@/assets/valve-check.jpg";
import plug from "@/assets/valve-plug.jpg";
import dairy from "@/assets/valve-dairy.jpg";
import pneumatic from "@/assets/valve-pneumatic.jpg";
import ytypestrainer from "@/assets/valve-ytype.png";
import ttypestrainer from "@/assets/valve-ttype.png";



export const COMPANY = {
  name: "Khodiyar Engineering",
  tagline: "Precision Engineered Industrial Valves",
  city: "Rita Nagar, Ahmedabad",
  address: "Shop no-2, Amardeep Apartment, opp. Bagefirdos School, Rita Nagar, Amraiwadi, Ahmedabad, Gujarat 380026",
  phone: "+91 8200653739",
  whatsapp: "919998725724",
  email: "sales@khodiyarengineering.in",
  whatsappMessage:
    "Hello Khodiyar Engineering, I need quotation for industrial valves.",
};

export const whatsappLink = (message: string = COMPANY.whatsappMessage) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;

export type Product = {
  slug: string;
  name: string;
  short: string;
  image: string;
  variants: string[];
  specs: { label: string; value: string }[];
  applications: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "ball-valves",
    name: "Ball Valves",
    short:
      "Quarter-turn ball valves in 2-piece, 3-piece, flanged and threaded designs for tight shut-off in demanding line service.",
    image: ball,
    variants: [
      "Stainless steel ball valve",
      "2 piece ball valve",
      "3 piece ball valve",
      "Flanged ball valve",
      "Threaded ball valve",
    ],
    specs: [
      { label: "Valve Type", value: "Floating / Trunnion Ball Valve" },
      { label: "Size", value: '1/2" to 12" (DN15 – DN300)' },
      { label: "Material", value: "SS304, SS316, Carbon Steel, WCB" },
      { label: "Pressure Rating", value: "PN16 / PN25 / Class 150 – 300" },
      { label: "Temperature Range", value: "-20°C to 200°C" },
      { label: "End Connection", value: "Flanged, Screwed, Socket Weld" },
      { label: "Operation", value: "Lever, Gear, Pneumatic, Electric" },
    ],
    applications: ["Chemical", "Water", "Oil", "Gas"],
  },
  {
    slug: "butterfly-valves",
    name: "Butterfly Valves",
    short:
      "Compact wafer, lug and sanitary butterfly valves offering low pressure drop and fast isolation in large-bore lines.",
    image: butterfly,
    variants: ["Wafer butterfly valve", "Lug butterfly valve", "Sanitary butterfly valve"],
    specs: [
      { label: "Valve Type", value: "Concentric / Double Offset Butterfly" },
      { label: "Size", value: '2" to 24" (DN50 – DN600)' },
      { label: "Material", value: "SS304, SS316, CI, Ductile Iron" },
      { label: "Pressure Rating", value: "PN10 / PN16" },
      { label: "Temperature Range", value: "-10°C to 180°C" },
      { label: "End Connection", value: "Wafer, Lug, Flanged" },
      { label: "Operation", value: "Lever, Gear Box, Pneumatic Actuator" },
    ],
    applications: ["Dairy", "Pharma", "Food Processing", "Water Treatment"],
  },
  {
    slug: "gate-valves",
    name: "Gate Valves",
    short:
      "Rising and non-rising stem gate valves engineered for full-bore flow and reliable on/off isolation duty.",
    image: gate,
    variants: ["Rising stem gate valve", "Industrial gate valve"],
    specs: [
      { label: "Valve Type", value: "Rising / Non-Rising Stem Gate Valve" },
      { label: "Size", value: '1/2" to 16" (DN15 – DN400)' },
      { label: "Material", value: "SS304, SS316, WCB, Cast Iron" },
      { label: "Pressure Rating", value: "PN16 / Class 150 – 300" },
      { label: "Temperature Range", value: "-10°C to 400°C" },
      { label: "End Connection", value: "Flanged, Screwed, Butt Weld" },
      { label: "Operation", value: "Handwheel, Gear, Electric Actuator" },
    ],
    applications: ["Water", "Steam", "Oil", "Power Plants"],
  },
  {
    slug: "y-type-strainers",
    name: "Y-Type Strainers",
    short:
      "Compact Y-type strainer designs for efficient debris removal in tight spaces and pump protection.",
    image: ytypestrainer,
    variants: ["Y-type strainer", "Industrial strainer"],
    specs: [
      { label: "Valve Type", value: "Y-Type Strainer" },
      { label: "Size", value: '1/2" to 12" (DN15 – DN300)' },
      { label: "Material", value: "SS304, SS316, Carbon Steel" },
      { label: "Pressure Rating", value: "PN16 / Class 150" },
      { label: "Temperature Range", value: "-10°C to 200°C" },
      { label: "End Connection", value: "Flanged, Screwed, Socket Weld" },
      { label: "Operation", value: "Manual Cleaning / Blowdown" },
    ],
    applications: ["Water Treatment", "Chemical", "Inline Filtration", "Pump Protection"],
  },
  {
    slug: "t-type-strainers",
    name: "T-Type Strainers",
    short:
      "T-type inline strainer designs for high-flow filtration and continuous process pipeline protection.",
    image: ttypestrainer,
    variants: ["T-type strainer", "Industrial strainer"],
    specs: [
      { label: "Valve Type", value: "T-Type Strainer" },
      { label: "Size", value: '1/2" to 12" (DN15 – DN300)' },
      { label: "Material", value: "SS304, SS316, Carbon Steel" },
      { label: "Pressure Rating", value: "PN16 / Class 150" },
      { label: "Temperature Range", value: "-10°C to 200°C" },
      { label: "End Connection", value: "Flanged, Screwed, Socket Weld" },
      { label: "Operation", value: "Manual Cleaning / Blowdown" },
    ],
    applications: ["Water Treatment", "Chemical", "Inline Filtration", "Process Protection"],
  },
  {
    slug: "globe-valves",
    name: "Globe Valves",
    short:
      "Globe and control globe valves for precise throttling, regulation and repeatable flow control.",
    image: globe,
    variants: ["Industrial globe valve", "Control globe valve"],
    specs: [
      { label: "Valve Type", value: "Globe / Control Globe Valve" },
      { label: "Size", value: '1/2" to 10" (DN15 – DN250)' },
      { label: "Material", value: "SS304, SS316, Carbon Steel" },
      { label: "Pressure Rating", value: "Class 150 – 300" },
      { label: "Temperature Range", value: "-10°C to 425°C" },
      { label: "End Connection", value: "Flanged, Screwed, Socket Weld" },
      { label: "Operation", value: "Handwheel, Pneumatic Positioner" },
    ],
    applications: ["Steam", "Chemical", "Oil & Gas", "Power Plants"],
  },
  {
    slug: "check-valves",
    name: "Check Valves / NRV",
    short:
      "Swing, wafer and SS non-return valves that protect pumps and pipelines from damaging reverse flow.",
    image: check,
    variants: ["Swing check valve", "SS non return valve", "Wafer check valve"],
    specs: [
      { label: "Valve Type", value: "Swing / Dual Plate / Lift Check" },
      { label: "Size", value: '1/2" to 16" (DN15 – DN400)' },
      { label: "Material", value: "SS304, SS316, CI, WCB" },
      { label: "Pressure Rating", value: "PN16 / Class 150" },
      { label: "Temperature Range", value: "-10°C to 300°C" },
      { label: "End Connection", value: "Wafer, Flanged, Screwed" },
      { label: "Operation", value: "Automatic (line pressure)" },
    ],
    applications: ["Water Treatment", "Chemical", "Oil & Gas"],
  },
  {
    slug: "plug-valves",
    name: "Plug Valves",
    short:
      "Two-way and three-way plug valves for diverting service and slurry or viscous media handling.",
    image: plug,
    variants: ["Three way plug valve", "Industrial plug valve"],
    specs: [
      { label: "Valve Type", value: "Lubricated / Sleeved Plug Valve" },
      { label: "Size", value: '1/2" to 8" (DN15 – DN200)' },
      { label: "Material", value: "SS304, SS316, Cast Iron, WCB" },
      { label: "Pressure Rating", value: "PN16 / Class 150" },
      { label: "Temperature Range", value: "-10°C to 200°C" },
      { label: "End Connection", value: "Flanged, Screwed" },
      { label: "Operation", value: "Wrench, Gear, Actuated" },
    ],
    applications: ["Chemical", "Textile", "Oil & Gas"],
  },
  {
    slug: "sanitary-dairy-valves",
    name: "Sanitary Dairy Valves",
    short:
      "Food-grade SS316 hygienic valves with mirror-polished internals for CIP-ready dairy, pharma and food lines.",
    image: dairy,
    variants: ["SS dairy valve", "SMS butterfly valve", "Dairy plug valve", "Food grade valves"],
    specs: [
      { label: "Valve Type", value: "Sanitary Butterfly / Plug / Seat Valve" },
      { label: "Size", value: '1" to 6" (DN25 – DN150)' },
      { label: "Material", value: "SS316L / SS304 food grade" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Temperature Range", value: "-10°C to 140°C (CIP/SIP)" },
      { label: "End Connection", value: "Tri-Clamp, SMS Union, Weld" },
      { label: "Operation", value: "Manual, Pneumatic Actuator" },
    ],
    applications: ["Dairy Plants", "Pharmaceutical Plants", "Food Industries"],
  },
  {
    slug: "pneumatic-valves",
    name: "Pneumatic Valves",
    short:
      "Actuated valve assemblies with solenoid, limit switch and positioner options for automated plant control.",
    image: pneumatic,
    variants: ["Pneumatic actuated valve", "Automated valve system"],
    specs: [
      { label: "Valve Type", value: "Actuated Ball / Butterfly Assembly" },
      { label: "Size", value: '1/2" to 12" (DN15 – DN300)' },
      { label: "Material", value: "SS304, SS316, Aluminium actuator" },
      { label: "Pressure Rating", value: "PN16 / Class 150" },
      { label: "Temperature Range", value: "-10°C to 180°C" },
      { label: "End Connection", value: "Flanged, Tri-Clamp, Screwed" },
      { label: "Operation", value: "Double Acting / Spring Return" },
    ],
    applications: ["Pharma", "Chemical", "Water Treatment", "Automation"],
  }
];

export const VALVE_TYPES = [
  "Ball Valve",
  "Butterfly Valve",
  "Y-Type Strainer",
  "T-Type Strainer",
  "Gate Valve",
  "Globe Valve",
  "Check Valve",
  "Plug Valve",
  "Dairy Valve",
  "Other",
];

export const INDUSTRIES = [
  {
    slug: "chemical",
    name: "Chemical Industry",
    description:
      "Corrosion-resistant SS316 and PTFE-lined valves for aggressive acids, solvents and process chemicals.",
    valves: ["Ball Valves", "Plug Valves", "Globe Valves"],
  },
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical Industry",
    description:
      "Hygienic, CIP/SIP-ready valve assemblies with documented material traceability for GMP plants.",
    valves: ["Sanitary Valves", "Pneumatic Valves", "Butterfly Valves"],
  },
  {
    slug: "dairy",
    name: "Dairy Industry",
    description:
      "Food-grade SMS and tri-clamp valves engineered for milk, cream and CIP circuits.",
    valves: ["Sanitary Dairy Valves", "SMS Butterfly Valves"],
  },
  {
    slug: "food-processing",
    name: "Food Processing",
    description:
      "Mirror-polished stainless valves for hygienic transfer of edible fluids and slurries.",
    valves: ["Sanitary Valves", "Butterfly Valves"],
  },
  {
    slug: "water-treatment",
    name: "Water Treatment",
    description:
      "Full-bore isolation and non-return valves for RO, ETP, STP and municipal water networks.",
    valves: ["Gate Valves", "Butterfly Valves", "Check Valves"],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    description:
      "High-pressure fire-safe designs for hydrocarbon transfer, terminals and refinery service.",
    valves: ["Ball Valves", "Gate Valves", "Check Valves"],
  },
  {
    slug: "power-plants",
    name: "Power Plants",
    description:
      "High-temperature steam and boiler feed valves built for continuous thermal cycling.",
    valves: ["Globe Valves", "Gate Valves"],
  },
  {
    slug: "textile",
    name: "Textile Industry",
    description:
      "Dyeing, bleaching and utility line valves resistant to hot water, steam and chemicals.",
    valves: ["Ball Valves", "Plug Valves"],
  },
];

export const BLOG_POSTS = [
  {
    slug: "how-to-select-industrial-valves",
    title: "How to select industrial valves?",
    excerpt:
      "A practical selection framework covering media, pressure, temperature, actuation and maintainability.",
    date: "2026-05-12",
    body: [
      "Selecting an industrial valve begins with the process media. Corrosive acids, abrasive slurries, saturated steam and food-grade liquids each demand a different body material and seat combination.",
      "Next, fix the operating envelope: design pressure, maximum temperature, and the flow coefficient your line needs. A valve chosen only on line size frequently underperforms once the real pressure drop is calculated.",
      "Decide the duty. Isolation duty suits ball, gate and butterfly valves. Throttling and regulation suit globe or control valves. Reverse flow protection needs a check valve sized against the actual pump curve.",
      "Finally, plan for maintenance. Three-piece and top-entry designs let you service the valve in line, which significantly reduces plant downtime over a ten-year lifecycle.",
    ],
  },
  {
    slug: "ball-valve-vs-butterfly-valve",
    title: "Ball Valve vs Butterfly Valve",
    excerpt:
      "Where each quarter-turn valve wins on sealing, pressure drop, cost and space in real plant layouts.",
    date: "2026-04-28",
    body: [
      "Both are quarter-turn valves, yet they solve different problems. A ball valve gives bubble-tight shut-off and full-bore flow, making it the default for hydrocarbon and high-pressure service.",
      "A butterfly valve is far lighter and more compact in larger diameters. Above DN200 the cost and weight advantage becomes decisive, especially for water, HVAC and dairy circuits.",
      "Pressure drop favours full-bore ball valves; the disc of a butterfly valve always sits in the flow path. For throttling, a resilient-seated butterfly valve performs acceptably between 30% and 70% open.",
      "As a rule: high pressure and tight shut-off, choose ball. Large bore, low pressure and space-constrained, choose butterfly.",
    ],
  },
  {
    slug: "industrial-valve-maintenance-guide",
    title: "Industrial valve maintenance guide",
    excerpt:
      "Preventive routines, seat and gland inspection intervals, and how to spot failure before it stops the line.",
    date: "2026-04-10",
    body: [
      "Most valve failures are predictable. Gland leakage, seat wear and actuator drift all show early symptoms that a scheduled inspection catches.",
      "Operate manual isolation valves through a full cycle at least quarterly. Valves left in one position for years often seize when finally needed in an emergency.",
      "Check packing torque and re-tighten in small increments. Over-tightening the gland raises operating torque and accelerates stem wear.",
      "Keep a spares kit of seats, seals and gaskets for your critical line sizes. In-line serviceable designs turn a shutdown into a one-hour job.",
    ],
  },
  {
    slug: "best-valves-for-chemical-industries",
    title: "Best valves for chemical industries",
    excerpt:
      "Material selection for acids, solvents and slurries, plus fugitive-emission and lining considerations.",
    date: "2026-03-22",
    body: [
      "Chemical service is a materials problem first. SS316 handles a wide band of process chemicals, while strong acids may demand PTFE-lined or alloy bodies.",
      "Seat material matters as much as the body. PTFE and PFA seats resist most solvents; EPDM and Viton must be checked against the specific chemical compatibility chart.",
      "For fugitive emissions, specify live-loaded packing and certified stem sealing. This is increasingly required in audited plants.",
      "Plug and diaphragm valves handle viscous or crystallising media better than ball valves, which can trap solids in the body cavity.",
    ],
  },
  {
    slug: "dairy-valve-selection-guide",
    title: "Dairy valve selection guide",
    excerpt:
      "Hygienic design rules, surface finish, CIP compatibility and connection standards for dairy plants.",
    date: "2026-03-05",
    body: [
      "Dairy valves must be crevice-free and fully drainable. Any dead leg becomes a bacterial risk that CIP cycles cannot reliably clear.",
      "Specify SS316L with an internal surface finish of Ra 0.8 µm or better, and food-grade EPDM or silicone seals.",
      "Match the connection standard used across your plant — SMS, DIN or tri-clamp — so spares stay interchangeable across lines.",
      "For automated CIP circuits, pneumatic actuation with position feedback gives verifiable valve state to the plant PLC.",
    ],
  },
  {
    slug: "y-type-strainer-selection-guide",
    title: "Y-type strainer selection guide",
    excerpt:
      "Sizing, mesh selection, blowdown and maintenance tips for Y-type strainers in industrial lines.",
    date: "2026-02-18",
    body: [
      "Y-type strainers protect pumps and control valves from debris. Choose a mesh size that captures the expected particle size without excessive pressure drop.",
      "Blowdown valves should be installed to allow easy cleaning of the strainer element without removing the entire assembly.",
      "For high-temperature or corrosive service, select a strainer body material compatible with the process fluid.",
      "Regular inspection and cleaning of the strainer element is essential to maintain flow efficiency and prevent clogging.",
    ],
  },
  {
    slug: "t-type-strainer-selection-guide",
    title: "T-type strainer selection guide",
    excerpt:
      "When to use T-type strainers, sizing considerations, and maintenance best practices for industrial applications.",
    date: "2026-02-05",
    body: [
      "T-type strainers are ideal for applications where space is limited and a compact design is required. They are often used in pipelines with frequent flow reversals.",
      "Select the appropriate mesh size based on the particle size in the fluid to ensure effective filtration without causing significant pressure drop.",
      "Ensure that the strainer body material is compatible with the process fluid, especially in corrosive or high-temperature environments.",
      "Regular maintenance and cleaning of the strainer element are crucial to prevent clogging and maintain optimal flow performance.",
    ],
  },
];
