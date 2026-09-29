import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { Grain } from "@/components/site/Grain";
import { WordReveal } from "@/components/site/WordReveal";
import type { ImageName } from "@/lib/images.gen";
import { images } from "@/lib/images.gen";
import { cn } from "@/lib/utils";

type Story =
  | { kind: "video"; name: string; label: string; video: string; poster: ImageName }
  | {
      kind: "review";
      name: string;
      store: "App Store" | "Google Play";
      title: string;
      quote: string;
    };

const stories: Story[] = [
  {
    kind: "video",
    name: "Henriëte",
    label: "Uses Ditto for her complex allergies",
    video: "/assets/story-henriete.mp4",
    poster: "poster-henriete",
  },
  {
    kind: "review",
    name: "Jet",
    store: "Google Play",
    title: "A Must-Have for Every Parent!",
    quote:
      "During my pregnancy, I used Ditto to keep track of all my appointments. But when our son was born, it became truly indispensable! Everything the doctor said I could easily read back and share with my partner, so he was always informed. A recommendation for every (expecting) mom!",
  },
  {
    kind: "review",
    name: "Els",
    store: "App Store",
    title: "This app inventor deserves an award",
    quote:
      '"This app is brilliant. Super clear. It gives an explanation of medical terms and an overview of what you recorded. Or it can explain medical letters you have scanned. Super useful, highly recommended!"',
  },
  {
    kind: "video",
    name: "Joke",
    label: "Uses Ditto at the Physiotherapist",
    video: "/assets/story-joke.mp4",
    poster: "poster-joke",
  },
  {
    kind: "review",
    name: "Freek",
    store: "App Store",
    title: "Medical Conversation? Use Ditto!",
    quote:
      "I have been using the Ditto app for several months to keep track of my father's medical journey. Every conversation we have with any medical professional is recorded with this app, summarized, and ensures we have a wonderful report.",
  },
  {
    kind: "review",
    name: "Michel",
    store: "Google Play",
    title: "Convenient for the Family!",
    quote:
      "Amazing app, so clear for loved ones and summarizing difficult, lengthy conversations. A true recommendation for anyone with family/friends who need care. Calmly listen back and read what has been said.",
  },
];

const storeIcon = {
  "App Store": "/assets/store-app-store-297.webp",
  "Google Play": "/assets/store-google-play-297.webp",
};

const poster = (name: ImageName) => {
  const { widths } = images[name];
  return `/assets/${name}-${widths[widths.length - 1]}.webp`;
};

function StoryCard({ story }: { story: Story }) {
  if (story.kind === "video") {
    return (
      <article className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-atlantic-blue p-6">
        {/* Live never starts these videos, so only the poster frame shows; nothing is downloaded. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.6)_0%,black_32.3944%,black_82%,rgba(0,0,0,0.6)_100%)]">
          <video
            src={story.video}
            poster={poster(story.poster)}
            preload="none"
            muted
            loop
            playsInline
            aria-label={`${story.name} talks about using Ditto`}
            className="size-full object-cover"
          />
        </div>
        <div className="relative flex flex-col gap-0.5">
          <p className="text-body-16-medium whitespace-nowrap text-soft-sand">{story.name}</p>
          <p className="text-body-14-medium text-light-stone">{story.label}</p>
        </div>
      </article>
    );
  }
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl bg-atlantic-blue p-6">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-heading-4 text-soft-sand">{story.title}</h3>
        <p className="max-w-[600px] text-body-16-medium text-soft-sand">{story.quote}</p>
      </div>
      <div className="flex items-center gap-3">
        <img
          src={storeIcon[story.store]}
          alt={`Review from the ${story.store}`}
          width={87}
          height={87}
          loading="lazy"
          className="size-[87px] shrink-0 rounded-[23px] object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-16-medium whitespace-nowrap text-soft-sand">{story.name}</p>
          <p className="text-body-14-medium text-pale-horizon">{story.store}</p>
        </div>
      </div>
    </article>
  );
}

export function SuccessStories() {
  // Framer "Slideshow": loops, moves one card per click, can be dragged, no autoplay.
  const [viewport, embla] = useEmblaCarousel({ loop: true, align: "start", duration: 32 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => embla && setSelected(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const arrow =
    "flex size-[34px] items-center justify-center overflow-hidden rounded-[40px] bg-white/15";

  return (
    <section className="mx-auto w-full max-w-[1600px]">
      <div className="bg-soft-sand px-3 pt-10 pb-[60px] md:px-5 md:py-20 lg:px-10">
        <div className="relative flex flex-col gap-20 overflow-hidden rounded-2xl bg-deep-current px-3 pt-10 pb-20 md:gap-10 md:p-10 lg:p-[60px]">
          <Grain />
          <h2 className="relative text-heading-2-m text-balance text-soft-sand">
            <WordReveal text="Success stories" variant="blur" />
          </h2>

          <div
            className="relative"
            role="region"
            aria-roledescription="carousel"
            aria-label="Success stories"
          >
            <div ref={viewport} className="overflow-hidden">
              <ul className="flex h-[380px]">
                {stories.map((story, i) => (
                  <li
                    key={story.name}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${stories.length}`}
                    className="mr-1.5 h-full w-full shrink-0 md:w-[calc(50%-3px)] lg:w-[calc(33.3333%-4px)]"
                  >
                    <StoryCard story={story} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="absolute -top-12 right-0 flex gap-3">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => embla?.scrollPrev()}
                className={arrow}
              >
                <img src="/assets/arrow-left.svg" alt="" width={34} height={34} />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => embla?.scrollNext()}
                className={arrow}
              >
                <img src="/assets/arrow-right.svg" alt="" width={34} height={34} />
              </button>
            </div>

            <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 md:hidden">
              {stories.map((story, i) => (
                <button
                  key={story.name}
                  type="button"
                  aria-label={`Scroll to page ${i + 1}`}
                  onClick={() => embla?.scrollTo(i)}
                  className={cn(
                    "py-2 pr-[3px] pl-[3px]",
                    i === 0 && "pl-2",
                    i === stories.length - 1 && "pr-2",
                  )}
                >
                  <span
                    className={cn(
                      "block size-2 rounded-full bg-white transition-opacity",
                      selected === i ? "opacity-100" : "opacity-50",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
