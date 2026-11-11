import { siteConfig } from '../config/site.config';

/**
 * Monta links wa.me e mensagens com formato único em todo o site.
 * Toda feature nova deve usar `buildMessage`, para o estabelecimento receber
 * mensagens sempre no mesmo padrão.
 */

export type MessageSection = {
  /** Título da seção, ex.: "Itens da mesa:". Opcional. */
  heading?: string;
  /** Linhas com marcador "•". Linhas vazias são descartadas. */
  lines?: (string | null | undefined | false)[];
  /** Texto corrido, sem marcador. */
  text?: string;
};

export type Message = {
  intro: string;
  sections?: MessageSection[];
  closing?: string;
};

export function buildMessage({ intro, sections = [], closing }: Message): string {
  const parts = [intro];
  for (const section of sections) {
    const lines = (section.lines ?? []).filter((line): line is string => Boolean(line && line.trim()));
    const body = [
      section.heading,
      section.text,
      lines.length ? lines.map((line) => `• ${line}`).join('\n') : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (lines.length || section.text) parts.push(body);
  }
  if (closing) parts.push(closing);
  return parts.join('\n\n');
}

/** "Canapés — 30 un." */
export function itemLine(name: string, quantity?: number): string {
  return quantity ? `${name} — ${quantity} un.` : name;
}

/** Link wa.me com mensagem pré-preenchida. null quando o número não está configurado. */
export function buildWhatsAppLink(message: string): string | null {
  const phone = siteConfig.brand.whatsapp.trim();
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
