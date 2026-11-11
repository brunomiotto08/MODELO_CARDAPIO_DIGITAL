/**
 * REGRAS DA CALCULADORA DE QUANTIDADES — ajuste com o cliente.
 *
 * Conta de referência: unidades por convidado na 1ª hora + unidades a cada hora
 * extra. Peças inteiras (tortas, tábuas, terrines, brie, burrata) são contadas
 * por "pessoas servidas por peça" e reduzem um pouco o volume de salgados.
 */

export type ServingStyle = {
  id: string;
  label: string;
  description: string;
  /** Salgados por convidado na primeira hora. */
  firstHour: number;
  /** Salgados por convidado em cada hora seguinte. */
  extraHour: number;
};

export const servingStyles: ServingStyle[] = [
  {
    id: 'acompanhamento',
    label: 'Acompanhamento',
    description: 'Petiscos antes ou ao lado de outra refeição.',
    firstHour: 4,
    extraHour: 2,
  },
  {
    id: 'coffee-break',
    label: 'Coffee break',
    description: 'Pausa de reunião, café da manhã ou da tarde.',
    firstHour: 5,
    extraHour: 2,
  },
  {
    id: 'coquetel',
    label: 'Coquetel',
    description: 'Os salgados são a refeição do evento.',
    firstHour: 8,
    extraHour: 4,
  },
];

export const calculatorLimits = {
  minGuests: 1,
  maxGuests: 300,
  defaultGuests: 20,
  minHours: 1,
  maxHours: 6,
  defaultHours: 3,
  defaultStyle: 'coquetel',
};

/** Pessoas servidas por peça. Itens fora desta lista e sem "unidade" contam 10 pessoas. */
export const servesPerPiece: Record<string, number> = {
  'torta-fria-frango': 12,
  'torta-fria-vegetariana': 12,
  'torta-fria-frango-pequena': 6,
  'torta-fria-vegetariana-pequena': 6,
  'tabua-6': 6,
  'tabua-12': 12,
  'tabua-20': 20,
  'brie-crocante-g': 25,
  'brie-crocante-p': 6,
  'terrine-gorgonzola@900g': 20,
  'terrine-castanhas@900g': 20,
  'terrine-caprese@900g': 20,
  'terrine-salmao@900g': 20,
  'terrine-gorgonzola@400g': 10,
  'terrine-castanhas@400g': 10,
  'terrine-caprese@400g': 10,
  'terrine-salmao@400g': 10,
  burrata: 8,
  'prensadinhos-frios': 15,
  'prensadinhos-vegetarianos': 15,
};

/** Sugestão usada quando a pessoa ainda não escolheu nenhum item. */
export const defaultMix: string[] = [
  'canapes',
  'mini-folhado-parma-figo',
  'tortinha-folhada-bacon',
  'palito-caprese',
  'mini-hamburguer',
  'torta-fria-frango',
];
