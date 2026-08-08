import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { COMPANY, PRODUCTS, whatsappLink } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-navy-foreground border-t border-white/10">
      {/* Top Value Strip */}
      <div className="border-b border-white/10 py-6">
        <div className="container-x grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
            <span>100% Hydro Shell &amp; Seat Tested</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span>EN 10204 3.1 Traceability</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
            <span>ASME B16.34 &amp; API 598 Standard</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span>Pan-India Plant Supply</span>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold uppercase tracking-wide">
            Khodiyar Engineering
          </div>
          <p className="mt-3 max-w-xs text-xs sm:text-sm opacity-80 leading-relaxed">
            Manufacturer and supplier of precision industrial valves, sanitary dairy valves, and
            customized flow control packages from Vastral, Ahmedabad, Gujarat.
          </p>
          <div className="mt-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Instant WhatsApp RFQ
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-accent font-semibold">
            Product Range
          </h3>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm">
            {PRODUCTS.slice(0, 10).map((p) => (
              <li key={p.slug}>
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-accent font-semibold">
            Engineering &amp; Company
          </h3>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm">
            <li>
              <Link to="/about" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                About Our Works
              </Link>
            </li>
            <li>
              <Link to="/industries" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Industries Served
              </Link>
            </li>
            <li>
              <Link to="/quality" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Quality Assurance &amp; Testing
              </Link>
            </li>
            <li>
              <Link to="/custom-solutions" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Custom Valve Solutions
              </Link>
            </li>
            <li>
              <Link to="/" hash="sizing-calculator" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Valve $C_v$ Sizing Calculator
              </Link>
            </li>
            <li>
              <Link to="/" hash="simulator" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Flow Cutaway Simulator
              </Link>
            </li>
            <li>
              <Link to="/blog" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                Technical Insights &amp; Selection Guides
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-accent font-semibold">
            Plant &amp; Sales Desk
          </h3>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex gap-3 opacity-80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{COMPANY.address}</span>
            </li>
            <li className="flex gap-3 opacity-80">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex gap-3 opacity-80">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-accent">
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs opacity-70 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Khodiyar Engineering. All rights reserved.</span>
          <span className="flex items-center gap-4">
            Industrial valve manufacturer in Vastral, Ahmedabad, Gujarat, India.
            <Link to="/admin" className="opacity-60 hover:opacity-100 hover:text-accent">
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
