import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import { eventPackages, packageById, type EventPackage } from '../data/packages';
import { eventTypes } from '../data/events';
import { brand, eventQuoteMessage } from '../data/brand';
import { siteConfig } from '../config/site.config';
import { isEnabled } from '../config/features';
import ChoiceChips from '../components/ChoiceChips';
import Mark from '../components/Mark';
import PackageCard from '../components/packages/PackageCard';
import PackageModal from '../components/packages/PackageModal';
import TestimonialsSection from '../components/TestimonialsSection';
import WhatsAppCTA from '../components/WhatsAppCTA';
import { useSeo } from '../seo/useSeo';

const ALL = 'todos';

export default function PackagesPage() {
  useSeo('/pacotes');
  const lenis = useLenis();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState(ALL);

  const openId = params.get('pacote');
  const selected = packageById(openId) ?? null;
  const guestsParam = Number(params.get('convidados'));
  const initialGuests = Number.isFinite(guestsParam) && guestsParam > 0 ? guestsParam : undefined;

  /** Só os tipos de evento que têm pacote. */
  const chips = useMemo(() => {
    const used = new Set(eventPackages.flatMap((pkg) => pkg.eventTypes));
    return [
      { id: ALL, label: 'Todos' },
      ...eventTypes.filter((type) => used.has(type.id)).map((type) => ({ id: type.id, label: type.label })),
    ];
  }, []);

  const visible = useMemo(
    () => eventPackages.filter((pkg) => filter === ALL || pkg.eventTypes.includes(filter)),
    [filter],
  );

  const open = (pkg: EventPackage) => {
    const next = new URLSearchParams(params);
    next.set('pacote', pkg.id);
    next.delete('convidados');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const close = () => {
    const next = new URLSearchParams(params);
    next.delete('pacote');
    next.delete('convidados');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollWithLenis(lenis, 0, true));
    return () => window.cancelAnimationFrame(frame);
  }, [lenis]);

  return (
    <main className="bg-ivory pt-[var(--header-h)]">
      <div className="container-page pb-16 pt-10 md:pt-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-olive-mid transition-colors hover:text-olive-deep"
        >
          <ArrowLeft size={16} weight="bold" />
          Voltar ao início
        </Link>

        <div className="mt-6 max-w-[48rem]">
          <div className="flex items-center gap-2">
            <Mark name="flor" />
            <h1 className="font-serif text-4xl font-medium leading-none text-text sm:text-5xl">
              Pacotes para eventos
            </h1>
          </div>
          <p className="mt-3 max-w-[56ch] font-sans text-sm leading-relaxed text-text-muted">
            Combinações prontas para cada tipo de evento. Escolha o pacote, informe o número de
            convidados e veja a composição{siteConfig.packages.showPrices ? ' e a estimativa de valor' : ''}.
            A {brand.name} confirma tudo pelo WhatsApp.
          </p>
          {brand.eventMinimumGuests > 0 && (
            <p className="mt-2 font-sans text-sm text-text-muted">
              Eventos a partir de {brand.eventMinimumGuests} pessoas · prazo mínimo de {brand.leadTimeHours} horas.
            </p>
          )}
        </div>

        <ChoiceChips
          className="mt-8"
          label="Filtrar por tipo de evento"
          chips={chips}
          value={filter}
          onChange={setFilter}
          size="sm"
        />

        <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((pkg) => (
            <li key={pkg.id}>
              <PackageCard pkg={pkg} onOpen={open} />
            </li>
          ))}
        </ul>
        {visible.length === 0 && (
          <p className="mt-6 font-sans text-sm text-text-muted">Nenhum pacote para este tipo de evento ainda.</p>
        )}

        <section aria-label="Outros caminhos" className="mt-16 grid gap-6 border-t border-beige pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="font-serif text-2xl font-medium text-text">Não achou o pacote ideal?</h2>
            <p className="mt-2 max-w-[56ch] font-sans text-sm leading-relaxed text-text-muted">
              Para eventos, o cardápio também pode ser personalizado: conte como vai ser o evento ou monte a
              mesa item por item.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isEnabled('quoteWizard') ? (
              <Link
                to="/orcamento"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-5 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid"
              >
                Pedir orçamento
                <ArrowRight size={16} weight="bold" />
              </Link>
            ) : (
              <WhatsAppCTA message={eventQuoteMessage} label="Pedir orçamento" size="md" />
            )}
            {isEnabled('table') && (
              <Link
                to="/monte-sua-mesa"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-olive-deep"
              >
                Monte sua mesa
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
          </div>
        </section>
      </div>

      <TestimonialsSection />

      <PackageModal pkg={selected} onClose={close} initialGuests={initialGuests} />
    </main>
  );
}
