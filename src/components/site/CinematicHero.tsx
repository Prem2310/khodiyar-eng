import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MousePointerClick } from "lucide-react";
import heroImg from "@/assets/hero-factory.jpg";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/site/ParticleField";
import { RevealWords } from "@/components/site/Reveal";
import { COMPANY } from "@/data/site";

const TRUST = [
  "Quality Manufacturing",
  "Custom Valve Solutions",
  "Industrial Applications",
  "Nationwide Supply",
];

export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  const imgY = useTransform(p, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(p, [0, 1], [1.08, 1.24]);
  const contentY = useTransform(p, [0, 1], [0, -110]);
  const contentOpacity = useTransform(p, [0, 0.7], [1, 0]);
  const veil = useTransform(p, [0, 1], [0, 0.45]);

  return (
    <section ref={ref} className="relative isolate min-h-[92vh] overflow-hidden">
      <motion.img
        src={heroImg}
        alt="Industrial valve manufacturing factory with stainless steel valves"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ y: imgY, scale: imgScale }}
      />
      <div className="absolute inset-0 hero-overlay" />
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: veil }} />
      <ParticleField />

      <motion.div
        className="container-x relative flex min-h-[92vh] flex-col justify-center py-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.22em" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Flow Control Engineering · Ahmedabad, India
        </motion.div>

        <h1 className="mt-5 max-w-4xl text-4xl font-bold uppercase leading-[1.03] tracking-tight text-navy-foreground sm:text-6xl lg:text-7xl">
          <RevealWords text="Precision Engineered" />
          {/* Rendered as a single animated element (not nested RevealWords) because a CSS
              animation on a descendant promotes it to its own compositing layer, which
              breaks background-clip: text on the ancestor and makes the gradient invisible. */}
          <motion.span
            className="block bg-clip-text text-transparent [background-image:var(--gradient-accent)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            Industrial Valves
          </motion.span>
          <RevealWords text="For Critical Applications" delay={0.36} />
        </h1>

        <motion.p
          className="mt-7 max-w-2xl text-lg leading-relaxed text-navy-foreground/85"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {COMPANY.name} manufactures and supplies reliable industrial valves designed for
          performance, durability and safety.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button asChild size="lg" className="group">
            <Link to="/contact">
              Request Quote
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/5 text-navy-foreground hover:bg-white/15 hover:text-navy-foreground"
          >
            <Link to="/products">Explore Products</Link>
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {TRUST.map((t, i) => (
            <motion.div
              key={t}
              className="flex items-center gap-2 text-sm font-medium text-navy-foreground/90"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 + i * 0.09 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-6 flex justify-center text-navy-foreground/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
          <MousePointerClick className="h-3.5 w-3.5" /> Scroll
        </span>
      </motion.div>
    </section>
  );
}
