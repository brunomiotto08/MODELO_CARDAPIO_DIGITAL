import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowLeft, ArrowRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import ChoiceChips from '../components/ChoiceChips';
import Dialog from '../components/Dialog';
import Mark from '../components/Mark';
import Photo from '../components/Photo';
import TestimonialsSection from '../components/TestimonialsSection';
import WhatsAppCTA from '../components/WhatsAppCTA';
import { galleryItems, galleryStyles, type GalleryItem } from '../data/gallery';
import { packageById } from '../data/packages';
import { brand, eventQuoteMessage } from '../data/brand';
import { isEnabled } from '../config/features';
import { useSeo } from '../seo/useSeo';

const ALL = 'todos';

/** Destino do "Quero um evento assim": pacote ligado, senão orçamento, senão nada. */
function inspiredLink(item: GalleryItem): { to: string; label: string } | null {
  const pkg = isEnabled('packages') ? packageById(item.packageId) : undefined;
  if (pkg) return { to: `/pacotes?pacote=${pkg.id}`, label: `Ver o pacote ${pkg.name}` };
  if (isEnabled('quoteWizard')) {
    return { to: item.eventType ? `/orcamento?tipo=${item.eventType}` : '/orcamento', label: 'Quero um evento assim' };
  }
  return null;
}

export default function GalleryPage() {
  useSeo('/eventos-realizados');
  const lenis = useLenis();
  const [filter, setFilter] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const chips = useMemo(() => {
    const used = new Set(galleryItems.map((item) => item.style));
    return [{ id: ALL, label: 'Todos' }, ...galleryStyles.filter((style) => used.has(style.id))];
  }, []);

  const visible = useMemo(
    () => galleryItems.filter((item) => filter === ALL || item.style === filter),
    [filter],
  );

  const current = openIndex !== null ? visible[openIndex] : null;
  const step = (delta: number) =>
    setOpenIndex((index) => (index === null ? null : (index + delta + visible.length) % visible.length));

  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
    // `step` só depende do tamanho da lista visível.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, visible.length]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollWithLenis(lenis, 0, true));
    return () => window.cancelAnimationFrame(frame);
  }, [lenis]);

  const link = current ? inspiredLink(current) : null;

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
            <h1 className="font-serif text-4xl font-medium leading-none text-text sm:text-5xl">Eventos realizados</h1>
          </div>
          <p className="mt-3 max-w-[56ch] font-sans text-sm leading-relaxed text-text-muted">
            Mesas e coquetéis montados pela {brand.name}, em fotos reais. Toque em uma foto para ver de perto e pedir
            um evento parecido.
          </p>
        </div>

        <ChoiceChips
          className="mt-8"
          label="Filtrar fotos"
          chips={chips}
          value={filter}
          onChange={(id) => {
            setFilter(id);
            setOpenIndex(null);
          }}
          size="sm"
        />

        <ul className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4 lg:gap-4">
          {visible.map((item, index) => (
            <li key={item.id} className="mb-3 break-inside-avoid lg:mb-4">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-haspopup="dialog"
                aria-label={`Ampliar: ${item.alt}`}
                className="group block w-full overflow-hidden bg-beige"
              >
                <Photo
                  src={item.src}
                  alt={item.alt}
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
                />
              </button>
            </li>
          ))}
        </ul>

        <section aria-label="Pedir um evento" className="mt-14 grid gap-6 border-t border-beige pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="font-serif text-2xl font-medium text-text">Gostou de alguma mesa?</h2>
            <p className="mt-2 max-w-[56ch] font-sans text-sm leading-relaxed text-text-muted">
              Conte como vai ser o seu evento e a equipe monta a proposta.
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
            {isEnabled('packages') && (
              <Link to="/pacotes" className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-olive-deep">
                Ver pacotes
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
          </div>
        </section>
      </div>

      <TestimonialsSection />

      <Dialog
        open={current !== null}
        onClose={() => setOpenIndex(null)}
        label={current?.alt ?? 'Foto'}
        widthClass="sm:max-w-3xl"
        panelClass="bg-olive-deep"
      >
        {current && (
          <figure>
            <div className="relative flex max-h-[72dvh] items-center justify-center bg-olive-deep">
              <Photo
                key={current.id}
                src={current.src}
                alt={current.alt}
                className="max-h-[72dvh] w-auto max-w-full object-contain"
                sizes="(max-width: 768px) 100vw, 48rem"
                loading="eager"
              />
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Foto anterior"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-olive-deep transition-colors hover:bg-ivory"
                  >
                    <CaretLeft size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Próxima foto"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-olive-deep transition-colors hover:bg-ivory"
                  >
                    <CaretRight size={18} weight="bold" />
                  </button>
                </>
              )}
            </div>
            <figcaption className="flex flex-col gap-3 bg-ivory px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-sans text-sm text-text">
                {current.caption ?? current.alt}
                <span className="ml-2 font-sans text-xs tabular-nums text-text-muted">
                  {(openIndex ?? 0) + 1}/{visible.length}
                </span>
              </span>
              {link && (
                <Link
                  to={link.to}
                  onClick={() => setOpenIndex(null)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-olive-deep px-4 py-2 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid"
                >
                  {link.label}
                  <ArrowRight size={14} weight="bold" />
                </Link>
              )}
            </figcaption>
          </figure>
        )}
      </Dialog>
    </main>
  );
}
