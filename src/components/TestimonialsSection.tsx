import { Quotes, Star } from '@phosphor-icons/react';
import { layoutExamples, testimonials } from '../data/testimonials';
import { eventTypeLabel } from '../data/events';
import { isEnabled } from '../config/features';
import Mark from './Mark';

const sourceLabel = { google: 'Google', instagram: 'Instagram', whatsapp: 'WhatsApp' } as const;

/** Lista real; exemplos só no `npm run dev` para conferir o layout. */
const items = testimonials.length ? testimonials : import.meta.env.DEV ? layoutExamples : [];
const isExample = testimonials.length === 0;

export default function TestimonialsSection({ className = 'bg-cream' }: { className?: string }) {
  if (!isEnabled('testimonials') || items.length === 0) return null;

  return (
    <section aria-label="Depoimentos de clientes" className={`section-pad ${className}`}>
      <div className="container-page">
        <h2 className="section-title flex items-center gap-3 text-text">
          Quem já recebeu
          <Mark name="flor" />
        </h2>
        {isExample && (
          <p className="mt-3 font-sans text-xs text-text-muted">
            Modo de desenvolvimento: exemplos de layout. Esta seção some no site publicado até haver depoimentos reais.
          </p>
        )}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={`${item.name}-${item.text.slice(0, 12)}`} className="flex flex-col border border-beige bg-ivory p-5">
              <Quotes size={22} weight="fill" className="text-sage" aria-hidden="true" />
              {item.rating ? (
                <p className="mt-3 flex gap-0.5 text-olive-deep" aria-label={`${item.rating} de 5 estrelas`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={14} weight={index < (item.rating ?? 0) ? 'fill' : 'regular'} aria-hidden="true" />
                  ))}
                </p>
              ) : null}
              <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-text">{item.text}</blockquote>
              <p className="mt-4 font-sans text-xs text-text-muted">
                <span className="font-semibold text-text">{item.name}</span>
                {item.eventType && <> · {eventTypeLabel(item.eventType)}</>}
                {item.source && <> · via {sourceLabel[item.source]}</>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
