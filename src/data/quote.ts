import { siteConfig } from '../config/site.config';
import { buildMessage, itemLine } from '../lib/whatsapp';
import { eventTypeLabel } from './events';
import { menuLine } from './offers';
import { estimateText, packageById, packageLines, resolvePackage } from './packages';

/**
 * ORÇAMENTO GUIADO — opções configuráveis por cliente.
 */
export const quoteOptions = {
  /** Faixas de horário oferecidas. */
  timeSlots: [
    { id: 'manha', label: 'Manhã', detail: '8h às 12h' },
    { id: 'almoco', label: 'Almoço', detail: '11h às 14h' },
    { id: 'tarde', label: 'Tarde', detail: '14h às 18h' },
    { id: 'noite', label: 'Noite', detail: 'a partir das 18h' },
  ],
  durations: [2, 3, 4, 5, 6],
  restrictions: [
    { id: 'vegetariano', label: 'Vegetariano' },
    { id: 'sem-lactose', label: 'Sem lactose' },
    { id: 'sem-gluten', label: 'Sem glúten' },
    { id: 'criancas', label: 'Muitas crianças' },
  ],
  /** Retirada só aparece quando há ponto de retirada no config. */
  allowPickup: Boolean(siteConfig.brand.pickup),
  otherCityId: 'outra',
  maxGuests: 500,
};

export type QuoteDraft = {
  step: number;
  eventType: string;
  date: string;
  timeSlot: string;
  hours: number;
  guests: number;
  city: string;
  otherCity: string;
  fulfillment: '' | 'entrega' | 'retirada';
  packageId: string;
  includeTable: boolean;
  includeList: boolean;
  restrictions: string[];
  notes: string;
  name: string;
};

export const emptyDraft: QuoteDraft = {
  step: 0,
  eventType: '',
  date: '',
  timeSlot: '',
  hours: 3,
  guests: Math.max(siteConfig.brand.eventMinimumGuests, 20),
  city: '',
  otherCity: '',
  fulfillment: '',
  packageId: '',
  includeTable: true,
  includeList: true,
  restrictions: [],
  notes: '',
  name: '',
};

/** Primeira data aceita (YYYY-MM-DD, horário local), respeitando a antecedência mínima. */
export function minEventDate(now = new Date()): string {
  // O horário exato se confirma no atendimento: aqui vale o dia em que a antecedência termina.
  const earliest = new Date(now.getTime() + siteConfig.brand.leadTimeHours * 3_600_000);
  const y = earliest.getFullYear();
  const m = String(earliest.getMonth() + 1).padStart(2, '0');
  const d = String(earliest.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "2026-11-20" -> "sexta-feira, 20/11/2026" */
export function formatEventDate(value: string): string {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${weekday}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

export function cityLabel(draft: QuoteDraft): string {
  return draft.city === quoteOptions.otherCityId ? draft.otherCity.trim() : draft.city;
}

export function isOutsideServiceArea(draft: QuoteDraft): boolean {
  return draft.city === quoteOptions.otherCityId;
}

type QuoteContext = {
  /** Linhas atuais da mesa montada e da lista, já como texto. */
  tableLines: string[];
  listLines: string[];
};

export function buildQuoteMessage(draft: QuoteDraft, context: QuoteContext): string {
  const slot = quoteOptions.timeSlots.find((item) => item.id === draft.timeSlot);
  const pkg = packageById(draft.packageId);
  const resolved = pkg ? resolvePackage(pkg, draft.guests) : null;
  const restrictions = quoteOptions.restrictions
    .filter((item) => draft.restrictions.includes(item.id))
    .map((item) => item.label);
  const city = cityLabel(draft);

  return buildMessage({
    intro: siteConfig.messages.quoteIntro,
    sections: [
      {
        heading: 'Evento:',
        lines: [
          draft.eventType && `Tipo: ${eventTypeLabel(draft.eventType)}`,
          draft.date && `Data: ${formatEventDate(draft.date)}`,
          slot && `Horário: ${slot.label} (${slot.detail})`,
          draft.hours > 0 && `Duração: cerca de ${draft.hours} horas`,
          `Convidados: ${draft.guests}`,
          city && `Local: ${city}${isOutsideServiceArea(draft) ? ' (fora da área de entrega habitual)' : ''}`,
          draft.fulfillment && `Recebimento: ${draft.fulfillment === 'entrega' ? 'entrega no local' : 'retirada'}`,
        ],
      },
      pkg && resolved
        ? {
            heading: `Pacote de interesse: ${pkg.name}`,
            lines: [...packageLines(resolved), estimateText(resolved)],
          }
        : {},
      draft.includeTable ? { heading: 'Mesa montada no site:', lines: context.tableLines } : {},
      draft.includeList ? { heading: 'Itens da lista do cardápio:', lines: context.listLines } : {},
      restrictions.length ? { text: `Restrições e observações do público: ${restrictions.join(', ')}.` } : {},
      draft.notes.trim() ? { heading: 'Observações:', text: draft.notes.trim() } : {},
      draft.name.trim() ? { text: `Meu nome: ${draft.name.trim()}` } : {},
    ],
    closing: siteConfig.messages.quoteClosing,
  });
}

/** Converte chaves + quantidades em linhas de texto para a mensagem. */
export function linesFrom(keys: readonly string[], quantity: (key: string) => number | undefined): string[] {
  return keys
    .map((key) => {
      const line = menuLine(key);
      return line ? itemLine(line.name, quantity(key) ?? line.min) : null;
    })
    .filter((line): line is string => Boolean(line));
}
