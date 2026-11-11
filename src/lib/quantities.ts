import { menuLine } from '../data/offers';
import { parseBRL } from './money';
import { calculatorLimits, defaultMix, servesPerPiece, servingStyles } from '../data/calculator';

/**
 * Regras de arredondamento e custo das linhas do cardápio.
 * Funções puras: usadas por pacotes, calculadora e orçamento guiado.
 */

/** Itens vendidos por unidade com mínimo alto (canapés, folhados) arredondam de 5 em 5. */
export function quantityStep(key: string): number {
  const line = menuLine(key);
  return line && line.min >= 10 ? 5 : 1;
}

type RoundOptions = {
  /** Limita ao máximo do slider da linha (necessário ao mandar para a mesa/lista). */
  clampMax?: boolean;
};

/** Arredonda para cima no passo do item e respeita o mínimo (e, opcionalmente, o máximo). */
export function roundQuantity(key: string, raw: number, { clampMax = false }: RoundOptions = {}): number {
  const line = menuLine(key);
  const value = Number.isFinite(raw) ? raw : 0;
  if (!line) return Math.max(1, Math.ceil(value));
  const step = quantityStep(key);
  let quantity = Math.ceil(value / step - 1e-9) * step;
  quantity = Math.max(line.min, quantity);
  if (clampMax) quantity = Math.min(line.max, quantity);
  return quantity;
}

/** Preço unitário da linha em centavos; null quando é "sob consulta". */
export function unitPrice(key: string): number | null {
  const line = menuLine(key);
  return line ? parseBRL(line.price) : null;
}

/** Custo da linha (centavos) para a quantidade dada; null sem preço. */
export function lineCost(key: string, quantity: number): number | null {
  const price = unitPrice(key);
  return price === null ? null : price * quantity;
}

export type QuantityItem = { key: string; quantity: number };

/** Soma os custos conhecidos e informa se algum item ficou sem preço. */
export function sumCost(items: QuantityItem[]): { total: number; complete: boolean } {
  let total = 0;
  let complete = true;
  for (const item of items) {
    const cost = lineCost(item.key, item.quantity);
    if (cost === null) complete = false;
    else total += cost;
  }
  return { total, complete };
}

/* ─── Calculadora ─────────────────────────────────────────────── */

export type SuggestInput = {
  guests: number;
  hours: number;
  styleId: string;
  /** Itens escolhidos (mesa/lista). Vazio = usa a sugestão padrão do cliente. */
  keys?: readonly string[];
};

export type Suggestion = {
  items: QuantityItem[];
  /** Salgados (itens por unidade) sugeridos no total. */
  unitTotal: number;
  /** Salgados por convidado. */
  perGuest: number;
  /** true quando usou a sugestão padrão por não haver itens escolhidos. */
  usedDefault: boolean;
};

function isPieceItem(key: string): boolean {
  if (key in servesPerPiece) return true;
  return menuLine(key)?.unit !== 'unidade';
}

/**
 * Sugere quantidades para N convidados. Peças inteiras saem por pessoas servidas;
 * o volume de salgados é dividido igualmente entre os itens por unidade.
 */
export function suggestQuantities({ guests, hours, styleId, keys = [] }: SuggestInput): Suggestion {
  const style = servingStyles.find((item) => item.id === styleId) ?? servingStyles[0];
  const safeGuests = Math.max(calculatorLimits.minGuests, Math.round(guests) || 0);
  const safeHours = Math.min(calculatorLimits.maxHours, Math.max(calculatorLimits.minHours, Math.round(hours) || 0));
  const chosen = keys.filter((key) => menuLine(key));
  const usedDefault = chosen.length === 0;
  const pool = usedDefault ? defaultMix.filter((key) => menuLine(key)) : [...new Set(chosen)];

  const pieces = pool.filter(isPieceItem);
  const units = pool.filter((key) => !isPieceItem(key));

  const perGuestBase = style.firstHour + style.extraHour * (safeHours - 1);
  // Cada tipo de peça inteira na mesa reduz 10% dos salgados, até no máximo 40%.
  const reduction = Math.min(0.4, pieces.length * 0.1);
  const unitTarget = units.length ? safeGuests * perGuestBase * (1 - reduction) : 0;

  const items: QuantityItem[] = [];
  for (const key of pool) {
    if (isPieceItem(key)) {
      const serves = servesPerPiece[key] ?? 10;
      items.push({ key, quantity: roundQuantity(key, safeGuests / serves) });
    } else {
      items.push({ key, quantity: roundQuantity(key, unitTarget / units.length) });
    }
  }

  const unitTotal = items
    .filter((item) => !isPieceItem(item.key))
    .reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    unitTotal,
    perGuest: safeGuests ? Math.round((unitTotal / safeGuests) * 10) / 10 : 0,
    usedDefault,
  };
}
