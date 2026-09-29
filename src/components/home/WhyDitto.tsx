import { Heart, ListBullets, Lock, User, type Icon } from "@phosphor-icons/react";

import { Picture } from "@/components/site/Picture";
import { Reveal } from "@/components/site/Reveal";

const benefits: { title: string; body: string; icon: Icon }[] = [
  {
    title: "Everything in one place",
    body: "Your GP, your specialist, your midwife. All in one app. Every appointment, every summary, every document. No matter where you get care.",
    icon: ListBullets,
  },
  {
    title: "Sharing is caring",
    body: "Your loved ones can receive and share care updates safely, with end-to-end encryption, within Ditto. You stay in control of who's in your Care Circle.",
    icon: Heart,
  },
  {
    title: "Private by design",
    body: "Your data lives on your device. When Ditto processes a recording, it uses secure EU servers, then deletes it immediately. We can't read your summaries.",
    icon: Lock,
  },
  {
    title: "Built for you",
    body: "Patient portals are built for hospitals. Ditto is built for you, and the people around you.",
    icon: User,
  },
];

export function WhyDitto() {
  return (
    <section className="mx-auto w-full max-w-[1600px] overflow-hidden">
      <div className="flex flex-col gap-5 bg-soft-sand px-3 py-10 md:h-[1000px] md:px-5 md:py-[100px] lg:h-auto lg:px-10 lg:py-20">
        <Reveal className="flex flex-col items-center gap-2 text-center md:items-start md:gap-4 md:text-left">
          <h2 className="text-heading-1-s text-ditto-midnight md:text-heading-2-l">
            Why Ditto works
          </h2>
          <p className="max-w-[520px] text-body-18-medium text-balance text-atlantic-blue">
            Built for you, with care.
          </p>
        </Reveal>

        <div className="flex flex-col gap-1.5 md:grid md:grid-cols-2 lg:flex lg:flex-row lg:items-center">
          {/* The photo sits at 90% over near-black, as on live. */}
          <Reveal className="relative h-[350px] overflow-hidden rounded-2xl bg-[#0A0A0A] md:order-1 md:h-full lg:order-0 lg:h-auto lg:flex-1 lg:self-stretch">
            <Picture
              name="why-ditto"
              alt="Hands holding a phone with the Ditto app on a yellow sofa"
              sizes="(min-width: 1200px) 50vw, (min-width: 810px) 50vw, 100vw"
              className="absolute inset-0 size-full rounded-2xl object-cover opacity-90"
            />
          </Reveal>

          <Reveal className="flex flex-col justify-center gap-1.5 rounded-2xl bg-light-gray p-1.5 md:order-0 md:self-start lg:flex-1">
            {benefits.map(({ title, body, icon: Icon }) => (
              <div key={title} className="flex flex-col gap-3 rounded-xl bg-soft-sand p-6">
                <Icon size={22} className="text-ditto-midnight" />
                <div className="flex flex-col">
                  <h3 className="text-heading-5 text-ditto-midnight">{title}</h3>
                  <p className="text-body-16-medium text-atlantic-blue">{body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
