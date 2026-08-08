import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Search, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, whatsappLink } from "@/data/site";
import { QuickQuoteDrawer, useBom } from "./QuickQuoteDrawer";
import { QuickSearchModal } from "./QuickSearchModal";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/industries", label: "Industries" },
  { to: "/quality", label: "Quality" },
  { to: "/custom-solutions", label: "Custom Solutions" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const { items } = useBom();

  const totalItems = items.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        {/* Top Info Strip */}
        <div className="hidden bg-navy-gradient text-navy-foreground md:block">
          <div className="container-x flex h-9 items-center justify-between text-xs">
            <span className="tracking-wide opacity-90 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Industrial Valve Manufacturer &amp; Supplier — {COMPANY.city}, Gujarat, India
            </span>
            <div className="flex items-center gap-5 opacity-90">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-100 hover:text-accent transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Desk
              </a>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 hover:opacity-100 hover:text-accent transition-colors font-medium"
              >
                <Phone className="h-3.5 w-3.5" /> {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="container-x flex h-18 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-navy-gradient font-display text-lg font-bold text-navy-foreground shadow-sm ring-1 ring-accent/30">
              KE
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold uppercase tracking-wide text-foreground">
                Khodiyar Engineering
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                Flow Control Solutions
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-accent bg-secondary/80 font-bold" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search valves and specs"
              className="flex items-center gap-2 rounded-sm border border-border bg-secondary/40 px-2.5 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline-block rounded border border-border bg-background px-1 py-0.2 text-[9px] font-mono font-medium">
                ⌘K
              </kbd>
            </button>

            {/* Quick BOM / Quote Cart Button */}
            <button
              type="button"
              onClick={() => setIsQuoteDrawerOpen(true)}
              aria-label="Open Bill of Materials quotation drawer"
              className="relative flex items-center gap-1.5 rounded-sm border border-border bg-secondary/40 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-accent transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-accent" />
              <span className="hidden sm:inline">BOM</span>
              {totalItems > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Request Quote Main CTA */}
            <Button asChild size="sm" className="hidden sm:inline-flex shadow-sm">
              <Link to="/contact">Request Quote</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle mobile menu"
              className="grid h-9 w-9 place-items-center rounded-sm border border-border lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {open && (
          <nav className="border-t border-border bg-card lg:hidden animate-in slide-in-from-top-2">
            <div className="container-x grid gap-1 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "text-accent bg-secondary font-semibold" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-border pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                    setIsQuoteDrawerOpen(true);
                  }}
                >
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> BOM ({totalItems})
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Request Quote
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Global Modals & Drawers */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <QuickQuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
      />
    </>
  );
}
