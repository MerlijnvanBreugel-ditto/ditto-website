import { motion, type TargetAndTransition } from "motion/react";

const from: Record<"scale" | "blur", TargetAndTransition> = {
  scale: { opacity: 0, scale: 0.9 },
  blur: { opacity: 0, filter: "blur(10px)", y: 10 },
};
const to: Record<"scale" | "blur", TargetAndTransition> = {
  scale: { opacity: 1, scale: 1 },
  blur: { opacity: 1, filter: "blur(0px)", y: 0 },
};

/**
 * Reveals a heading word by word the first time it scrolls into view.
 * `scale`: words fade in from 90% size. `blur`: words fade in from a 10px blur, rising 10px.
 */
export function WordReveal({
  text,
  variant,
  stagger = 0.05,
}: {
  text: string;
  variant: "scale" | "blur";
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true }}
      transition={{ staggerChildren: stagger }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: from[variant], shown: to[variant] }}
            transition={{ duration: 0.35, ease: [0.44, 0, 0.56, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}
