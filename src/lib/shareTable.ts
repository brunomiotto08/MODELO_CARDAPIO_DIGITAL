import { menuLine } from '../data/offers';

/**
 * Codifica a mesa montada num parâmetro de URL curto e legível:
 *   ?m=canapes:30,terrine-caprese@900g:1;sf
 * (itens "chave:quantidade" separados por vírgula; depois do ";", s = doces, f = arranjo floral)
 */

export type SharedTable = {
  plateIds: string[];
  quantities: Record<string, number>;
  sweets: boolean;
  flowers: boolean;
};

export const SHARE_PARAM = 'm';

export function encodeTable(table: SharedTable): string {
  const items = table.plateIds
    .map((id) => `${id}:${table.quantities[id] ?? menuLine(id)?.min ?? 1}`)
    .join(',');
  const extras = `${table.sweets ? 's' : ''}${table.flowers ? 'f' : ''}`;
  return extras ? `${items};${extras}` : items;
}

/** Decodifica e valida contra o cardápio atual; itens que não existem mais são descartados. */
export function decodeTable(raw: string | null | undefined): SharedTable | null {
  if (!raw) return null;
  const [itemsPart = '', extras = ''] = raw.split(';');
  const plateIds: string[] = [];
  const quantities: Record<string, number> = {};
  for (const chunk of itemsPart.split(',')) {
    const [key, qty] = chunk.split(':');
    const line = key ? menuLine(key) : null;
    if (!line || plateIds.includes(line.key)) continue;
    const parsed = Number(qty);
    plateIds.push(line.key);
    quantities[line.key] = Number.isFinite(parsed)
      ? Math.min(line.max, Math.max(line.min, Math.round(parsed)))
      : line.min;
  }
  const sweets = extras.includes('s');
  const flowers = extras.includes('f');
  if (plateIds.length === 0 && !sweets && !flowers) return null;
  return { plateIds, quantities, sweets, flowers };
}

export function shareTableUrl(table: SharedTable, origin: string): string {
  // ":", "," e ";" são válidos na query: o link fica legível na conversa do WhatsApp.
  return `${origin}/monte-sua-mesa?${SHARE_PARAM}=${encodeURI(encodeTable(table))}`;
}
