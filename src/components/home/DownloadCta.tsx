import { Grain } from "@/components/site/Grain";
import { PhoneMockup } from "@/components/site/PhoneMockup";
import { Picture } from "@/components/site/Picture";
import { Reveal } from "@/components/site/Reveal";

const DOWNLOAD = "https://dittocare.go.link/kMQxf";

const stores = [
  { label: "Download on the App Store", badge: "/assets/badge-app-store.svg", width: 100 },
  { label: "Get it on Google Play", badge: "/assets/badge-google-play.svg", width: 116 },
];

export function DownloadCta() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-3 py-5 md:px-5 md:pt-20 md:pb-10 lg:px-10 lg:py-20">
      <div className="md:pb-10 lg:pb-0">
        <div className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-deep-current px-5 pt-[50px] md:h-[971px] md:gap-10 md:px-10 md:pt-20 lg:h-[600px] lg:items-start lg:justify-center lg:gap-5 lg:px-20 lg:py-5">
          <Grain />
          <Picture
            name="cta-shape"
            alt=""
            sizes="(min-width: 1200px) 77vw, 125vw"
            className="pointer-events-none absolute top-[258px] left-1/2 w-full -translate-x-1/2 object-cover object-top opacity-80 md:top-[506px] md:left-[-12.284%] md:h-[990px] md:w-[125%] md:translate-x-0 lg:top-20 lg:left-[42%] lg:aspect-[1.54508] lg:h-auto lg:w-[77%] lg:-translate-x-1/2"
          />

          <Reveal
            y={50}
            className="relative flex w-full flex-col items-center gap-11 md:flex-1 md:gap-8 lg:flex-none lg:flex-row lg:gap-8"
          >
            <div className="flex flex-col items-center gap-4 md:gap-10 lg:flex-1 lg:items-start">
              <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                <h2 className="text-heading-3-m text-soft-sand md:text-heading-2-m">
                  Record your first appointment tomorrow
                </h2>
                <p className="max-w-[465px] text-body-16-medium text-soft-sand">
                  Download Ditto, create an account in under a minute, and bring it to your next
                  visit. It's free. No trial, no catch.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
                {stores.map((store) => (
                  <a
                    key={store.label}
                    href={DOWNLOAD}
                    target="_blank"
                    rel="noopener"
                    className="flex h-[52px] w-[180px] items-center justify-center rounded-[308px] bg-sky-tint px-2.5 py-1.5"
                  >
                    <img src={store.badge} alt={store.label} width={store.width} height={40} />
                  </a>
                ))}
              </div>
            </div>

            {/* The phone is taller than its slot and is cut off by the panel's bottom edge. */}
            <div className="relative h-[749px] w-full shrink-0 md:h-[331px] md:w-[354px]">
              <PhoneMockup
                screen="screen-recording"
                alt="Ditto app recording an appointment"
                sizes="354px"
                screenClassName="rounded-[48px]"
                className="absolute inset-x-0 top-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
