import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Framer "Ticker": items scroll left at a constant speed in a seamless loop, with faded edges.
 * The list is rendered three times; the copies are hidden from assistive tech.
 */
export function Marquee<T>({
  items,
  render,
  speed = 25,
  gap = 54,
  className,
}: {
  items: T[];
  /** Render one item. `hidden` is true for the decorative copies (make links untabbable). */
  render: (item: T, hidden: boolean) => ReactNode;
  /** Pixels per second. */
  speed?: number;
  gap?: number;
  className?: string;
}) {
  const first = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = first.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setDistance(el.offsetWidth + gap));
    observer.observe(el);
    return () => observer.disconnect();
  }, [gap]);

  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7.5%,black_92.5%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full w-max motion-reduce:animate-none",
          distance > 0 && "animate-marquee",
        )}
        style={{
          gap,
          ["--marquee-distance" as string]: `${distance}px`,
          animationDuration: `${distance / speed}s`,
        }}
      >
        {[0, 1, 2].map((copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? first : undefined}
            aria-hidden={copy > 0 || undefined}
            className="flex shrink-0 items-center"
            style={{ gap }}
          >
            {items.map((item, i) => (
              <li key={i} className="flex shrink-0 items-center">
                {render(item, copy > 0)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
