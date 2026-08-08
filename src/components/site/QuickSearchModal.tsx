import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, ArrowRight, ShieldCheck, BookOpen, Layers, Calculator } from "lucide-react";
import { PRODUCTS, BLOG_POSTS, INDUSTRIES } from "@/data/site";

export function QuickSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProducts = PRODUCTS.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.short.toLowerCase().includes(q) ||
      p.variants.some((v) => v.toLowerCase().includes(q)) ||
      p.applications.some((a) => a.toLowerCase().includes(q)),
  );

  const matchedIndustries = INDUSTRIES.filter(
    (i) => !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
  );

  const matchedBlogs = BLOG_POSTS.filter(
    (b) => !q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Quick Search"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-background">
          <Search className="h-5 w-5 text-accent shrink-0" />
          <input
            type="text"
            placeholder="Search valves (e.g., SS316, butterfly, dairy, sizing, Class 150)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Quick Jump Shortcuts */}
        <div className="flex flex-wrap gap-2 border-b border-border bg-secondary/30 px-4 py-2 text-xs">
          <span className="text-muted-foreground">Quick Tools:</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: "/", hash: "sizing-calculator" });
            }}
            className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Calculator className="h-3 w-3" /> Cv Sizing Calculator
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: "/", hash: "simulator" });
            }}
            className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Layers className="h-3 w-3" /> Flow Simulator
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: "/", hash: "comparison-matrix" });
            }}
            className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ShieldCheck className="h-3 w-3" /> Comparison Matrix
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Products &amp; Valve Types ({matchedProducts.length})
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {matchedProducts.map((p) => (
                  <Link
                    key={p.slug}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5 hover:border-accent hover:bg-secondary/40 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="h-10 w-10 rounded-sm object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-semibold uppercase text-xs truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">{p.short}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {matchedIndustries.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Industry Applications ({matchedIndustries.length})
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {matchedIndustries.map((ind) => (
                  <Link
                    key={ind.slug}
                    to="/industries"
                    onClick={onClose}
                    className="rounded-lg border border-border/70 p-2.5 hover:border-accent hover:bg-secondary/40 transition-colors text-xs"
                  >
                    <div className="font-display font-semibold uppercase text-foreground">
                      {ind.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {ind.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Engineering Guides */}
          {matchedBlogs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Technical Guides &amp; Engineering Articles ({matchedBlogs.length})
              </div>
              <div className="space-y-2">
                {matchedBlogs.map((b) => (
                  <Link
                    key={b.slug}
                    to="/blog/$slug"
                    params={{ slug: b.slug }}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg border border-border/70 p-2.5 hover:border-accent hover:bg-secondary/40 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent shrink-0" />
                      <span className="font-display font-semibold uppercase">{b.title}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchedProducts.length === 0 &&
            matchedIndustries.length === 0 &&
            matchedBlogs.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No matching valves or guides found for "{query}". Try "ball", "ss316", "flange", or
                "dairy".
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
