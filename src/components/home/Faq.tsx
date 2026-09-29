import * as Accordion from "@radix-ui/react-accordion";

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
            {/* One answer open at a time; the answer slides open and the icon turns half a turn. */}
            <Accordion.Root type="single" collapsible className="flex flex-col gap-1.5">
              {faqs.map((faq) => (
                <Accordion.Item
                  key={faq.question}
                  value={faq.question}
                  className="overflow-hidden rounded-[11px] bg-soft-sand"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between p-5 text-left md:p-6">
                      <span className="text-faq-question text-ditto-midnight">{faq.question}</span>
                      <img
                        src="/assets/faq-plus.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="ml-5 size-5 shrink-0 transition-transform duration-500 ease-framer group-data-[state=open]:rotate-180"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden duration-500 ease-framer data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <p className="px-5 pb-6 text-faq-answer text-atlantic-blue md:pr-20 md:pl-6">
                      {faq.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
