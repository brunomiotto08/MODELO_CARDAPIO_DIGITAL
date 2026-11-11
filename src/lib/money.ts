/**
 * Valores em centavos (inteiros) para evitar erro de ponto flutuante.
 * Os preços do catálogo são strings ("R$ 1.234,50"); estas funções convertem.
 */

/** "R$ 1.234,50" -> 123450. Retorna null quando não há valor no texto. */
export function parseBRL(text: string | undefined | null): number | null {
  if (!text) return null;
  const match = text.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?/);
  if (!match) return null;
  const reais = Number(match[1].replace(/\./g, ''));
  const cents = Number((match[2] ?? '0').padEnd(2, '0'));
  if (!Number.isFinite(reais)) return null;
  return reais * 100 + cents;
}

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 123450 -> "R$ 1.234,50" (com espaço normal, não o NBSP do Intl). */
export function formatBRL(cents: number): string {
  return formatter.format(cents / 100).replace(/ /g, ' ');
}

/** Arredonda para cima em múltiplos de `step` centavos (ex.: 1000 = R$ 10). */
export function roundUpTo(cents: number, step: number): number {
  if (step <= 0) return cents;
  return Math.ceil(cents / step) * step;
}
