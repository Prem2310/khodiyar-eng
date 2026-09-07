import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Clock, ShieldCheck, FileCheck } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Reveal } from "@/components/site/Reveal";
import { COMPANY, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Quotation Desk | Khodiyar Engineering Vastral Ahmedabad" },
      {
        name: "description",
        content:
          "Request a formal quotation for industrial valves from Khodiyar Engineering in Vastral, Ahmedabad. Call +91 98250 00000, email sales@khodiyarengineering.in, or WhatsApp directly.",
      },
      { property: "og:title", content: "Contact Khodiyar Engineering Ahmedabad" },
      {
        property: "og:description",
        content:
          "Send your valve requirements, line drawing, and receive an engineering quotation.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Sales & Engineering Desk"
        title="Request An Industrial Valve Quotation"
        description="Tell us your process media, line size, pressure rating, and body metallurgy. Our engineering team prepares technical data sheets and competitive factory pricing."
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Main Form Box */}
          <Reveal className="surface-panel rounded-sm p-6 sm:p-8 bg-card shadow-sm">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide">
              Technical Quotation Enquiry
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill in your line parameters or upload a requirement drawing.
            </p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </Reveal>

          {/* Plant & Contact Sidebar */}
          <aside className="space-y-6">
            <Reveal delay={0.1} className="surface-panel rounded-sm p-6 bg-card space-y-5">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
                Plant Location &amp; Contact
              </h2>

              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{COMPANY.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-foreground font-semibold"
                  >
                    {COMPANY.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {COMPANY.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    WhatsApp Engineering Desk (Fast Response)
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">Mon – Sat: 09:00 AM – 07:00 PM IST</span>
                </li>
              </ul>
            </Reveal>

            {/* Trust Assurances */}
            <Reveal delay={0.18} className="surface-panel rounded-sm p-6 bg-card space-y-3">
              <h3 className="font-display text-sm font-semibold uppercase text-accent">
                Customer Guarantees
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                  <span>100% Tested Prior to Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-accent shrink-0" />
                  <span>EN 10204 3.1 Traceability Supplied</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                  <span>12 Months Standard Factory Warranty</span>
                </div>
              </div>
            </Reveal>

            {/* Location Map */}
            <Reveal delay={0.26} className="surface-panel overflow-hidden rounded-sm bg-card">
              <iframe
                title="Khodiyar Engineering Ahmedabad location map"
                src="https://www.google.com/maps?q=Vastral,+Ahmedabad,+Gujarat&output=embed"
                loading="lazy"
                className="h-56 w-full border-0"
              />
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
