/**
 * DEPOIMENTOS — somente depoimentos reais, com autorização do cliente.
 * Copie de avaliações do Google, do Instagram ou de mensagens (com permissão).
 * Nunca invente depoimentos: além de antiético, viola o Código de Defesa do
 * Consumidor e as políticas do Google.
 *
 * Com a lista vazia, a seção não aparece no site publicado.
 * Em `npm run dev`, os exemplos abaixo aparecem só para conferir o layout.
 */
export type Testimonial = {
  /** Nome como o cliente autorizou (ex.: "Ana P."). */
  name: string;
  text: string;
  /** id de src/data/events.ts, opcional. */
  eventType?: string;
  /** 1 a 5. */
  rating?: number;
  source?: 'google' | 'instagram' | 'whatsapp';
};

export const testimonials: Testimonial[] = [
  // { name: 'Nome S.', text: 'Texto real do depoimento.', eventType: 'aniversario', rating: 5, source: 'google' },
];

/** Exemplos de layout. Nunca vão para o build de produção. */
export const layoutExamples: Testimonial[] = [
  {
    name: 'Exemplo de cliente',
    text: 'Exemplo de depoimento para conferir o layout. Substitua por um depoimento real em src/data/testimonials.ts.',
    eventType: 'aniversario',
    rating: 5,
    source: 'google',
  },
  {
    name: 'Exemplo de empresa',
    text: 'Outro exemplo de layout, com um texto um pouco mais longo para ver como a quebra de linha se comporta no cartão.',
    eventType: 'corporativo',
    source: 'whatsapp',
  },
  {
    name: 'Exemplo de evento',
    text: 'Terceiro exemplo, curto.',
    eventType: 'casamento',
    rating: 5,
    source: 'instagram',
  },
];
