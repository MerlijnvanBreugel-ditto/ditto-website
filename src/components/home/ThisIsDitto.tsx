import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PhoneMockup } from "@/components/site/PhoneMockup";
import { Reveal } from "@/components/site/Reveal";
import { useMinWidth } from "@/hooks/use-min-width";
import type { ImageName } from "@/lib/images.gen";
import { cn } from "@/lib/utils";

// `rowHeight`: on tablet and phone live gives the second and third card a fixed height
// (the first one fits its text), all centred in the 196px row.
const features: { title: string; body: string; rowHeight?: number }[] = [
  {
    title: "Summarise any medical appointment",
    body: "Every word from your consultation, waiting for you when you're ready. Listen back, reread, and never lose an important detail again.",
  },
  {
    title: "Prepare for what's next",
    body: "Ditto suggests questions for your next visit based on what was discussed. You show up ready, your doctor notices.",
    rowHeight: 172,
  },
  {
    title: "Invite those who matter",
    body: 'Invite the people who matter. They see your summaries, follow your journey, and can actually help. Instead of asking "how did it go?" and getting a half-remembered answer.',
    rowHeight: 148,
  },
];

// Desktop and the tablet/phone layout show different screenshots, as on live.
const screens: { desktop: ImageName; mobile: ImageName; alt: string }[] = [
  { desktop: "screen-check-up", mobile: "screen-gp", alt: "Ditto app: appointment summary" },
  { desktop: "screen-questions", mobile: "screen-questions", alt: "Ditto app: questions to ask" },
  { desktop: "screen-loved-ones", mobile: "screen-care-circle", alt: "Ditto app: Loved Ones" },
];

// Phone positions as the centre point in % of the stage, plus rotation. The front phone
// is the current step; earlier phones slide out to the left and fade.
type Slot = { left: number; top: number; rotate: number; opacity?: number };
const slots: Record<"desktop" | "mobile", { stack: Slot[]; exits: Slot[] }> = {
  desktop: {
    stack: [
      { left: 36.8056, top: 55.2066, rotate: -6 },
      { left: 54.8611, top: 58.5124, rotate: 9 },
      { left: 68.0029, top: 68.7603, rotate: 18 },
    ],
    exits: [
      { left: 11.8056, top: 58.1818, rotate: -13, opacity: 0 },
      { left: 11.8056, top: 58.1818, rotate: -13, opacity: 0 },
    ],
  },
  mobile: {
    stack: [
      { left: 47, top: 55, rotate: -6 },
      { left: 65, top: 59, rotate: 9 },
      { left: 78, top: 69, rotate: 18 },
    ],
    exits: [
      { left: 19, top: 62, rotate: -12, opacity: 0 },
      { left: 34, top: 61, rotate: -12, opacity: 0 },
    ],
  },
};

const spring = { type: "spring", bounce: 0.2, duration: 0.6 } as const;

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous feature" : "Next feature"}
      className="flex size-11 items-center justify-center rounded-full bg-deep-current p-2.5 transition-opacity duration-300 disabled:cursor-default disabled:opacity-50"
    >
      <svg
        viewBox="0 0 24 24"
        className={cn("size-6", direction === "prev" && "rotate-180")}
        aria-hidden
      >
        <path
          d="M 8.25 4.5 L 15.75 12 L 8.25 19.5"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function ThisIsDitto() {
  const [step, setStep] = useState(0);
  const desktop = useMinWidth(1200);
  const layout = slots[desktop ? "desktop" : "mobile"];

  // Tablet/phone: the card row slides to centre the current card, within the row's ends.
  const viewport = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState(0);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const { paddingLeft, paddingRight } = getComputedStyle(el);
      setRowWidth(el.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const card = 320;
  const gap = 8;
  const total = features.length * card + (features.length - 1) * gap;
  const rowShift = desktop
    ? 0
    : Math.min(0, Math.max(rowWidth - total, rowWidth / 2 - (step * (card + gap) + card / 2)));

  return (
    <section className="mx-auto flex h-[969px] w-full max-w-[1600px] flex-col items-center justify-center overflow-clip px-3 md:h-auto md:p-5 lg:justify-start lg:px-10 lg:py-0">
      <div aria-hidden className="hidden h-[4vh] lg:block" />
      <div className="flex w-full shrink-0 flex-col items-center overflow-hidden rounded-t-[30px] bg-soft-sand py-[50px] md:rounded-tl-[20px] md:rounded-tr-[40px] md:bg-linear-to-b md:from-light-stone md:to-soft-sand md:py-20 lg:h-[851px] lg:w-[1200px] lg:rounded-none lg:bg-none lg:px-10 lg:pt-[30px] lg:pb-0">
        <div className="flex w-full flex-col items-center gap-10 md:w-[90%] md:max-w-[1080px] lg:w-full lg:max-w-[1200px]">
          <div className="flex w-[90%] flex-col items-center gap-[7px] text-center md:w-1/2 md:gap-6 lg:gap-1.5">
            <h2 className="w-full text-heading-1-s text-ditto-midnight md:text-heading-2-m">
              This is Ditto
            </h2>
            <p className="max-w-[500px] text-body-16-medium text-deep-current">
              Everything from your doctor's visit, captured, clarified, and shared with the people
              who care about you.
            </p>
          </div>

          <div className="relative flex w-full flex-col lg:flex-row">
            <div className="relative h-[550px] w-full [mask-image:linear-gradient(to_top,transparent,black_30%)] lg:order-1 lg:h-[605px] lg:flex-[2]">
              {screens.map((screen, i) => {
                const slot =
                  i >= step
                    ? layout.stack[i - step]!
                    : layout.exits[Math.min(i, layout.exits.length - 1)]!;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[280px] lg:w-[300px]"
                    style={{ zIndex: 3 - i, x: "-50%", y: "-50%" }}
                    initial={false}
                    animate={{
                      left: `${slot.left}%`,
                      top: `${slot.top}%`,
                      rotate: slot.rotate,
                      opacity: slot.opacity ?? 1,
                    }}
                    transition={{ ...spring, opacity: { duration: 0.25, ease: "easeOut" } }}
                  >
                    <PhoneMockup
                      screen={desktop ? screen.desktop : screen.mobile}
                      alt={screen.alt}
                      sizes="300px"
                      className="w-full"
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute top-[510px] left-[53%] z-[3] flex -translate-x-1/2 gap-3">
              <Arrow direction="prev" disabled={step === 0} onClick={() => setStep((s) => s - 1)} />
              <Arrow
                direction="next"
                disabled={step === features.length - 1}
                onClick={() => setStep((s) => s + 1)}
              />
            </div>
            <div ref={viewport} className="px-3 lg:order-0 lg:flex-1 lg:px-0">
              <motion.ul
                className="flex h-[196px] w-max items-center gap-2 py-6 lg:h-auto lg:w-full lg:flex-col lg:gap-3 lg:py-10"
                animate={{ x: rowShift }}
                initial={false}
                transition={spring}
              >
                {features.map((feature, i) => (
                  <li key={feature.title} className="w-[320px] lg:w-full">
                    <Reveal y={16}>
                      <button
                        type="button"
                        onClick={() => setStep(i)}
                        aria-current={step === i ? "step" : undefined}
                        style={
                          feature.rowHeight
                            ? { ["--row-h" as string]: `${feature.rowHeight}px` }
                            : undefined
                        }
                        className={cn(
                          "flex w-full flex-col gap-2 overflow-hidden rounded-2xl bg-[#FDFDFD] p-5 text-left ring-1 ring-[#EFF1F3] transition-[background-color,box-shadow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ring-inset lg:bg-transparent lg:ring-transparent",
                          feature.rowHeight && "h-(--row-h) lg:h-auto",
                          step === i && "lg:bg-white lg:ring-[#E6E9EE]",
                        )}
                      >
                        <h3 className="text-heading-5 text-ditto-midnight">{feature.title}</h3>
                        <p className="text-body-16-medium text-deep-current opacity-60">
                          {feature.body}
                        </p>
                      </button>
                    </Reveal>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
