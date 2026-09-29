import { useEffect, useState } from "react";

/**
 * True once mounted in a viewport at least `px` wide. Always false during SSR, so use it
 * only to switch effects on or off, never to change layout (layout belongs in CSS).
 */
export function useMinWidth(px: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [px]);

  return matches;
}
