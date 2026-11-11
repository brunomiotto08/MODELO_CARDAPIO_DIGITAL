import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import { ArrowLeft, ArrowRight, CaretDown } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { categories, categoryName, eventOffer } from '../data/catalog';
import { menuOffers, offerIsSelected, type MenuOffer } from '../data/offers';
import { useOrder } from '../context/OrderContext';
import Mark from '../components/Mark';
import WhatsAppCTA from '../components/WhatsAppCTA';
import OfferModal from '../components/OfferModal';
import OfferTile from '../components/OfferTile';
import { useSeo } from '../seo/useSeo';

export default function MenuPage() {
  useSeo('/cardapio');
  const { addLine, orderItems, getQuantity } = useOrder();
  const [category, setCategory] = useState('todos');
  const [shownCategory, setShownCategory] = useState('todos');
  const [fading, setFading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<MenuOffer | null>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const fadeTimer = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const tally = new Map<string, number>();
    for (const offer of menuOffers) {
      tally.set(offer.category, (tally.get(offer.category) ?? 0) + 1);
    }
    tally.set('todos', menuOffers.length);
    return tally;
  }, []);

  const visible = useMemo(() => {
    return menuOffers.filter((offer) => shownCategory === 'todos' || offer.category === shownCategory);
  }, [shownCategory]);

  const currentName = categoryName(category);

  const chooseCategory = (slug: string) => {
    setFilterOpen(false);
    if (slug === category) return;
    setCategory(slug);
    if (reduceMotion) {
      setShownCategory(slug);
      return;
    }
    if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    const grid = gridRef.current;
    const start = grid?.offsetHeight ?? 0;
    if (grid) grid.style.height = `${start}px`;
    setFading(true);
    fadeTimer.current = window.setTimeout(() => {
      setShownCategory(slug);
      window.requestAnimationFrame(() => {
        const node = gridRef.current;
        if (!node) return;
        node.style.height = 'auto';
        const next = node.offsetHeight;
        node.style.height = `${start}px`;
        void node.offsetHeight;
        window.requestAnimationFrame(() => {
          node.style.height = `${next}px`;
          setFading(false);
          window.setTimeout(() => {
            if (gridRef.current) gridRef.current.style.height = 'auto';
          }, 520);
        });
      });
      fadeTimer.current = null;
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollWithLenis(lenis, 0, true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [lenis]);

  const openOffer = (offer: MenuOffer) => {
    setSelected(offer);
  };

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

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mark name="flor" />
              <h1 className="font-serif text-4xl font-medium leading-none text-text sm:text-5xl">
                Cardápio
              </h1>
            </div>
            <p className="mt-3 max-w-[46ch] font-sans text-sm leading-relaxed text-text-muted">
              Salgados, tortas frias, canapés, terrines e tábuas de frios sob encomenda em Caxias do Sul. Pedidos avulsos, para retirar ou receber em casa. Toque em um item para escolher tamanho, sabor ou quantidade.
            </p>
            <p className="mt-5 font-sans text-sm text-text-muted">
              Prefere uma mesa para o evento?
            </p>
            <Link
              to="/monte-sua-mesa"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-5 py-2.5 font-sans text-sm font-semibold tracking-wide text-ivory transition-colors duration-200 hover:bg-olive-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-deep focus-visible:ring-offset-2"
            >
              Monte sua mesa
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
            <button
              type="button"
              className="flex w-full items-center justify-between border-b border-olive-deep py-3 lg:hidden"
              aria-expanded={filterOpen}
              aria-controls="menu-filtros"
              onClick={() => setFilterOpen((value) => !value)}
            >
              <span className="text-left">
                <span className="block font-sans text-[11px] uppercase tracking-[0.16em] text-text-muted">
                  Categoria
                </span>
                <span className="mt-1 block font-serif text-2xl leading-none text-text">{currentName}</span>
              </span>
              <CaretDown
                size={18}
                className={`text-olive-deep transition-transform ${filterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <nav
              id="menu-filtros"
              aria-label="Filtrar por categoria"
              className="hidden lg:block"
            >
              <p className="hidden font-sans text-[11px] uppercase tracking-[0.16em] text-text-muted lg:block">
                Categorias
              </p>
              <ul className="lg:mt-3 lg:border-t lg:border-beige">
                {categories.map((item) => {
                  const active = category === item.slug;
                  return (
                    <li key={item.slug} className="border-b border-beige">
                      <button
                        type="button"
                        onClick={() => chooseCategory(item.slug)}
                        aria-pressed={active}
                        className={`flex min-h-11 w-full items-center justify-between gap-3 py-2.5 text-left transition-colors ${
                          active ? 'text-olive-deep' : 'text-text-muted hover:text-text'
                        }`}
                      >
                        <span className={`font-serif text-lg leading-tight ${active ? 'font-medium' : ''}`}>
                          {item.name}
                        </span>
                        <span className="font-sans text-xs tabular-nums">{counts.get(item.slug) ?? 0}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  className="overflow-hidden border-b border-beige lg:hidden"
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ul>
                    {categories.map((item) => {
                      const active = category === item.slug;
                      return (
                        <li key={item.slug} className="border-b border-beige last:border-b-0">
                          <button
                            type="button"
                            onClick={() => chooseCategory(item.slug)}
                            aria-pressed={active}
                            className={`flex min-h-11 w-full items-center justify-between gap-3 py-2.5 text-left ${
                              active ? 'text-olive-deep' : 'text-text-muted'
                            }`}
                          >
                            <span className={`font-serif text-lg leading-tight ${active ? 'font-medium' : ''}`}>
                              {item.name}
                            </span>
                            <span className="font-sans text-xs tabular-nums">{counts.get(item.slug) ?? 0}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
        <div
          ref={gridRef}
          className="overflow-hidden transition-[height] duration-500"
          style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
          onTransitionEnd={(event) => {
            if (event.propertyName !== 'height' || !gridRef.current) return;
            gridRef.current.style.height = 'auto';
          }}
        >
        <ul
          className={`mt-6 grid grid-cols-2 gap-x-3 gap-y-6 transition-opacity duration-300 sm:grid-cols-3 lg:mt-0 lg:grid-cols-3 lg:gap-x-5 ${
            fading ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          {visible.map((offer) => (
            <li key={offer.id}>
              <OfferTile
                offer={offer}
                marked={offerIsSelected(offer, orderItems)}
                onOpen={openOffer}
              />
            </li>
          ))}
        </ul>
        </div>

        <section id="menu-eventos" className="mt-12 border-t border-beige pt-8">
          <h2 className="font-serif text-2xl font-medium text-text">{eventOffer.title}</h2>
          <p className="mt-3 max-w-[62ch] font-sans text-sm leading-relaxed text-text-muted">
            {eventOffer.types.join(', ')}. {eventOffer.note} {eventOffer.minimum}
          </p>
          <div className="mt-4">
            <WhatsAppCTA
              message="Olá! Gostaria de solicitar um orçamento para um evento com a Flor Alecrim."
              label="Solicitar orçamento"
              size="sm"
            />
          </div>
        </section>
          </div>
        </div>
      </div>

      <OfferModal
        offer={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={(line, quantity) => {
          addLine(line.key, quantity);
          setSelected(null);
        }}
        savedQuantity={getQuantity}
        selectedKeys={orderItems}
        confirmIdle="Adicionar à lista"
        confirmDone="Atualizar na lista"
        directConsult
      />
    </main>
  );
}
