import type { BrandConfig } from '../types';

/**
 * Configuração centralizada da marca Flor Alecrim.
 *
 * IMPORTANTE: Preencha o campo `whatsapp` com o número real antes de publicar.
 * Formato: código do país + DDD + número, sem espaços ou pontuação.
 * Exemplo para Brasil: "5554999999999"
 */
export const brand: BrandConfig = {
  name: 'Flor Alecrim',

  whatsapp: '5554999563067',

  instagram: 'floralecrim_',

  city: 'Caxias do Sul, RS',

  region: 'Serra Gaúcha',

  serviceArea: ['Caxias do Sul', 'Farroupilha', 'Bento Gonçalves', 'Garibaldi'],

  hours: {
    weekdays: '8h–11h30 e 13h30–18h',
    saturday: '8h–11h',
    note: 'Horários de atendimento pelo WhatsApp',
  },
};

/**
 * Gera um link wa.me com mensagem pré-preenchida.
 * Retorna null quando o número não está configurado.
 */
export function buildWhatsAppLink(message: string): string | null {
  if (!brand.whatsapp.trim()) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${brand.whatsapp}?text=${encoded}`;
}

/**
 * Mensagem padrão de consulta de encomenda.
 */
export function buildOrderMessage(lines: string[]): string {
  const productList = lines.map((line) => `• ${line}`).join('\n');
  return `Olá! Conheci a Flor Alecrim pelo cardápio digital e gostaria de consultar uma encomenda.

Produtos de interesse:
${productList}

Poderiam me informar os valores, as opções disponíveis e as condições para encomendar?`;
}

/**
 * Mensagem genérica de contato (sem produto específico).
 */
export const genericOrderMessage =
  `Olá! Conheci a Flor Alecrim pelo site e gostaria de saber mais sobre as mesas para eventos e os pedidos avulsos. Podem me ajudar?`;

export const emptyTableMessage =
  `Olá! Quero montar uma mesa com a Flor Alecrim para um evento. Podem me orientar sobre as opções, quantidades, valores e a data?`;

/**
 * Mensagem da página Monte sua mesa.
 * Sem total: a equipe confirma quantidades, valores e data.
 */
export function buildTableMessage(lines: string[], extras: string[]): string {
  if (lines.length === 0 && extras.length === 0) return emptyTableMessage;

  const parts = ['Olá! Quero montar uma mesa com a Flor Alecrim.'];
  if (lines.length > 0) {
    parts.push(`Itens da mesa:\n${lines.map((line) => `• ${line}`).join('\n')}`);
  }
  if (extras.length > 0) {
    parts.push(`Também tenho interesse em: ${extras.join(' e ')}.`);
  }
  parts.push('Podem me orientar sobre quantidades, valores e a data?');
  return parts.join('\n\n');
}
