import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Trash, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { linePrice, menuLine, type MenuLine } from '../data/offers';
import { useTable } from '../context/TableContext';
import QuantitySlider from './QuantitySlider';
import MesaPiece from './MesaPiece';

function TableRow({
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
  const { getQuantity, setPlateQuantity } = useTable();
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
    <li ref={rowRef} className="overflow-hidden" style={motionStyle}>
      <div ref={contentRef} className="pb-3">
        <div className="rounded-sm border border-beige bg-cream p-3">
          <div className="flex items-center gap-3">
            <MesaPiece id={line.key} />
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-medium leading-snug text-text">{line.name}</p>
              <p className="font-sans text-sm text-text-muted">{linePrice(line)}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(line.key)}
              disabled={leaving}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-text-muted transition-colors hover:text-olive-deep disabled:pointer-events-none"
              aria-label={`Remover ${line.name} da mesa`}
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
              onChange={(next) => setPlateQuantity(line.key, next)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

type TableListPanelProps = {
  open: boolean;
  onClose: () => void;
};

export default function TableListPanel({ open, onClose }: TableListPanelProps) {
  const {
    plateIds,
    sweets,
    flowers,
    removePlate,
    applyPlates,
    setSweets,
    setFlowers,
    whatsappLink,
  } = useTable();
  const reduce = useReducedMotion();
  const [sheet, setSheet] = useState(
    () => window.matchMedia('(max-width: 1099px)').matches,
  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState<string[]>([]);
  const ease = [0.22, 1, 0.36, 1] as const;

  const shownIds = [...plateIds];
  for (const id of leaving) {
    if (!shownIds.includes(id)) shownIds.push(id);
  }
  const displayed = shownIds
    .map((id) => menuLine(id))
    .filter((line): line is MenuLine => Boolean(line));

  const extraCount = (sweets ? 1 : 0) + (flowers ? 1 : 0);
  const count = plateIds.length + extraCount;
  const showEmpty = count === 0 && leaving.length === 0;

  const requestRemove = (id: string) => {
    setLeaving((prev) => (prev.includes(id) ? prev : [...prev, id]));
    removePlate(id);
  };

  const finishRemove = (id: string) => {
    setLeaving((prev) => prev.filter((item) => item !== id));
  };

  const requestClear = () => {
    setLeaving(plateIds);
    applyPlates([]);
    setSweets(false);
    setFlowers(false);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1099px)');
    const apply = () => setSheet(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="region"
          aria-label="Lista da mesa"
          className="table-float"
          initial={reduce ? false : sheet ? { opacity: 0, y: 28 } : { opacity: 0, x: 28 }}
          animate={sheet ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
          exit={reduce ? undefined : sheet ? { opacity: 0, y: 28 } : { opacity: 0, x: 28 }}
          transition={{ duration: 0.28, ease }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-beige px-4 py-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-text">A mesa</h2>
              <p className="font-sans text-sm text-text-muted">
                {count} {count === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-beige hover:text-olive-deep"
              aria-label="Fechar lista da mesa"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div data-lenis-prevent className="table-float-body">
            {showEmpty && (
              <p className="px-4 py-8 text-center font-sans text-sm text-text-muted">
                A mesa está vazia. Escolha no cardápio.
              </p>
            )}
            <ul className="flex flex-col">
              {displayed.map((line) => (
                <TableRow
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
            {sweets && (
              <ExtraRow name="Doces" onRemove={() => setSweets(false)} />
            )}
            {flowers && (
              <ExtraRow name="Arranjo floral" onRemove={() => setFlowers(false)} />
            )}
          </div>

          {count > 0 && (
            <div className="space-y-2 border-t border-beige px-4 py-3">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-olive-deep px-4 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98]"
                >
                  Enviar pelo WhatsApp
                  <ArrowRight size={16} weight="bold" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center rounded-sm bg-olive-deep/40 px-4 py-2.5 font-sans text-sm font-semibold text-ivory"
                >
                  Enviar pelo WhatsApp
                </button>
              )}
              <button
                type="button"
                onClick={requestClear}
                className="w-full rounded-sm px-4 py-2 font-sans text-sm font-medium text-text-muted transition-colors hover:bg-beige hover:text-text"
              >
                Limpar mesa
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ExtraRow({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="pb-3">
      <div className="flex items-center gap-3 rounded-sm border border-beige bg-cream p-3">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-medium text-text">{name}</p>
          <p className="font-sans text-sm text-text-muted">Sob consulta</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-text-muted transition-colors hover:text-olive-deep"
          aria-label={`Remover ${name} da mesa`}
        >
          <Trash size={15} weight="regular" />
        </button>
      </div>
    </div>
  );
}
