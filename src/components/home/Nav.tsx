import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/site/Button";
import { LanguageSelect } from "@/components/site/LanguageSelect";
import { TextRoll } from "@/components/site/TextRoll";

const SITE = "https://www.dittocare.com";
const DOWNLOAD = "https://dittocare.go.link/kMQxf";

const links = [
  { label: "Professionals", href: `${SITE}/professionals` },
  { label: "About", href: `${SITE}/about` },
  { label: "Privacy", href: `${SITE}/privacy` },
  { label: "News", href: `${SITE}/news` },
  { label: "Support", href: `${SITE}/support` },
];

const menuLinks = [
  { label: "Home", href: `${SITE}/` },
  { label: "Professionals", href: `${SITE}/professionals` },
  { label: "Privacy", href: `${SITE}/privacy` },
  { label: "About", href: `${SITE}/about` },
  { label: "News", href: `${SITE}/news` },
  { label: "Support", href: `${SITE}/support` },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/ditto.care?igsh=MXJjM29od2hpZnJvaQ==" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dittocare/" },
];

const ease = [0.44, 0, 0.56, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 md:px-5 lg:px-10">
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-ditto-night/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          />
        )}
      </AnimatePresence>

      <nav className="relative w-full max-w-[1520px] rounded-b-2xl bg-pale-horizon p-1.5 backdrop-blur-[8px]">
        <div className="flex h-[33px] items-center justify-between gap-2">
          <a href={`${SITE}/`} className="flex shrink-0 items-center md:pl-2">
            <img src="/assets/ditto-logo.svg" alt="Ditto" width={63} height={19} />
          </a>

          <div className="hidden flex-1 items-center justify-end pl-4 md:flex">
            <ul className="flex items-center gap-4 pr-[5px]">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="group block text-label-14 text-ditto-midnight">
                    <TextRoll>{link.label}</TextRoll>
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-[10px] mr-[9px] flex">
              <LanguageSelect variant="icon" />
            </div>
            <Button href={DOWNLOAD}>Download App</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="phone-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-[33px] items-center justify-center rounded-[25px] bg-soft-sand text-ditto-midnight md:hidden"
          >
            {open ? <X size={18} /> : <List size={20} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="phone-menu"
              key="menu"
              className="overflow-hidden md:hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.8, ease } }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease } }}
                className="flex flex-col gap-10 px-1.5 pt-8 pb-1.5"
              >
                <ul className="flex flex-col gap-3">
                  {menuLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group block pb-3 text-footer-email text-ditto-midnight"
                      >
                        <TextRoll>{link.label}</TextRoll>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <a
                      href="mailto:info@ditto.care"
                      className="group block text-[18px] leading-[1.3] font-bold tracking-[-0.04em] text-ditto-midnight"
                    >
                      <TextRoll>info@ditto.care</TextRoll>
                    </a>
                    <a
                      href="tel:+31851155421"
                      className="group block text-label-14 text-ditto-midnight"
                    >
                      <TextRoll>+31 85 115 5421</TextRoll>
                    </a>
                    <LanguageSelect variant="pill" />
                  </div>
                  <ul className="flex items-center gap-3">
                    {socials.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="group block text-label-14 text-ditto-midnight"
                        >
                          <TextRoll>{link.label}</TextRoll>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
