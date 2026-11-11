export type TableSuggestion = {
  id: string;
  name: string;
  serves: string;
  productIds: string[];
};

export const tableSuggestions: TableSuggestion[] = [
  {
    id: 'mesa-para-dois',
    name: 'Mesa para dois',
    serves: '2 a 3 pessoas',
    productIds: ['brie-crocante-p', 'palito-caprese', 'terrine-caprese'],
  },
  {
    id: 'encontro',
    name: 'Encontro',
    serves: 'Até 5 pessoas',
    productIds: ['canapes', 'burrata', 'terrine-gorgonzola', 'brie-crocante-p'],
  },
  {
    id: 'queijos-e-frios',
    name: 'Queijos e frios',
    serves: 'Cerca de 6 pessoas',
    productIds: ['tabua-6', 'brie-crocante-g', 'terrine-castanhas', 'canapes'],
  },
  {
    id: 'mesa-de-festa',
    name: 'Mesa de festa',
    serves: 'Cerca de 12 pessoas',
    productIds: [
      'tabua-12',
      'brie-crocante-g',
      'terrine-salmao',
      'terrine-caprese',
      'burrata',
      'palito-caprese',
      'canapes',
    ],
  },
];
