import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Fades an element in and lets it rise into place the first time it scrolls into view. */
export function Reveal({
  children,
  y = 40,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Distance in px the element rises from. */
  y?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0, duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
