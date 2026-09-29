import { motion } from "motion/react";
import { useId, useState } from "react";

import { Reveal } from "@/components/site/Reveal";

const faqs = [
  {
    question: "1. How does Ditto work in practice?",
    answer:
      "During an appointment, you ask whether you can record the conversation. Afterward, Ditto creates a clear summary you can revisit. You can also take photos of medical letters to get easy-to-understand explanations.",
  },
  {
    question: "2. When should I use Ditto?",
    answer:
      "Use Ditto before, during, and after appointments, especially when you want to remember details, understand medical language, or share information with people you trust.",
  },
  {
    question: "3. How do I share summaries with loved ones?",
    answer:
      "You can securely share your summaries via Ditto Loved Ones directly within Ditto. This uses end-to-end encryption. You can also use messaging apps. You decide what to share and with whom.",
  },
  {
    question: "4. What happens to my recordings and information?",
    answer:
      "Your data is stored securely and only on your device. You stay in control of your information.",
  },
  {
    question: "5. Is Ditto free to use?",
    answer: "Yes. Ditto is currently available for free to download and use.",
  },
  {
    question: "6. Can Ditto help if I don’t speak the language well?",
    answer:
      "Yes. Ditto translates medical documents and explanations into language you can understand, helping bridge communication gaps.",
  },
];

const ease = [0.44, 0, 0.56, 1] as const;

/**
 * One answer open at a time. Answers stay in the page (as on live, and for search engines)
 * and slide open over 0.5s while the icon turns half a turn; closed answers are inert.
 */
function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return (
    <ul className="flex flex-col gap-1.5">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <li key={faq.question} className="overflow-hidden rounded-[11px] bg-soft-sand">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left md:p-6"
              >
                <span className="text-faq-question text-ditto-midnight">{faq.question}</span>
                <motion.img
                  src="/assets/faq-plus.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="ml-5 size-5 shrink-0"
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.5, ease }}
                />
              </button>
            </h3>
            <motion.div
              id={`${id}-${i}`}
              className="overflow-hidden"
              initial={false}
              animate={{ height: isOpen ? "auto" : 0 }}
              transition={{ duration: 0.5, ease }}
              inert={!isOpen}
            >
              <p className="px-5 pb-6 text-faq-answer text-atlantic-blue md:pr-20 md:pl-6">
                {faq.answer}
              </p>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}

export function Faq() {
  return (
    <section className="mx-auto w-full max-w-[1600px]">
      <div className="bg-soft-sand px-3 py-10 md:px-5 md:py-[100px] lg:px-10 lg:py-20">
        <div className="flex flex-col gap-[30px] md:flex-row md:gap-20">
          <Reveal className="flex flex-col gap-2.5 text-center md:flex-1 md:gap-4 md:text-left">
            <h2 className="text-heading-2-m text-ditto-midnight">More about Ditto</h2>
            <p className="max-w-[520px] text-body-16-medium text-balance text-atlantic-blue">
              Answers to common questions about Ditto.
            </p>
          </Reveal>

          <Reveal className="rounded-2xl bg-pale-horizon p-1.5 md:flex-1">
            <FaqList />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
