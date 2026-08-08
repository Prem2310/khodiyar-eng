import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import engineerImg from "@/assets/engineer-inspection.jpg";
import pipelineImg from "@/assets/pipeline.jpg";
import valveBall from "@/assets/valve-ball.jpg";
import valveDairy from "@/assets/valve-dairy.jpg";

const CHAPTERS = [
  {
    index: "01",
    title: "Material",
    body: "SS316, SS304, carbon steel and cast iron billets arrive with mill test certificates and are traced through every operation.",
    image: valveBall,
  },
  {
    index: "02",
    title: "Machining",
    body: "CNC turning and milling holds seat geometry within microns — the difference between a seal and a leak at 40 bar.",
    image: engineerImg,
  },
  {
    index: "03",
    title: "Assembly",
    body: "Torque-controlled assembly, PTFE and metal seating, actuator mounting to ISO 5211 — built for a decade of cycles.",
    image: valveDairy,
  },
  {
    index: "04",
    title: "Proof",
    body: "Hydro, seat and pneumatic leak tests on every unit. Documented, serialised and shipped to your line.",
    image: pipelineImg,
  },
];

function Chapter({
  chapter,
  progress,
  index,
  total,
}: {
  chapter: (typeof CHAPTERS)[number];
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  const opacity = useTransform(progress, [start - 0.06, start + 0.04, end - 0.04, end + 0.06], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.12, 1]);
  const y = useTransform(progress, [start - 0.05, mid, end + 0.05], [40, 0, -40]);

  return (
    <>
      <motion.div className="absolute inset-0" style={{ opacity }}>
        <motion.img
          src={chapter.image}
          alt={chapter.title}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ scale }}
        />
        <div className="absolute inset-0 hero-overlay" />
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 p-8 sm:p-14" style={{ opacity, y }}>
        <div className="font-display text-6xl font-bold text-accent/70 sm:text-8xl">{chapter.index}</div>
        <h3 className="mt-2 text-3xl font-bold uppercase tracking-tight text-navy-foreground sm:text-5xl">
          {chapter.title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-foreground/80 sm:text-base">
          {chapter.body}
        </p>
      </motion.div>
    </>
  );
}

function Tick({
  label,
  progress,
  index,
  total,
}: {
  label: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const scaleY = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.3em] text-navy-foreground/60">{label}</span>
      <span className="block h-8 w-px bg-white/20">
        <motion.span className="block h-full w-px origin-top bg-accent" style={{ scaleY }} />
      </span>
    </div>
  );
}

/** Pinned, scroll-driven manufacturing story. */
export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: `${CHAPTERS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-navy">
        <div className="absolute inset-0">
          {CHAPTERS.map((c, i) => (
            <Chapter key={c.index} chapter={c} progress={progress} index={i} total={CHAPTERS.length} />
          ))}
        </div>

        <div className="absolute left-0 right-0 top-0 h-[3px] bg-white/10">
          <motion.div className="h-full origin-left rule-accent" style={{ scaleX: barScale }} />
        </div>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 sm:flex">
          {CHAPTERS.map((c, i) => (
            <Tick key={c.index} label={c.index} progress={progress} index={i} total={CHAPTERS.length} />
          ))}
        </div>

        <div className="container-x absolute inset-x-0 top-10">
          <div className="eyebrow">How a Khodiyar valve is made</div>
        </div>
      </div>
    </section>
  );
}
