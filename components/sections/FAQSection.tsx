import { faqsData } from "@/data/faqs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <section id="faq" className="border-b border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            [ FREQUENTLY ASKED QUESTIONS ]
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            Everything You Need to Know
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Clear answers regarding our engineering workflow, services, project timelines, and internship program.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 md:p-8 dark:border-neutral-800 dark:bg-neutral-950">
          <Accordion type="single" collapsible className="w-full">
            {faqsData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base font-bold text-neutral-950 dark:text-neutral-50 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
