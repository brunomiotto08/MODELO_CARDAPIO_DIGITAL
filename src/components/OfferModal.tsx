import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Plus, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { MenuLine, MenuOffer, OfferChoice } from '../data/offers';
import { defaultChoices, linePrice } from '../data/offers';
import { buildOrderMessage, buildWhatsAppLink } from '../data/brand';
import Photo from './Photo';
import QuantitySlider from './QuantitySlider';

type OfferModalProps = {
  offer: MenuOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (line: MenuLine, quantity: number) => void;
  savedQuantity: (key: string) => number | undefined;
  selectedKeys: readonly string[];
  confirmIdle: string;
  confirmDone: string;
  directConsult?: boolean;
};

function offerVariants(offer: MenuOffer): MenuLine[] {
  const lines: MenuLine[] = [];
  const walk = (index: number, choices: Record<string, string>) => {
    if (index >= offer.axes.length) {
      lines.push(offer.resolve(choices));
      return;
    }
    const axis = offer.axes[index];
    for (const section of axis.sections) {
      for (const choice of section.choices) {
        walk(index + 1, { ...choices, [axis.id]: choice.id });
      }
    }
  };
  walk(0, {});
  return lines;
}

const flavorHoldMs = 70;

function choiceGridClass(choices: OfferChoice[]): string {
  const hasDetail = choices.some((choice) => choice.detail);
  const short = choices.every((choice) => choice.label.length <= 18 && !choice.detail);
  if (choices.length >= 4) return 'mt-1.5 grid grid-cols-2 gap-1.5';
  if (choices.length === 3 && short) return 'mt-1.5 grid grid-cols-3 gap-1.5';
  if (choices.length === 2 && !hasDetail) return 'mt-1.5 grid grid-cols-2 gap-1.5';
  return 'mt-1.5 grid gap-1.5';
}

export default function OfferModal({
  offer,
  isOpen,
  onClose,
  onConfirm,
  savedQuantity,
  selectedKeys,
  confirmIdle,
  confirmDone,
  directConsult = false,
}: OfferModalProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [choiceOffer, setChoiceOffer] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (offer && choiceOffer !== offer.id) {
    setChoiceOffer(offer.id);
    setChoices(defaultChoices(offer));
  }

  const activeChoices = offer && choiceOffer === offer.id ? choices : offer ? defaultChoices(offer) : {};
  const line = offer ? offer.resolve(activeChoices) : null;
  const lineRef = useRef(line);
  lineRef.current = line;
  const shownKeyRef = useRef(line?.key ?? null);
  const outDoneRef = useRef(false);
  const holdRef = useRef(0);
  const [shownLine, setShownLine] = useState(line);
  const [reveal, setReveal] = useState<'idle' | 'out' | 'in'>('idle');
  const variants = useMemo(() => (offer ? offerVariants(offer) : []), [offer]);

  useEffect(() => {
    const next = lineRef.current;
    if (!next) return;
    if (shownKeyRef.current === null) {
      shownKeyRef.current = next.key;
      setShownLine(next);
      return;
    }
    if (next.key === shownKeyRef.current) return;
    if (reduce) {
      shownKeyRef.current = next.key;
      setShownLine(next);
      setReveal('idle');
      return;
    }
    if (reveal === 'out') return;
    outDoneRef.current = false;
    setReveal('out');
  }, [line?.key, reduce, reveal]);

  useEffect(() => () => window.clearTimeout(holdRef.current), []);

  const onRevealEnd = (event: { propertyName: string; target: EventTarget | null; currentTarget: EventTarget | null }) => {
    if (event.propertyName !== 'opacity' || event.target !== event.currentTarget) return;
    const phase = (event.currentTarget as HTMLElement).dataset.phase;
    if (phase === 'out') {
      if (outDoneRef.current) return;
      outDoneRef.current = true;
      const latest = lineRef.current;
      if (latest) {
        shownKeyRef.current = latest.key;
        setShownLine(latest);
      }
      window.clearTimeout(holdRef.current);
      holdRef.current = window.setTimeout(() => {
        const incoming = lineRef.current;
        if (incoming) {
          shownKeyRef.current = incoming.key;
          setShownLine(incoming);
        }
        setReveal('in');
      }, flavorHoldMs);
      return;
    }
    if (phase === 'in') setReveal('idle');
  };
  const showDescription = variants.some((item) => item.description.trim().length > 0);
  const showNotes = variants.some((item) => item.notes.length > 0);
  const shown = shownLine ?? line;
  const ready = Boolean(line && offer?.axes.every((axis) => activeChoices[axis.id]));

  useEffect(() => {
    if (!isOpen || !line) return;
    const saved = savedQuantity(line.key);
    setQuantity(saved && saved >= line.min && saved <= line.max ? saved : line.min);
    // A linha nova zera a quantidade; o objeto `line` muda a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, line?.key, line?.min, line?.max, savedQuantity]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const already = Boolean(line && selectedKeys.includes(line.key));
  const safeQuantity = line ? Math.min(line.max, Math.max(line.min, quantity)) : 1;
  const consultLink = line
    ? buildWhatsAppLink(buildOrderMessage([`${line.name} — ${safeQuantity} un.`]))
    : null;

  return (
    <AnimatePresence>
      {isOpen && offer && line && shown && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={offer.name}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          style={{ backgroundColor: 'rgba(41,43,37,0.45)' }}
        >
          <motion.div
            ref={panelRef}
            data-lenis-prevent
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-lg bg-ivory shadow-xl sm:max-w-xl sm:rounded-md"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-sm bg-ivory/90 text-text-muted transition-colors hover:bg-beige hover:text-olive-deep"
              aria-label="Fechar"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="flex items-center gap-3 pb-1 pl-4 pr-12 pt-4">
              <div
                className="flavor-reveal relative h-14 w-14 shrink-0 overflow-hidden"
                data-phase={reveal}
                onTransitionEnd={onRevealEnd}
              >
                <Photo
                  src={shown.image}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: shown.imagePosition ?? 'center' }}
                  sizes="56px"
                  loading="eager"
                />
              </div>
              <div className="min-w-0">
                <p className="flavor-reveal font-sans text-[11px] uppercase tracking-[0.14em] text-olive-mid" data-phase={reveal}>
                  {offer.name}
                </p>
                <div className="grid">
                  {variants.map((variant) => (
                    <h2
                      key={variant.key}
                      aria-hidden
                      className="invisible col-start-1 row-start-1 self-start font-serif text-xl font-medium leading-tight text-text"
                    >
                      {variant.name}
                    </h2>
                  ))}
                  <h2
                    className="flavor-reveal col-start-1 row-start-1 self-start font-serif text-xl font-medium leading-tight text-text"
                    data-phase={reveal}
                  >
                    {shown.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 px-4 pb-4">
              {showDescription && (
                <div className="grid">
                  {variants.map((variant) => (
                    <p
                      key={variant.key}
                      aria-hidden
                      className="invisible col-start-1 row-start-1 line-clamp-2 self-start font-sans text-xs leading-snug text-text-muted"
                    >
                      {variant.description}
                    </p>
                  ))}
                  <p
                    className="flavor-reveal col-start-1 row-start-1 line-clamp-2 self-start font-sans text-xs leading-snug text-text-muted"
                    data-phase={reveal}
                  >
                    {shown.description}
                  </p>
                </div>
              )}

                {offer.axes.map((item) => (
                  <fieldset key={item.id} className="min-w-0">
                    <legend className="font-sans text-xs font-medium text-text">{item.label}</legend>
                    {item.sections.map((section) => (
                      <div key={section.label || item.id}>
                        {section.label && (
                          <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-text-muted">
                            {section.label}
                          </p>
                        )}
                        <div className={choiceGridClass(section.choices)}>
                          {section.choices.map((choice) => {
                            const selected = activeChoices[item.id] === choice.id;
                            return (
                              <button
                                key={choice.id}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setChoices((current) => ({ ...current, [item.id]: choice.id }))}
                                className={`border px-2.5 py-1.5 text-left transition-colors ${
                                  selected
                                    ? 'border-olive-deep bg-olive-deep text-ivory'
                                    : 'border-beige bg-ivory text-text hover:border-olive-deep'
                                }`}
                              >
                                <span className="block font-sans text-[13px] font-medium leading-snug">{choice.label}</span>
                                {choice.detail && (
                                  <span className={`mt-0.5 block font-sans text-[11px] leading-snug ${selected ? 'text-ivory/80' : 'text-text-muted'}`}>
                                    {choice.detail}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </fieldset>
                ))}

                {showNotes && (
                  <div className="grid">
                    {variants.map((variant) => (
                      <p
                        key={variant.key}
                        aria-hidden
                        className="invisible col-start-1 row-start-1 self-start font-sans text-[11px] leading-snug text-text-muted"
                      >
                        {variant.notes.join(' ')}
                      </p>
                    ))}
                    <p
                      className="flavor-reveal col-start-1 row-start-1 self-start font-sans text-[11px] leading-snug text-text-muted"
                      data-phase={reveal}
                    >
                      {shown.notes.join(' ')}
                    </p>
                  </div>
                )}

                <div className="grid gap-3 border-t border-beige pt-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <QuantitySlider
                    dense
                    min={line.min}
                    max={line.max}
                    value={safeQuantity}
                    onChange={setQuantity}
                    label={line.quantityLabel}
                  />
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-stretch">
                    <p className="flavor-reveal font-sans text-sm font-semibold text-olive-deep" data-phase={reveal} aria-live="polite">
                      {linePrice(shown)}
                    </p>
                    <button
                      type="button"
                      disabled={!ready}
                      onClick={() => onConfirm(line, safeQuantity)}
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-olive-deep px-4 py-2 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {already ? <Check size={15} weight="bold" /> : <Plus size={15} weight="bold" />}
                      {already ? confirmDone : confirmIdle}
                    </button>
                  </div>
                </div>
                {directConsult && consultLink && (
                  <a
                    href={consultLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex font-sans text-xs font-medium text-olive-mid underline-offset-2 hover:text-olive-deep hover:underline"
                  >
                    Consultar este item
                  </a>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
