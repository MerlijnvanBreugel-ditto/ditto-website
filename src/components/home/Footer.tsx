import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Grain } from "@/components/site/Grain";
import { TextRoll } from "@/components/site/TextRoll";
import { useMinWidth } from "@/hooks/use-min-width";

const SITE = "https://www.dittocare.com";

const columns = [
  [
    { label: "Professionals", href: `${SITE}/professionals` },
    { label: "Press", href: `${SITE}/press` },
    { label: "Contact", href: `${SITE}/support` },
    { label: "Join us", href: "https://ditto.homerun.co/?lang=en" },
  ],
  [
    { label: "EU AI Act", href: `${SITE}/legal/eu-ai-act` },
    { label: "Terms & Conditions", href: `${SITE}/legal/terms-conditions` },
    { label: "Privacy Policy", href: `${SITE}/legal/privacy-policy` },
  ],
  [
    { label: "News", href: `${SITE}/news` },
    { label: "Instagram", href: "https://www.instagram.com/ditto.care?igsh=MXJjM29od2hpZnJvaQ==" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/dittocare/" },
  ],
];

function FooterLink({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className: string;
}) {
  const external = href.startsWith("http") && !href.startsWith(SITE);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`group block text-soft-sand ${className}`}
    >
      <TextRoll>{label}</TextRoll>
    </a>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMinWidth(1200);
  const reduced = useReducedMotion();
  const parallax = desktop && !reduced;

  // Desktop only: the content rises out from behind the section above. It starts 2/3 of the
  // footer's distance to the viewport top higher (at most 600px) and settles when the footer
  // reaches the top of the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, (p) =>
    parallax ? Math.max(-600, (-2 / 3) * window.innerHeight * (1 - p)) : 0,
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ditto-midnight lg:h-screen">
      <Grain />
      <motion.div
        style={{ y }}
        className="relative mx-auto flex max-w-[1600px] flex-col gap-[60px] px-3 pt-[60px] pb-[30px] md:gap-20 md:px-5 md:pt-20 lg:h-full lg:justify-between lg:gap-0 lg:px-10 lg:pt-[100px] lg:pb-5"
      >
        <div className="@container">
          <p className="text-[19.331cqw] leading-[0.9] font-medium tracking-[-0.06em] whitespace-nowrap text-soft-sand">
            Ditto Care(s)
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <p className="max-w-[520px] text-body-18-medium text-balance text-sky-tint">
            Whether you’re navigating an appointment, supporting someone you love, or exploring how
            Ditto can help, <span className="text-light-stone">we’re here for you.</span>
          </p>
          <div className="flex flex-col items-start gap-1.5">
            <FooterLink
              label="support@ditto.care"
              href="mailto:support@ditto.care"
              className="text-footer-email"
            />
            <FooterLink
              label="+31 85 115 5421"
              href="tel:+31851155421"
              className="text-footer-phone"
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-4">
          {columns.map((links, i) => (
            <ul key={i} className="flex flex-col gap-2 md:flex-1">
              {links.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} className="w-fit text-label-14" />
                </li>
              ))}
            </ul>
          ))}
          {/* Live has an empty "Designed by" row above the ©, which only shows as space on phone. */}
          <p className="mt-[23px] shrink-0 text-body-14-medium text-pale-horizon md:mt-0">
            © 2026 Ditto Care
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
