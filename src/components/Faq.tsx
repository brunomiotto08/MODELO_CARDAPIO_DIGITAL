import { Plus } from '@phosphor-icons/react';
import { faqs } from '../seo/site';

export default function Faq() {
  return (
    <section id="perguntas-frequentes" aria-labelledby="faq-title" className="section-pad bg-ivory">
      <div className="container-page">
        <div className="max-w-[38rem]">
          <h2 id="faq-title" className="section-title text-text">
            Perguntas frequentes
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-text-muted">
            O que mais perguntam antes de encomendar. Para o resto, é só chamar no WhatsApp.
          </p>
        </div>

        <div className="mt-10 max-w-[48rem] border-t border-beige">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-beige">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-lg font-medium leading-snug text-text transition-colors hover:text-olive-deep [&::-webkit-details-marker]:hidden">
                <h3 className="font-serif text-lg font-medium leading-snug">{faq.question}</h3>
                <Plus
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-olive-deep transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-[62ch] pb-5 font-sans text-sm leading-relaxed text-text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
