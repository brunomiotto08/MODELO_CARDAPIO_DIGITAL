import { useId, useMemo, useState } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { calculatorLimits, servingStyles } from '../data/calculator';
import { menuLine } from '../data/offers';
import { roundQuantity, suggestQuantities, type QuantityItem } from '../lib/quantities';
import { isEnabled } from '../config/features';
import ChoiceChips from './ChoiceChips';
import QuantitySlider from './QuantitySlider';

type QuantityCalculatorProps = {
  /** Itens já escolhidos (mesa ou lista). Vazio = sugestão padrão. */
  keys: readonly string[];
  /** Recebe as quantidades já limitadas ao máximo de cada item. */
  onApply: (items: QuantityItem[]) => void;
  applyLabel: string;
  /** Texto do botão quando a sugestão traz itens novos (sem nada escolhido). */
  applyDefaultLabel?: string;
  /** Começa aberto (senão, é um bloco recolhível). */
  defaultOpen?: boolean;
  className?: string;
};

const hourChips = Array.from(
  { length: calculatorLimits.maxHours - calculatorLimits.minHours + 1 },
  (_, index) => {
    const hours = calculatorLimits.minHours + index;
    return { id: String(hours), label: `${hours}h` };
  },
);

const styleChips = servingStyles.map((style) => ({ id: style.id, label: style.label, detail: style.description }));

export default function QuantityCalculator({
  keys,
  onApply,
  applyLabel,
  applyDefaultLabel,
  defaultOpen = false,
  className = '',
}: QuantityCalculatorProps) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [guests, setGuests] = useState(calculatorLimits.defaultGuests);
  const [hours, setHours] = useState(calculatorLimits.defaultHours);
  const [styleId, setStyleId] = useState(calculatorLimits.defaultStyle);
  const [applied, setApplied] = useState(false);

  const suggestion = useMemo(
    () => suggestQuantities({ guests, hours, styleId, keys }),
    [guests, hours, styleId, keys],
  );

  if (!isEnabled('calculator')) return null;

  const clamped = suggestion.items.map((item) => ({
    key: item.key,
    quantity: roundQuantity(item.key, item.quantity, { clampMax: true }),
  }));
  const overLimit = clamped.some((item, index) => item.quantity < suggestion.items[index].quantity);

  const apply = () => {
    onApply(clamped);
    setApplied(true);
    window.setTimeout(() => setApplied(false), 1800);
  };

  const body = (
    <div className="space-y-4 px-4 pb-4 pt-1">
      <QuantitySlider
        min={calculatorLimits.minGuests}
        max={calculatorLimits.maxGuests}
        value={guests}
        onChange={setGuests}
        label="Convidados"
        unit="pessoas"
      />
      <ChoiceChips label="Duração do evento" showLabel chips={hourChips} value={String(hours)} onChange={(id) => setHours(Number(id))} size="sm" />
      <ChoiceChips label="Como os salgados entram no evento" showLabel chips={styleChips} value={styleId} onChange={setStyleId} size="sm" />

      <div className="border-t border-beige pt-3" aria-live="polite">
        <p className="font-sans text-sm text-text">
          Sugestão: <strong className="font-semibold text-olive-deep">{suggestion.unitTotal} salgados</strong>
          {suggestion.unitTotal > 0 && <span className="text-text-muted"> · cerca de {suggestion.perGuest} por pessoa</span>}
        </p>
        <p className="mt-0.5 font-sans text-[11px] leading-snug text-text-muted">
          {suggestion.usedDefault
            ? 'Sem itens escolhidos ainda: mostramos uma combinação sugerida.'
            : 'Dividido entre os itens que você escolheu.'}{' '}
          É uma referência: a equipe confirma no atendimento.
        </p>
        <ul className="mt-2 divide-y divide-beige border-y border-beige">
          {suggestion.items.map((item) => (
            <li key={item.key} className="flex items-baseline justify-between gap-3 py-1.5">
              <span className="min-w-0 font-sans text-[13px] leading-snug text-text">{menuLine(item.key)?.name ?? item.key}</span>
              <span className="shrink-0 font-sans text-[13px] font-medium tabular-nums text-olive-deep">{item.quantity} un.</span>
            </li>
          ))}
        </ul>
        {overLimit && (
          <p className="mt-1.5 font-sans text-[11px] leading-snug text-text-muted">
            Algumas quantidades passam do limite de cada item aqui no site e entram no máximo. Ajuste o restante no WhatsApp.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={apply}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-olive-deep px-4 py-2.5 font-sans text-sm font-semibold text-ivory transition-colors hover:bg-olive-mid active:scale-[0.98]"
      >
        {applied && <Check size={15} weight="bold" />}
        {applied ? 'Quantidades aplicadas' : suggestion.usedDefault && applyDefaultLabel ? applyDefaultLabel : applyLabel}
      </button>
    </div>
  );

  return (
    <section aria-label="Calculadora de quantidades" className={`border border-beige bg-cream ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span>
          <span className="block font-serif text-lg font-medium leading-tight text-text">Quanto pedir?</span>
          <span className="block font-sans text-xs text-text-muted">Calcule as quantidades pelo número de convidados.</span>
        </span>
        <CaretDown size={18} className={`shrink-0 text-olive-deep transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
