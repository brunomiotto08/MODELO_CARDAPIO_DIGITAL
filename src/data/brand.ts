import { siteConfig } from '../config/site.config';
import { buildMessage } from '../lib/whatsapp';

/**
 * Marca e mensagens padrão. Os valores vêm de src/config/site.config.ts:
 * edite lá ao clonar o template.
 */
export const brand = siteConfig.brand;

export { buildWhatsAppLink, buildMessage, itemLine } from '../lib/whatsapp';

const messages = siteConfig.messages;

/** Mensagem padrão de consulta de encomenda (cardápio avulso). */
export function buildOrderMessage(lines: string[]): string {
  return buildMessage({
    intro: messages.orderIntro,
    sections: [{ heading: 'Produtos de interesse:', lines }],
    closing: messages.orderClosing,
  });
}

/** Mensagem genérica de contato (sem produto específico). */
export const genericOrderMessage = messages.generic;

export const emptyTableMessage = messages.tableEmpty;

/** Mensagem de pedido de orçamento de evento sem detalhes. */
export const eventQuoteMessage = messages.eventQuote;

/**
 * Mensagem da página Monte sua mesa.
 * Sem total: a equipe confirma quantidades, valores e data.
 */
export function buildTableMessage(lines: string[], extras: string[], shareUrl?: string | null): string {
  if (lines.length === 0 && extras.length === 0) return emptyTableMessage;
  return buildMessage({
    intro: messages.tableIntro,
    sections: [
      { heading: 'Itens da mesa:', lines },
      extras.length ? { text: `Também tenho interesse em: ${extras.join(' e ')}.` } : {},
      shareUrl ? { text: `Ver a mesa montada: ${shareUrl}` } : {},
    ],
    closing: messages.tableClosing,
  });
}
