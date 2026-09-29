import { motion } from "motion/react";
import { useEffect, useState } from "react";

const WORD = "Ditto";

/**
 * Framer preloader (3s). The letters of "Ditto" rise from below with a blur while the word
 * floats up to the centre; then the Midnight panel collapses upwards, carrying the word
 * off the top, and the overlay is removed. It renders on the server so the page is covered
 * from the first paint. Skipped (via CSS) when the visitor prefers reduced motion.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden className="preloader fixed inset-0 z-[9999]">
      <motion.div
        className="absolute inset-x-0 top-0 h-full bg-ditto-midnight"
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{ delay: 2, duration: 0.8, ease: [0.8, 0, 0.3, 1] }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.p
            className="text-display-preloader whitespace-nowrap text-light-stone"
            initial={{ y: 640, opacity: 0 }}
            animate={{ y: [640, 0, -27], opacity: [0, 1, 1] }}
            transition={{
              duration: 2.7,
              times: [0, 0.74, 1],
              ease: [
                [0.66, 0, 0.12, 1],
                [0.44, 0, 0.56, 1],
              ],
            }}
          >
            {[...WORD].map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 270, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.42 + i * 0.1, duration: 0.33, ease: [0.65, 0, 0.35, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
