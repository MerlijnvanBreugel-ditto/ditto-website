import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Lenis smooth scrolling (Framer "Lenis" with intensity 8). It drives the native scroll
 * position, so position: sticky and scroll-linked animations keep working.
 * Turned off when the visitor prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!enabled) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
