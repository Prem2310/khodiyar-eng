import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Calculator, ShieldCheck, Check } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { PRODUCTS, type Product } from "@/data/site";
import { Button } from "@/components/ui/button";
import { useBom } from "@/components/site/QuickQuoteDrawer";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Industrial Valve Products & Catalogue | Khodiyar Engineering Ahmedabad" },
      {
        name: "description",
        content:
          "Complete industrial valve catalogue: ball, butterfly, gate, t-type strainers, y-type strainers, globe, check/NRV, plug, sanitary dairy and pneumatic valves in SS304, SS316, SS316L, WCB carbon steel and cast iron.",
      },
      { property: "og:title", content: "Industrial Valve Products | Khodiyar Engineering" },
      {
        property: "og:description",
        content:
          "Browse our precision manufactured industrial valve catalogue with technical specifications and applications.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [filter, setFilter] = useState<string>("all");
  const { addItem } = useBom();

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filter === "isolation") return p.slug.includes("ball") || p.slug.includes("gate") || p.slug.includes("butterfly");
    if (filter === "steam") return p.slug.includes("globe") || p.slug.includes("gate");
    if (filter === "sanitary") return p.slug.includes("dairy") || p.slug.includes("butterfly");
    if (filter === "actuated") return p.slug.includes("pneumatic");
    if (filter === "strainers") return p.slug.includes("y-type") || p.slug.includes("t-type");
    return true;
  });

  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Industrial Valves &amp; Flow Control Products"
        description="Engineered for isolation, throttling, non-return, inline filtration and automated duty across chemical, pharma, dairy, water and power plants. Standard sizes DN15 to DN600 in stock with full test certification, including Y-type and T-type strainers."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Valves" },
            { id: "isolation", label: "Tight Isolation (Ball / Gate / Butterfly)" },
            { id: "steam", label: "High Temp & Steam (Globe / Gate)" },
            { id: "sanitary", label: "Sanitary & Dairy (SS316L)" },
            { id: "actuated", label: "Pneumatic & Automated" },
            { id: "strainers", label: "Strainers / Filtration (Y / T Type)" },
            { id: "high-pressure", label: "High Pressure / Steam" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-sm px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === f.id
                  ? "bg-accent text-accent-foreground font-bold shadow-sm"
                  : "border border-white/20 bg-white/5 text-navy-foreground/80 hover:bg-white/15"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </PageHero>

      {/* Quick Tools Banner */}
      <div className="border-b border-border bg-secondary/40 py-3">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-muted-foreground uppercase tracking-wide">
            Need sizing support or engineering comparison?
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              hash="sizing-calculator"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <Calculator className="h-3.5 w-3.5" /> Open Cv Sizing Calculator
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/"
              hash="comparison-matrix"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> View Valve Comparison Matrix
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {filteredProducts.map((p) => (
            <article
              key={p.slug}
              className="surface-panel grid overflow-hidden rounded-sm sm:grid-cols-[220px_1fr] bg-card hover:border-accent transition-colors"
            >
              <img
                src={p.image}
                alt={`${p.name} — precision industrial valve`}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover aspect-square sm:aspect-auto"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold uppercase tracking-wide">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.short}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.applications.map((a) => (
                      <li
                        key={a}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                  <Button asChild variant="default" size="sm">
                    <Link to="/products/$slug" params={{ slug: p.slug }}>
                      Technical Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addItem({
                        valveType: p.name,
                        size: '2" (DN50)',
                        material: "SS316",
                        pressure: "Class 150 / PN16",
                        connection: "Flanged ASME B16.5",
                        qty: 1,
                      })
                    }
                  >
                    <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add to BOM
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
