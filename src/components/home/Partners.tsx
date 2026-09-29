import { ArrowRight } from "@phosphor-icons/react";

import { Button } from "@/components/site/Button";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const partners = [
  { name: "Juvoly", src: "/assets/partner-juvoly.svg" },
  { name: "Menzis", src: "/assets/partner-menzis.svg" },
  { name: "HartKliniek", src: "/assets/partner-hartkliniek-320.webp" },
  { name: "CZ", src: "/assets/partner-cz.svg" },
  { name: "UMCG", src: "/assets/partner-umcg-320.webp" },
  // Fills the second row of the three-column grid on phone.
  { name: "Ikazia", src: "/assets/partner-ikazia.svg", phoneOnly: true },
];

export function Partners() {
  return (
    <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-3 py-10 md:px-5 md:py-20 lg:px-10">
      <Reveal className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-col gap-3 text-center md:flex-1 md:text-left">
          <h2 className="text-heading-3-m text-balance text-ditto-midnight">
            Our partners in the medical field
          </h2>
          <p className="max-w-[520px] text-body-16-medium text-balance text-atlantic-blue">
            We work closely together with healthcare organisations to help more and more patients
            across the Netherlands.
          </p>
        </div>
        <div className="pt-2">
          <Button href="https://www.dittocare.com/professionals" icon={ArrowRight}>
            Ditto for professionals
          </Button>
        </div>
      </Reveal>

      <Reveal>
        <ul className="grid grid-cols-3 gap-1.5 rounded-2xl bg-pale-horizon p-1.5 md:grid-cols-5">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[11px] bg-soft-sand",
                partner.phoneOnly && "md:hidden",
              )}
            >
              <img
                src={partner.src}
                alt={partner.name}
                width={102}
                height={102}
                loading="lazy"
                className="size-20 object-contain lg:size-[102px]"
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
