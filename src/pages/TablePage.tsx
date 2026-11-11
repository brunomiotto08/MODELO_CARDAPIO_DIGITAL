import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import { scrollWithLenis } from '../components/SmoothScroll';
import { products } from '../data/catalog';
import { menuLine, menuOffers, offerIsSelected, type MenuOffer } from '../data/offers';
import { tableSuggestions } from '../data/table';
import { useTable } from '../context/TableContext';
import type { Product } from '../types';
import Mark from '../components/Mark';
import MesaPiece from '../components/MesaPiece';
import OfferModal from '../components/OfferModal';
import OfferTile from '../components/OfferTile';
import TableStage from '../components/TableStage';
import TableListPanel from '../components/TableListPanel';
import QuantityCalculator from '../components/QuantityCalculator';
import { isEnabled } from '../config/features';
import { decodeTable, encodeTable, SHARE_PARAM, type SharedTable } from '../lib/shareTable';
import { useSeo } from '../seo/useSeo';

function samePlateSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const chosen = new Set(left);
  return right.every((id) => chosen.has(id));
}

export default function TablePage() {
  useSeo('/monte-sua-mesa');
  const [listOpen, setListOpen] = useState(false);
  const [sheet, setSheet] = useState(
    () => window.matchMedia('(max-width: 1099px)').matches,
  );
  const [compact, setCompact] = useState(
    () => window.matchMedia('(max-width: 959px)').matches,
  );
  const [pinned, setPinned] = useState(false);
  const [pinHeight, setPinHeight] = useState(0);
  const pinSentinel = useRef<HTMLDivElement>(null);
  const pinBar = useRef<HTMLDivElement>(null);
  const lenis = useLenis(() => {
    const sentinel = pinSentinel.current;
    if (!sentinel || !window.matchMedia('(max-width: 959px)').matches) return;
    const limit = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
    setPinned(sentinel.getBoundingClientRect().top < limit - 1);
  });
  const [offer, setOffer] = useState<MenuOffer | null>(null);
  const {
    plateIds,
    sweets,
    flowers,
    placeLine,
    removePlate,
    applyPlates,
    getQuantity,
    setSweets,
    setFlowers,
    loadTable,
    count,
  } = useTable();
  const [params, setParams] = useSearchParams();
  const sharedParam = isEnabled('shareTable') ? params.get(SHARE_PARAM) : null;
  const [pendingShared, setPendingShared] = useState<SharedTable | null>(null);

  const currentTable = { plateIds, quantities: Object.fromEntries(plateIds.map((id) => [id, getQuantity(id) ?? 0])), sweets, flowers };
  const currentRef = useRef(currentTable);
  currentRef.current = currentTable;

  // Mesa compartilhada (?m=...): carrega direto se a mesa atual está vazia; senão, pergunta.
  useEffect(() => {
    if (!sharedParam) return;
    const shared = decodeTable(sharedParam);
    const current = currentRef.current;
    const empty = current.plateIds.length === 0 && !current.sweets && !current.flowers;
    const clearParam = () => {
      const next = new URLSearchParams(params);
      next.delete(SHARE_PARAM);
      setParams(next, { replace: true, preventScrollReset: true });
    };
    if (!shared) {
      clearParam();
      return;
    }
    if (empty) {
      loadTable(shared);
      clearParam();
      return;
    }
    if (encodeTable(shared) === encodeTable(current)) {
      clearParam();
      return;
    }
    setPendingShared(shared);
    // Só reage ao parâmetro da URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedParam]);

  const resolveShared = (accept: boolean) => {
    if (accept && pendingShared) loadTable(pendingShared);
    setPendingShared(null);
    const next = new URLSearchParams(params);
    next.delete(SHARE_PARAM);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const openList = () => {
    if (!sheet) setListOpen(true);
  };

  useEffect(() => {
    const sheetMedia = window.matchMedia('(max-width: 1099px)');
    const compactMedia = window.matchMedia('(max-width: 959px)');
    const apply = () => {
      setSheet(sheetMedia.matches);
      setCompact(compactMedia.matches);
    };
    apply();
    sheetMedia.addEventListener('change', apply);
    compactMedia.addEventListener('change', apply);
    return () => {
      sheetMedia.removeEventListener('change', apply);
      compactMedia.removeEventListener('change', apply);
    };
  }, []);

  useEffect(() => {
    const sentinel = pinSentinel.current;
    if (!sentinel || !compact) {
      setPinned(false);
      return;
    }
    const sync = () => {
      const limit = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      setPinned(sentinel.getBoundingClientRect().top < limit - 1);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, [compact]);

  useEffect(() => {
    const bar = pinBar.current;
    if (!bar || !pinned) return;
    const measure = () => setPinHeight(bar.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [pinned]);

  const chooseKit = (productIds: string[]) => {
    applyPlates(productIds);
    if (productIds.length > 0) openList();
  };

  const toggleExtra = (current: boolean, setValue: (value: boolean) => void) => {
    if (!current) openList();
    setValue(!current);
  };

  const menu = useMemo(
    () => products.filter((product) => product.availableForDisplay),
    [],
  );

  const plates = useMemo(() => {
    const next: { id: string; name: string }[] = [];
    for (const id of plateIds) {
      const line = menuLine(id);
      if (line) next.push({ id: line.key, name: line.name });
    }
    return next;
  }, [plateIds]);

  const listCount = count + (sweets ? 1 : 0) + (flowers ? 1 : 0);

  useEffect(() => {
    document.documentElement.classList.toggle('table-list-open', listOpen);
    return () => document.documentElement.classList.remove('table-list-open');
  }, [listOpen]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollWithLenis(lenis, 0, true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [lenis]);

  return (
    <main className="bg-ivory pb-16 pt-[var(--header-h)]">
      <div className="container-page table-layout pt-6">
      <div className="table-pane">
        <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-sm font-medium text-olive-mid transition-colors hover:text-olive-deep"
        >
          <ArrowLeft size={16} weight="bold" />
          Voltar ao início
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Mark name="flor" />
              <h1 className="font-serif text-3xl font-medium leading-none text-text sm:text-4xl">
                Monte sua mesa
              </h1>
            </div>
            <p className="mt-2 max-w-[46ch] font-sans text-sm leading-relaxed text-text-muted">
              Escolha quantos itens quiser, de todo o cardápio. A mesa é uma prévia: quantidades,
              valores e a data se confirmam no WhatsApp.
            </p>
          </div>
          <Link
            to="/cardapio"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-olive-deep"
          >
            Cardápio avulso
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div ref={pinSentinel} className="table-pin-sentinel" aria-hidden="true" />
          <div ref={pinBar} className={`table-sticky${pinned ? ' is-pinned' : ''}`}>
            <TableStage plates={plates} onRemove={removePlate} />
            <div className="table-caption">
              <p className="font-sans text-sm text-text-muted">
                {count === 0
                  ? 'A mesa espera o primeiro item.'
                  : 'Toque em um prato para tirá-lo da mesa.'}
              </p>
              <button
                type="button"
                className={`table-list-tab${listOpen ? ' is-hidden' : ''}`}
                onClick={() => setListOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={listOpen}
                aria-hidden={listOpen}
                tabIndex={listOpen ? -1 : 0}
              >
                <span>A mesa</span>
                <span className="table-list-count">{listCount}</span>
              </button>
            </div>
          </div>
          {pinned && <div className="table-pin-hold" style={{ height: pinHeight }} />}
        </div>
        </div>
      </div>

      <div className="table-menu">
        <div>
          <div>
            {pendingShared && (
              <section aria-label="Mesa compartilhada" className="mb-6 border border-olive-deep bg-cream p-4">
                <h2 className="font-serif text-lg font-medium text-text">Você abriu uma mesa compartilhada</h2>
                <p className="mt-1 font-sans text-sm leading-relaxed text-text-muted">
                  Ela tem {pendingShared.plateIds.length} {pendingShared.plateIds.length === 1 ? 'item' : 'itens'}. Carregar substitui a mesa que você já montou.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => resolveShared(true)}
                    className="rounded-sm bg-olive-deep px-4 py-2 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid"
                  >
                    Carregar esta mesa
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveShared(false)}
                    className="rounded-sm border border-beige px-4 py-2 font-sans text-sm font-semibold text-text transition-colors hover:border-olive-deep"
                  >
                    Manter a minha
                  </button>
                </div>
              </section>
            )}

            <QuantityCalculator
              className="mb-8"
              keys={plateIds}
              applyLabel="Aplicar quantidades na mesa"
              applyDefaultLabel="Montar a mesa com esta sugestão"
              onApply={(items) => {
                applyPlates(
                  items.map((item) => item.key),
                  Object.fromEntries(items.map((item) => [item.key, item.quantity])),
                );
                openList();
              }}
            />

            <section aria-label="Sugestões prontas" className="mb-8">
              <h2 className="font-serif text-2xl font-medium text-text">Sugestões prontas</h2>
              <p className="mt-2 max-w-[42ch] font-sans text-sm leading-relaxed text-text-muted">
                Combinações que já funcionam juntas. Escolha uma e a mesa se monta. Depois você tira
                ou acrescenta o que quiser.
              </p>
              <ul className="table-suggestions">
                {tableSuggestions.map((suggestion) => {
                  const active = samePlateSet(plateIds, suggestion.productIds);
                  const items = suggestion.productIds
                    .map((id) => menu.find((product) => product.id === id))
                    .filter((product): product is Product => Boolean(product));
                  return (
                    <li key={suggestion.id} className="table-suggestion-item">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => chooseKit(suggestion.productIds)}
                        className={`table-kit${active ? ' is-on' : ''}`}
                      >
                        <span className="table-kit-name">{suggestion.name}</span>
                        <span className="table-kit-serves">{suggestion.serves}</span>
                        <span className="table-kit-pieces" aria-hidden="true">
                          {items.map((product) => (
                            <MesaPiece key={product.id} id={product.id} />
                          ))}
                        </span>
                        <span className="table-kit-names">
                          {items.map((product) => (
                            <span key={product.id}>{product.name}</span>
                          ))}
                        </span>
                      </button>
                      {active && (
                        <button
                          type="button"
                          className="table-suggestion-clear"
                          aria-label={`Desmarcar ${suggestion.name}`}
                          onClick={() => applyPlates([])}
                        >
                          <X size={18} weight="bold" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-label="Cardápio" className="mb-8">
              <h2 className="font-serif text-2xl font-medium text-text">Cardápio</h2>
              <p className="mt-2 max-w-[42ch] font-sans text-sm leading-relaxed text-text-muted">
                Toque em um item para escolher sabor, tamanho ou quantidade.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6">
                {menuOffers.map((item) => (
                  <li key={item.id}>
                    <OfferTile
                      offer={item}
                      marked={offerIsSelected(item, plateIds)}
                      onOpen={setOffer}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="Itens sob consulta" className="border-t border-beige pt-6">
              <h2 className="font-serif text-2xl font-medium text-text">Também na mesa</h2>
              <p className="mt-2 max-w-[42ch] font-sans text-sm leading-relaxed text-text-muted">
                Doces e arranjo floral saem prontos. Entram no pedido sem valor fechado.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={sweets}
                  onClick={() => toggleExtra(sweets, setSweets)}
                  className={`rounded-sm border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                    sweets
                      ? 'border-olive-deep bg-olive-deep text-ivory'
                      : 'border-beige text-text hover:border-olive-deep'
                  }`}
                >
                  Doces
                </button>
                <button
                  type="button"
                  aria-pressed={flowers}
                  onClick={() => toggleExtra(flowers, setFlowers)}
                  className={`rounded-sm border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                    flowers
                      ? 'border-olive-deep bg-olive-deep text-ivory'
                      : 'border-beige text-text hover:border-olive-deep'
                  }`}
                >
                  Arranjo floral
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>

      <TableListPanel open={listOpen} onClose={() => setListOpen(false)} />
      <OfferModal
        offer={offer}
        isOpen={Boolean(offer)}
        onClose={() => setOffer(null)}
        onConfirm={(line, quantity) => {
          placeLine(line.key, quantity);
          setOffer(null);
          setListOpen(true);
        }}
        savedQuantity={getQuantity}
        selectedKeys={plateIds}
        confirmIdle="Colocar na mesa"
        confirmDone="Atualizar na mesa"
      />
    </main>
  );
}
