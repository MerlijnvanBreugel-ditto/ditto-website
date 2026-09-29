import { Alarm, Brain, PhoneCall, type Icon } from "@phosphor-icons/react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { Grain } from "@/components/site/Grain";
import { Picture } from "@/components/site/Picture";
import { WordReveal } from "@/components/site/WordReveal";
import type { ImageName } from "@/lib/images.gen";
import { cn } from "@/lib/utils";

const cards: {
  title: string;
  body: string;
  icon: Icon;
  image: ImageName;
  alt: string;
  rotate: number;
  /** Sticky offset from the viewport top. */
  top: number;
  /** Card height on phone, where the card stacks and the image fills the rest. */
  phoneHeight: number;
  /** Height of the invisible layer (anchored to the track's bottom) that drives the scale. */
  trigger: number;
  className: string;
}[] = [
  {
    title: "Details fade",
    body: 'You walk out of the appointment and think: "Wait, what did they say?" the more serious the conversation, the harder it is to hold onto.',
    icon: Brain,
    image: "pain-details-fade",
    alt: "Parent in a busy kitchen with a child running past",
    rotate: -2,
    top: 200,
    phoneHeight: 359,
    trigger: 1670,
    className: "bg-sky-tint text-atlantic-blue",
  },
  {
    title: "It's hard to keep up",
    body: "Some health journeys are straightforward. Many aren't. Suddenly there are specialists, letters, test results, scattered across systems, written in language that wasn't meant for you.",
    icon: Alarm,
    image: "pain-keep-up",
    alt: "Person reading a thick book of notes",
    rotate: 2,
    top: 220,
    phoneHeight: 360,
    trigger: 1472,
    className: "bg-coastal-blue text-soft-sand",
  },
  {
    title: "Everyone wants to know",
    body: '"How did it go?" Your partner asks. Then your mother. Then your friend. Explaining what happened once is already hard. Repeating it for everyone is exhausting.',
    icon: PhoneCall,
    image: "pain-everyone-asks",
    alt: "Young man on the phone at sunset",
    rotate: -2,
    top: 300,
    phoneHeight: 382,
    trigger: 1180,
    className: "bg-atlantic-blue text-soft-sand",
  },
];

function Card({ card, index }: { card: (typeof cards)[number]; index: number }) {
  const trigger = useRef<HTMLDivElement>(null);
  // The first card shrinks while its trigger passes the viewport centre, the others while
  // theirs passes the viewport top. Each ends at 90%, keeping its tilt.
  const { scrollYProgress } = useScroll({
    target: trigger,
    offset: index === 0 ? ["start center", "end center"] : ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const Icon = card.icon;

  return (
    <>
      <div
        ref={trigger}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: card.trigger }}
      />
      <motion.article
        style={{
          rotate: card.rotate,
          scale,
          top: card.top,
          ["--phone-h" as string]: `${card.phoneHeight}px`,
        }}
        className={cn(
          "sticky z-[1] flex h-(--phone-h) w-full max-w-[690px] flex-col items-center gap-5 overflow-hidden rounded-[14px] p-10 md:h-[300px] md:flex-row",
          card.className,
        )}
      >
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-1">
          <Icon size={20} />
          <h3 className="text-heading-4">{card.title}</h3>
          <p className="text-body-14-medium">{card.body}</p>
        </div>
        <div className="relative w-full flex-1 overflow-hidden rounded-xl md:h-full md:w-auto">
          <Picture
            name={card.image}
            alt={card.alt}
            sizes="(min-width: 810px) 295px, calc(100vw - 120px)"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <Grain />
      </motion.article>
    </>
  );
}

export function PainPoints() {
  const section = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(false);
  const [lightTitle, setLightTitle] = useState(false);

  // The panel turns Deep Current from 50vh to 300vh past the section top. The title turns
  // Soft Sand at 50vh and stays so (it has scrolled away by the time the panel turns light).
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const el = section.current;
    if (!el) return;
    const past = -el.getBoundingClientRect().top / window.innerHeight;
    setDark(past >= 0.5 && past < 3);
    setLightTitle(past >= 0.5);
  });

  return (
    <>
      <section ref={section} className="relative flex flex-col items-center px-5">
        <div className="sticky top-0 z-[1] flex h-screen w-full items-center justify-center">
          <div aria-hidden className="absolute inset-y-0 -inset-x-5 bg-deep-current">
            <div
              className={cn(
                "size-full bg-soft-sand transition-opacity duration-300 ease-framer",
                dark && "opacity-0",
              )}
            />
          </div>
          <h2
            className={cn(
              "relative w-[350px] text-center text-display-pain transition-colors duration-300 ease-framer md:w-[443px]",
              lightTitle ? "text-soft-sand" : "text-deep-current",
            )}
          >
            <WordReveal text="Healthcare can feel overwhelming" variant="scale" />
          </h2>
        </div>

        <div className="relative flex h-[250vh] w-full max-w-[1280px] flex-col items-center justify-center">
          {cards.map((card, i) => (
            <Card key={card.title} card={card} index={i} />
          ))}
          <div aria-hidden className="h-[10vh] w-full" />
        </div>
        <div aria-hidden className="h-[10vh] w-full" />
      </section>
      <div aria-hidden className="h-[4vh]" />
    </>
  );
}
