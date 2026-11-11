import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { X, Trash, ArrowRight } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { useOrder } from '../context/OrderContext';
import { linePrice, menuLine, type MenuLine } from '../data/offers';
import QuantitySlider from './QuantitySlider';
import Photo from './Photo';

function OrderRow({
  line,
  leaving,
  fresh,
  reduce,
  onRemove,
  onGone,
}: {
  line: MenuLine;
  leaving: boolean;
  fresh: boolean;
  reduce: boolean;
  onRemove: (id: string) => void;
  onGone: (id: string) => void;
}) {
  const { getQuantity, setItemQuantity } = useOrder();
  const quantity = getQuantity(line.key) ?? line.min;
  const rowRef = useRef<HTMLLIElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onGoneRef = useRef(onGone);
  const shouldEnter = useRef(fresh && !reduce);
  const exitStarted = useRef(false);
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const transition = `height 380ms ${ease}, opacity 320ms ${ease}`;
  onGoneRef.current = onGone;
  const [motionStyle, setMotionStyle] = useState<CSSProperties>(() =>
    fresh && !reduce
      ? { height: 0, opacity: 0, transition }
      : { transition },
  );

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !shouldEnter.current) return;
    const height = content.offsetHeight;
    const timer = window.setTimeout(() => {
      shouldEnter.current = false;
      setMotionStyle({ height, opacity: 1, transition });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [transition]);

  useEffect(() => {
    if (!leaving || exitStarted.current) return;
    const row = rowRef.current;
    const content = contentRef.current;
    if (!row || !content || reduce) {
      exitStarted.current = true;
      onGoneRef.current(line.key);
      return;
    }
    exitStarted.current = true;
    const height = content.offsetHeight;
    setMotionStyle({ height, opacity: 1, transition });
    window.setTimeout(() => {
      setMotionStyle({ height: 0, opacity: 0, transition });
    }, 40);
    window.setTimeout(() => onGoneRef.current(line.key), 460);
  }, [leaving, reduce, line.key, transition]);

  return (
    <li
      ref={rowRef}
      className="overflow-hidden"
      style={motionStyle}
    >
      <div ref={contentRef} className="pb-3">
        <div className="rounded-sm border border-beige bg-cream p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm">
              <Photo
                src={line.image}
                alt={line.name}
                className="h-full w-full object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-medium leading-snug text-text">
                {line.name}
              </p>
              <p className="font-sans text-xs text-text-muted">{linePrice(line)}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(line.key)}
              disabled={leaving}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-text-muted transition-colors hover:text-olive-deep disabled:pointer-events-none"
              aria-label={`Remover ${line.name} da lista`}
            >
              <Trash size={15} weight="regular" />
            </button>
          </div>
          <div className="mt-3 border-t border-beige pt-3">
            <QuantitySlider
              min={line.min}
              max={line.max}
              value={quantity}
              label={line.quantityLabel}
              onChange={(next) => setItemQuantity(line.key, next)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

export default function OrderListPanel() {
  const {
    orderItems,
    removeFromOrder,
    clearOrder,
    isPanelOpen,
    closePanel,
    orderCount,
    getWhatsAppLink,
  } = useOrder();

  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState<string[]>([]);

  const shownIds = [...orderItems];
  for (const id of leaving) {
    if (!shownIds.includes(id)) shownIds.push(id);
  }
  const displayed = shownIds
    .map((id) => menuLine(id))
    .filter((line): line is MenuLine => Boolean(line));
  const showEmpty = orderCount === 0 && leaving.length === 0;
  const whatsappLink = getWhatsAppLink();
  const ease = [0.22, 1, 0.36, 1] as const;

  const requestRemove = (id: string) => {
    setLeaving((prev) => (prev.includes(id) ? prev : [...prev, id]));
    removeFromOrder(id);
  };

  const finishRemove = (id: string) => {
    setLeaving((prev) => prev.filter((item) => item !== id));
  };

  const requestClear = () => {
    setLeaving(orderItems);
    clearOrder();
  };

  useEffect(() => {
    if (isPanelOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isPanelOpen, closePanel]);

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(41,43,37,0.4)', backdropFilter: 'blur(3px)' }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Side panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Lista de interesse"
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-sm flex-col bg-ivory pb-[env(safe-area-inset-bottom)] shadow-xl pt-[env(safe-area-inset-top)]"
            initial={reduce ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-beige">
              <div>
                <h2 className="font-serif text-xl font-semibold text-text">Minha lista</h2>
                <div className="relative mt-0.5 h-4 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={orderCount}
                      className="font-sans text-xs text-text-muted"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease }}
                    >
                      {orderCount} {orderCount === 1 ? 'item selecionado' : 'itens selecionados'}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closePanel}
                className="w-9 h-9 flex items-center justify-center rounded-sm text-text-muted hover:text-olive-deep hover:bg-beige transition-colors"
                aria-label="Fechar lista de interesse"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Items */}
            <div data-lenis-prevent className="relative flex-1 overflow-y-auto p-5">
              <AnimatePresence initial={false}>
                {showEmpty && (
                  <motion.div
                    key="empty"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 py-12 text-center"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : 0.08, ease }}
                  >
                    <p className="font-serif text-xl text-text-muted">Lista vazia</p>
                    <p className="max-w-xs font-sans text-sm text-text-light">
                      Explore o cardápio e adicione os salgados que deseja consultar.
                    </p>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="mt-3 rounded-sm border border-beige px-5 py-2 font-sans text-sm font-medium text-olive-deep transition-colors hover:bg-beige"
                    >
                      Ver cardápio
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <ul className="flex flex-col">
                {displayed.map((line) => (
                    <OrderRow
                      key={line.key}
                      line={line}
                      leaving={leaving.includes(line.key)}
                      fresh={!reduce}
                      reduce={!!reduce}
                      onRemove={requestRemove}
                      onGone={finishRemove}
                    />
                ))}
              </ul>
            </div>

            {/* Footer actions */}
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                orderCount > 0 ? '' : 'pointer-events-none'
              }`}
              style={{ maxHeight: orderCount > 0 ? 280 : 0, opacity: orderCount > 0 ? 1 : 0 }}
              aria-hidden={orderCount === 0}
            >
              <div className="min-h-0 overflow-hidden">
              <div className="space-y-3 border-t border-beige p-5">
                <p className="font-sans text-xs text-text-muted leading-relaxed">
                  Envie sua consulta pelo WhatsApp. Valores e disponibilidade são confirmados no atendimento.
                </p>

                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={orderCount > 0 ? 0 : -1}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-olive-deep text-ivory font-sans text-sm font-semibold rounded-sm hover:bg-olive-mid active:scale-[0.98] transition-all"
                  >
                    Enviar consulta pelo WhatsApp
                    <ArrowRight size={16} weight="bold" />
                  </a>
                ) : (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-olive-deep/40 text-ivory font-sans text-sm font-semibold rounded-sm cursor-not-allowed"
                    >
                      Enviar consulta pelo WhatsApp
                    </button>
                    <p className="text-center font-sans text-sm text-text-muted">
                      O WhatsApp ainda não está configurado.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={requestClear}
                  tabIndex={orderCount > 0 ? 0 : -1}
                  className="w-full px-5 py-2.5 text-sm font-sans font-medium text-text-muted border border-beige rounded-sm hover:bg-beige hover:text-text transition-colors"
                >
                  Limpar lista
                </button>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
