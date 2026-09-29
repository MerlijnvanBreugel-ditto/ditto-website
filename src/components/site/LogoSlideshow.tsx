import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Framer "Slideshow" as used for the phone press strip: four items per view, advancing one
 * item every 1.5s with an ease-out slide, looping forever.
 */
export function LogoSlideshow<T>({
  items,
  render,
  className,
}: {
  items: T[];
  render: (item: T, hidden: boolean) => ReactNode;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // After sliding past the first set, jump back to the identical position in it.
  const onTransitionEnd = () => {
    if (index >= items.length) {
      setAnimate(false);
      setIndex(index - items.length);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12.5%,black_87.5%,transparent)]",
        className,
      )}
    >
      <ul
        onTransitionEnd={onTransitionEnd}
        className={cn(
          "flex h-full gap-1.5",
          animate && "transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{ transform: `translateX(calc(${-index} * (25% + 1.5px)))` }}
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="flex w-[calc(25%-4.5px)] shrink-0 items-center justify-center"
          >
            {render(item, i >= items.length)}
          </li>
        ))}
      </ul>
    </div>
  );
}
