import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useAnimationFrame } from "motion/react";
import { Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/site";

/**
 * Interactive 3D product carousel — valves arranged on a rotating ring.
 * Auto-spins, reacts to scroll, and can be dragged to rotate.
 */
export function ValveOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = PRODUCTS.slice(0, 10);
  const step = 360 / items.length;
  const radius = 400;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scrollRot = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const drag = useMotionValue(0);
  const auto = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  useAnimationFrame((_, delta) => {
    if (!dragging) auto.set(auto.get() + delta * 0.006);
  });

  const raw = useTransform([scrollRot, drag, auto], ([s, d, a]) => (s as number) + (d as number) + (a as number));
  const rotateY = useSpring(raw, { stiffness: 60, damping: 20, mass: 0.6 });

  const [active, setActive] = useState(0);

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-navy-gradient py-24 text-navy-foreground sm:py-32"
    >
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">Interactive catalogue</div>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-navy-foreground sm:text-4xl">
            Spin the range
          </h2>
          <p className="mt-4 text-sm text-navy-foreground/70">
            Drag to rotate the ring. Every valve is engineered, tested and traceable.
          </p>
        </div>

        <div className="relative mt-10 h-[360px] select-none sm:h-[460px]" style={{ perspective: "1400px" }}>
          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d", rotateY }}
            drag="x"
            dragElastic={0.12}
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setDragging(true)}
            onDrag={(_, info) => drag.set(drag.get() + info.delta.x * 0.35)}
            onDragEnd={() => setDragging(false)}
          >
            {items.map((p, i) => (
              <div
                key={p.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
                onMouseEnter={() => setActive(i)}
              >
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="group block w-[190px] overflow-hidden rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm transition-colors hover:border-accent sm:w-[230px]"
                  draggable={false}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    draggable={false}
                    className="aspect-square w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="border-t border-white/10 p-3 text-center">
                    <div className="font-display text-sm font-semibold uppercase tracking-[0.14em]">
                      {p.name}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[oklch(0.24_0.055_258)] to-transparent" />
        </div>

        <div className="mt-6 text-center text-sm text-navy-foreground/70">
          {items[active]?.short}
        </div>
      </div>
    </section>
  );
}
