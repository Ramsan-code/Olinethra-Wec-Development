import { testimonialsData, TestimonialItem } from "@/data/testimonials"
import { Quote } from "lucide-react"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-b border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            [ CLIENT FEEDBACK ]
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            Client Partnerships & Feedback
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Direct feedback from technical leaders and business operators who partner with Olinethra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((item: TestimonialItem) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Quote className="h-6 w-6 text-neutral-400" />
                  <span className="rounded border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {item.projectScope}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white font-mono text-xs font-bold dark:bg-neutral-100 dark:text-neutral-900">
                  {item.authorName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                    {item.authorName}
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono">
                    {item.authorRole}, <span className="text-neutral-700 dark:text-neutral-300">{item.companyName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
