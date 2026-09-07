import { motion, useScroll, useSpring } from "motion/react";

/** Thin gradient progress bar pinned under the header, tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 32, mass: 0.2 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-[2.5px] origin-left [background-image:var(--gradient-accent)]"
      style={{ scaleX }}
    />
  );
}
