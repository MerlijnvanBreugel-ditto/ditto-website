import { DeviceMobile } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Button } from "@/components/site/Button";
import { Grain } from "@/components/site/Grain";
import { LogoSlideshow } from "@/components/site/LogoSlideshow";
import { Marquee } from "@/components/site/Marquee";
import { Picture } from "@/components/site/Picture";
import { RatingBadge } from "@/components/site/RatingBadge";
import { useMinWidth } from "@/hooks/use-min-width";

const DOWNLOAD = "https://dittocare.go.link/kMQxf";
const PRESS = "https://www.dittocare.com/press";

// Width and height are the logo's slot in the strip; the image is contained within it.
const press = [
  { name: "AD", src: "/assets/press-ad-187.webp", w: 45, h: 45 },
  { name: "NPO Radio 1", src: "/assets/press-npo-radio-1-296.webp", w: 60, h: 38 },
  { name: "Innovation Origins", src: "/assets/press-innovation-origins-435.webp", w: 70, h: 38 },
  { name: "Margriet", src: "/assets/press-margriet-373.webp", w: 82, h: 33 },
  { name: "Quote", src: "/assets/press-quote-414.webp", w: 52, h: 38 },
  {
    name: "Het Parool",
    src: "/assets/press-het-parool-414.webp",
    w: 83,
    h: 31,
    href: "https://www.parool.nl/nederland/metastase-cardiomyopathie-nieuwe-app-moet-patient-helpen-arts-te-begrijpen~b89d716c/",
  },
  { name: "Skipr", src: "/assets/press-skipr-458.webp", w: 56, h: 37 },
  { name: "Trouw", src: "/assets/press-trouw-768.webp", w: 56, h: 37, desktopOnly: true },
];

type PressLogo = (typeof press)[number];

function PressLink({ logo, hidden }: { logo: PressLogo; hidden: boolean }) {
  const external = "href" in logo;
  return (
    <a
      href={external ? logo.href : PRESS}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      tabIndex={hidden ? -1 : undefined}
      className="block"
    >
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.w}
        height={logo.h}
        loading="eager"
        className="object-contain"
        style={{ width: logo.w, height: logo.h }}
      />
    </a>
  );
}

function QrTile() {
  return (
    <div className="flex size-[156px] items-center justify-center rounded-[20px] bg-ditto-midnight">
      <img
        src="/assets/qr-download-500.webp"
        alt="QR code to download the Ditto app"
        width={121}
        height={118}
        className="h-[118px] w-[121px] rounded-[5px] object-cover"
      />
    </div>
  );
}

export function Hero() {
  const frame = useRef<HTMLDivElement>(null);
  const desktop = useMinWidth(1200);
  const reduced = useReducedMotion();
  const zoom = desktop && !reduced;

  // Desktop only: the photo zooms out from 1.2 to 1 as its frame scrolls fully into view.
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, (p) => (zoom ? 1.2 - 0.2 * p : 1));

  return (
    <section className="mx-auto w-full max-w-[1600px] bg-soft-sand">
      <div className="flex flex-col gap-10 px-3 pt-[100px] md:px-5 md:pt-[120px] lg:px-10 lg:pt-[140px]">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-6 lg:items-center">
          <div className="flex flex-col text-center md:flex-1 md:text-left lg:gap-[10px]">
            <h1 className="text-heading-1-s text-balance text-ditto-midnight">
              Clarity when <br className="md:hidden" />
              it matters most
            </h1>
            <p className="max-w-[800px] text-body-18-medium text-balance text-atlantic-blue">
              Record every medical appointment. Get a clear summary in language you understand.
              Share it with the people who matter. Because care is something you carry together.
            </p>
          </div>

          {/* Phone: button and rating under the copy. */}
          <Button href={DOWNLOAD} icon={DeviceMobile} className="md:hidden">
            Download App
          </Button>
          <RatingBadge className="md:hidden" />

          {/* Tablet and desktop: QR code with the button beneath it. */}
          <div className="hidden h-[198px] w-[157px] shrink-0 flex-col items-center justify-between md:flex">
            <QrTile />
            <Button href={DOWNLOAD} icon={DeviceMobile} className="w-full">
              Download App
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
          <div className="flex items-end gap-[100px]">
            <Marquee
              items={press}
              render={(logo, hidden) => <PressLink logo={logo} hidden={hidden} />}
              className="hidden h-[51px] flex-1 md:block"
            />
            <LogoSlideshow
              items={press.filter((logo) => !logo.desktopOnly)}
              render={(logo, hidden) => <PressLink logo={logo} hidden={hidden} />}
              className="h-[46px] w-full md:hidden"
            />
            <RatingBadge className="hidden shrink-0 md:flex" />
          </div>

          <div
            ref={frame}
            className="relative h-[300px] overflow-hidden rounded-2xl md:aspect-[1.6] md:h-auto"
          >
            <motion.div style={{ scale }} className="absolute inset-0">
              <Picture
                name="hero"
                phone="hero-phone"
                alt="Hands holding a phone showing the Ditto app with a summary ready and new care updates"
                sizes="(min-width: 1600px) 1520px, (min-width: 1200px) calc(100vw - 80px), (min-width: 810px) calc(100vw - 40px), calc(100vw - 24px)"
                priority
                className="size-full object-cover"
              />
            </motion.div>
            <Grain />
          </div>
        </div>
      </div>
    </section>
  );
}
