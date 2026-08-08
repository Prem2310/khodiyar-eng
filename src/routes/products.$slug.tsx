import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, MessageCircle, PhoneCall, ShoppingBag, Layers, Calculator, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { TechnicalSpecTable } from "@/components/site/TechnicalSpecTable";
import { useBom } from "@/components/site/QuickQuoteDrawer";
import { PRODUCTS, whatsappLink, COMPANY, type Product } from "@/data/site";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} Manufacturer Ahmedabad | Khodiyar Engineering` },
        { name: "description", content: product.short },
        { property: "og:title", content: `${product.name} | Khodiyar Engineering Ahmedabad` },
        { property: "og:description", content: product.short },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { addItem } = useBom();

  return (
    <>
      {/* Breadcrumbs Banner */}
      <section className="bg-navy-gradient py-10 text-navy-foreground">
        <div className="container-x flex items-center justify-between text-xs opacity-90">
          <div>
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-accent font-semibold">{product.name}</span>
          </div>
          <span className="hidden sm:inline text-[11px] uppercase tracking-wider opacity-80">
            Factory Tested &amp; Serialised
          </span>
        </div>
      </section>

      {/* Main Product Hero */}
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          {/* Product Media Column */}
          <div>
            <div className="surface-panel overflow-hidden rounded-sm p-2 bg-card">
              <img
                src={product.image}
                alt={`${product.name} industrial valve manufactured in Ahmedabad`}
                width={1024}
                height={1024}
                className="w-full rounded-sm object-cover shadow-[var(--shadow-industrial)] aspect-square"
              />
            </div>

            {/* Thumbnail Variants */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.variants.slice(0, 4).map((v) => (
                <div key={v} className="surface-panel rounded-sm p-2 text-center bg-card">
                  <img
                    src={product.image}
                    alt={v}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                  <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-tight text-muted-foreground line-clamp-1">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Trust Badges under Media */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="surface-panel flex items-center gap-2 rounded-sm p-3">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                <span className="font-medium">100% Hydro &amp; Air Seat Tested</span>
              </div>
              <div className="surface-panel flex items-center gap-2 rounded-sm p-3">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span className="font-medium">EN 10204 3.1 Traceable</span>
              </div>
            </div>
          </div>

          {/* Product Specifications Column */}
          <div>
            <div className="eyebrow">Technical Specification</div>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground text-sm sm:text-base">
              {product.short}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button
                size="default"
                onClick={() =>
                  addItem({
                    valveType: product.name,
                    size: '2" (DN50)',
                    material: "SS316",
                    pressure: "Class 150 / PN16",
                    connection: "Flanged ASME B16.5",
                    qty: 1,
                  })
                }
              >
                <ShoppingBag className="mr-1.5 h-4 w-4" /> Add to Quotation BOM
              </Button>
              <Button variant="secondary" asChild>
                <a href="#enquiry">Request Formal Quote</a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/" hash="sizing-calculator">
                  <Calculator className="mr-1.5 h-4 w-4 text-accent" /> Size This Valve
                </Link>
              </Button>
            </div>

            {/* Specs Definition List */}
            <h2 className="mt-8 font-display text-base font-bold uppercase tracking-wide">
              Engineering Characteristics
            </h2>
            <dl className="mt-3 divide-y divide-border overflow-hidden rounded-sm border border-border bg-card">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[160px_1fr] gap-4 px-4 py-2.5 text-xs">
                  <dt className="font-semibold text-muted-foreground">{s.label}</dt>
                  <dd className="font-mono font-medium text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Applications List */}
            <h2 className="mt-7 font-display text-base font-bold uppercase tracking-wide">
              Suitable Plant Duties
            </h2>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  {a}
                </li>
              ))}
            </ul>

            {/* Secondary Contact Actions */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6 text-xs">
              <a
                href={whatsappLink(
                  `Hello Khodiyar Engineering, please share the datasheet for ${product.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <Download className="h-4 w-4" /> Download PDF Datasheet via WhatsApp
              </a>
              <span className="text-border">|</span>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground"
              >
                <PhoneCall className="h-4 w-4 text-accent" /> Talk to Sales Engineer
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Flange & Material Technical Specification Table */}
        <div className="container-x">
          <TechnicalSpecTable product={product} />
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry" className="bg-surface py-16 sm:py-20">
        <div className="container-x max-w-4xl">
          <div className="eyebrow">Direct factory quote</div>
          <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Request Quotation — {product.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your required line size, material of construction (SS304/SS316/WCB), and pressure
            rating. Our engineering team responds with technical specifications and unit pricing.
          </p>
          <div className="surface-panel mt-8 rounded-sm p-6 sm:p-8">
            <EnquiryForm defaultProduct={product.name} />
          </div>
          <a
            href={whatsappLink(`Hello Khodiyar Engineering, I need quotation for ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <MessageCircle className="h-4 w-4" /> Or send this enquiry directly on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
