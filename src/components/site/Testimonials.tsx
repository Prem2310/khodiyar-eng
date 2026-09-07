import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { TESTIMONIALS } from "@/data/site";

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    const timer = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5500);

    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api]);

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-28 tech-grid-dark">
      <div className="pointer-events-none absolute inset-0 [background-image:var(--gradient-mesh)]" />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            eyebrow="Client Feedback"
            title="Trusted By Plant Engineers &amp; Purchase Teams"
            description="Feedback from factory owners, purchase managers and EPC partners who source their industrial valves from Khodiyar Engineering."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <Carousel setApi={setApi} opts={{ loop: true }} className="mx-auto max-w-3xl">
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.name}>
                  <div className="surface-panel relative rounded-sm p-8 sm:p-10 bg-card text-center">
                    <Quote className="mx-auto h-8 w-8 text-accent/50" />
                    <div className="mt-4 flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < t.rating ? "fill-accent text-accent" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-5 text-base sm:text-lg leading-relaxed text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6">
                      <div className="font-display text-sm font-bold uppercase tracking-wide">
                        {t.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                        {t.industry}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Progress Dots */}
          <div className="mt-7 flex justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selected === i ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-accent/50"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
