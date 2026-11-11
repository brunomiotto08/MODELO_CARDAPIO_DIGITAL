import { products } from './catalog';
import type { Product } from '../types';

export type OfferChoice = {
  id: string;
  label: string;
  detail?: string;
};

export type OfferAxis = {
  id: string;
  label: string;
  sections: { label: string; choices: OfferChoice[] }[];
};

export type MenuLine = {
  key: string;
  name: string;
  description: string;
  price: string;
  unit?: string;
  min: number;
  max: number;
  image: string;
  imagePosition?: string;
  notes: string[];
  quantityLabel: string;
};

export type MenuOffer = {
  id: string;
  name: string;
  category: string;
  hint: string;
  image: string;
  imagePosition?: string;
  priceLabel: string;
  productIds: string[];
  axes: OfferAxis[];
  resolve: (choices: Record<string, string>) => MenuLine;
};

const canapeFlavors: OfferChoice[] = [
  { id: 'brie-damasco', label: 'Brie e damasco' },
  { id: 'gorgonzola', label: 'Gorgonzola, cebola caramelizada e nozes' },
  { id: 'caprese', label: 'Caprese' },
  { id: 'lombo', label: 'Lombo canadense com geleia de abacaxi' },
  { id: 'frango', label: 'Frango' },
  { id: 'peru', label: 'Peito de peru' },
  { id: 'parma-figo', label: 'Parma e figo' },
  { id: 'salmao', label: 'Salmão' },
];

function productById(id: string): Product {
  const found = products.find((item) => item.id === id);
  if (!found) throw new Error(`Produto ausente: ${id}`);
  return found;
}

function quantityLabelFor(product: Product): string {
  if (product.category === 'prensadinhos') return 'Pães';
  if (product.category === 'tabua') return 'Tábuas';
  if (product.unit === 'unidade') return 'Unidades';
  return 'Quantidade';
}

function lineFromProduct(product: Product, extra?: Partial<MenuLine> & { price?: string }): MenuLine {
  return {
    key: extra?.key ?? product.id,
    name: extra?.name ?? product.name,
    description: extra?.description ?? product.description,
    price: extra?.price ?? product.price ?? product.variants?.[0]?.price ?? 'Sob consulta',
    unit: extra?.unit ?? product.unit,
    min: extra?.min ?? product.minQuantity ?? 1,
    max: extra?.max ?? product.maxQuantity ?? 8,
    image: extra?.image ?? product.image,
    imagePosition: extra?.imagePosition ?? product.imagePosition,
    notes: extra?.notes ?? product.notes ?? [],
    quantityLabel: extra?.quantityLabel ?? quantityLabelFor(product),
  };
}

function sizedLine(product: Product, size: string): MenuLine {
  const variant = product.variants?.find((item) => item.label === size);
  return lineFromProduct(product, {
    key: `${product.id}@${size}`,
    name: `${product.name} (${size})`,
    price: variant?.price ?? product.variants?.[0]?.price ?? 'Sob consulta',
  });
}

function canapeLine(flavorId: string): MenuLine {
  const flavor = canapeFlavors.find((item) => item.id === flavorId);
  const product = productById('canapes');
  return lineFromProduct(product, {
    key: `canapes@${flavorId}`,
    name: `Canapés — ${flavor?.label ?? 'Sabor'}`,
    description: '',
  });
}

export function menuLine(key: string): MenuLine | null {
  const at = key.indexOf('@');
  const base = at === -1 ? key : key.slice(0, at);
  const suffix = at === -1 ? '' : key.slice(at + 1);
  const product = products.find((item) => item.id === base);
  if (!product) return null;
  if (base === 'canapes' && suffix) {
    if (!canapeFlavors.some((item) => item.id === suffix)) return null;
    return canapeLine(suffix);
  }
  if (suffix) {
    if (!product.variants?.some((variant) => variant.label === suffix)) return null;
    return sizedLine(product, suffix);
  }
  return lineFromProduct(product);
}

export function linePrice(line: MenuLine): string {
  return line.unit ? `${line.price} / ${line.unit}` : line.price;
}

export function defaultChoices(offer: MenuOffer): Record<string, string> {
  const choices: Record<string, string> = {};
  for (const axis of offer.axes) {
    const first = axis.sections.find((section) => section.choices.length > 0)?.choices[0];
    if (first) choices[axis.id] = first.id;
  }
  return choices;
}

export function offerIsSelected(offer: MenuOffer, keys: readonly string[]): boolean {
  return keys.some((key) => offer.productIds.includes(key.split('@')[0]));
}

function axis(id: string, label: string, choices: OfferChoice[], sectionLabel = ''): OfferAxis {
  return { id, label, sections: [{ label: sectionLabel, choices }] };
}

const tortaIds = {
  'grande|frango': 'torta-fria-frango',
  'pequena|frango': 'torta-fria-frango-pequena',
  'grande|vegetariana': 'torta-fria-vegetariana',
  'pequena|vegetariana': 'torta-fria-vegetariana-pequena',
} as const;

export const menuOffers: MenuOffer[] = [
  {
    id: 'tortas-frias',
    name: 'Torta fria',
    category: 'tortas-frias',
    hint: 'Tamanho e sabor',
    image: productById('torta-fria-frango').image,
    priceLabel: 'A partir de R$ 64,00',
    productIds: Object.values(tortaIds),
    axes: [
      axis('tamanho', 'Tamanho', [
        { id: 'grande', label: 'Grande', detail: 'R$ 110,00 · 1,4 kg · cerca de 12 fatias' },
        { id: 'pequena', label: 'Pequena', detail: 'R$ 64,00 · 700 g · cerca de 6 fatias' },
      ]),
      axis('sabor', 'Sabor', [
        { id: 'frango', label: 'Frango' },
        { id: 'vegetariana', label: 'Vegetariana' },
      ]),
    ],
    resolve(choices) {
      const id = tortaIds[`${choices.tamanho}|${choices.sabor}` as keyof typeof tortaIds] ?? tortaIds['grande|frango'];
      return lineFromProduct(productById(id));
    },
  },
  {
    id: 'prensadinhos',
    name: 'Prensadinhos',
    category: 'prensadinhos',
    hint: 'Escolha o sabor',
    image: productById('prensadinhos-frios').image,
    priceLabel: 'R$ 86,00',
    productIds: ['prensadinhos-frios', 'prensadinhos-vegetarianos'],
    axes: [
      axis('sabor', 'Sabor', [
        { id: 'prensadinhos-frios', label: 'Frios' },
        { id: 'prensadinhos-vegetarianos', label: 'Vegetarianos' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.sabor || 'prensadinhos-frios'));
    },
  },
  {
    id: 'canapes',
    name: 'Canapés',
    category: 'canapes',
    hint: 'Sabor e unidades',
    image: productById('canapes').image,
    priceLabel: 'R$ 3,00 / unidade',
    productIds: ['canapes'],
    axes: [axis('sabor', 'Sabor', canapeFlavors)],
    resolve(choices) {
      return canapeLine(choices.sabor || canapeFlavors[0].id);
    },
  },
  {
    id: 'terrines',
    name: 'Terrines',
    category: 'terrines',
    hint: 'Sabor e tamanho',
    image: productById('terrine-caprese').image,
    priceLabel: 'A partir de R$ 72,00',
    productIds: ['terrine-caprese', 'terrine-salmao', 'terrine-gorgonzola', 'terrine-castanhas'],
    axes: [
      {
        id: 'sabor',
        label: 'Sabor',
        sections: [
          {
            label: 'Salgados',
            choices: [
              { id: 'terrine-caprese', label: 'Caprese' },
              { id: 'terrine-salmao', label: 'Salmão com alho-poró' },
            ],
          },
          {
            label: 'Doces',
            choices: [
              { id: 'terrine-gorgonzola', label: 'Gorgonzola com frutas vermelhas' },
              { id: 'terrine-castanhas', label: 'Mix de castanhas com caramelo salgado' },
            ],
          },
        ],
      },
      axis('tamanho', 'Tamanho', [
        { id: '900g', label: '900 g' },
        { id: '400g', label: '400 g' },
      ]),
    ],
    resolve(choices) {
      return sizedLine(productById(choices.sabor || 'terrine-caprese'), choices.tamanho || '900g');
    },
  },
  {
    id: 'folhados',
    name: 'Salgados folhados',
    category: 'folhados',
    hint: 'Sabor e unidades',
    image: productById('mini-folhado-parma-figo').image,
    priceLabel: 'R$ 3,80 / unidade',
    productIds: ['mini-folhado-parma-figo', 'mini-folhado-carne-seca', 'tortinha-folhada-bacon'],
    axes: [
      axis('sabor', 'Sabor', [
        { id: 'mini-folhado-parma-figo', label: 'Parma e figo' },
        { id: 'mini-folhado-carne-seca', label: 'Carne seca com geleia de pimenta' },
        { id: 'tortinha-folhada-bacon', label: 'Tortinha de bacon com cream cheese' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.sabor || 'mini-folhado-parma-figo'));
    },
  },
  {
    id: 'brie',
    name: 'Queijo brie',
    category: 'brie',
    hint: 'Escolha o tamanho',
    image: productById('brie-crocante-g').image,
    priceLabel: 'A partir de R$ 78,00',
    productIds: ['brie-crocante-g', 'brie-crocante-p'],
    axes: [
      axis('tamanho', 'Tamanho', [
        { id: 'brie-crocante-g', label: 'Grande', detail: 'R$ 220,00 · 1 kg · cerca de 15 pessoas' },
        { id: 'brie-crocante-p', label: 'Pequeno', detail: 'R$ 78,00 · 130 g · 2 a 3 pessoas' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.tamanho || 'brie-crocante-g'));
    },
  },
  {
    id: 'mini-lanches',
    name: 'Mini lanches',
    category: 'mini-lanches',
    hint: 'Tipo e unidades',
    image: productById('mini-hamburguer').image,
    priceLabel: 'A partir de R$ 5,00 / unidade',
    productIds: ['mini-hamburguer', 'mini-hamburguer-vegetariano', 'mini-hot-dog'],
    axes: [
      axis('opcao', 'Opção', [
        { id: 'mini-hamburguer', label: 'Mini hambúrguer', detail: 'R$ 6,10 / unidade' },
        { id: 'mini-hamburguer-vegetariano', label: 'Mini hambúrguer vegetariano', detail: 'R$ 6,10 / unidade' },
        { id: 'mini-hot-dog', label: 'Mini hot dog', detail: 'R$ 5,00 / unidade' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.opcao || 'mini-hamburguer'));
    },
  },
  {
    id: 'entradas',
    name: 'Entradas e antepastos',
    category: 'entradas',
    hint: 'Item e unidades',
    image: productById('palito-caprese').image,
    priceLabel: 'A partir de R$ 3,40 / unidade',
    productIds: ['palito-caprese', 'burrata'],
    axes: [
      axis('opcao', 'Opção', [
        { id: 'palito-caprese', label: 'Palito caprese', detail: 'R$ 3,40 / unidade · mínimo 15' },
        { id: 'burrata', label: 'Burrata com tomatinhos', detail: 'R$ 87,00 · serve até 5 pessoas' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.opcao || 'palito-caprese'));
    },
  },
  {
    id: 'tabua',
    name: 'Tábua de frios',
    category: 'tabua',
    hint: '6, 12 ou 20 pessoas',
    image: productById('tabua-6').image,
    priceLabel: 'A partir de R$ 250,00',
    productIds: ['tabua-6', 'tabua-12', 'tabua-20'],
    axes: [
      axis('opcao', 'Para quantas pessoas', [
        { id: 'tabua-6', label: '6 pessoas', detail: 'R$ 250,00 · 3 queijos e 3 frios' },
        { id: 'tabua-12', label: '12 pessoas', detail: 'R$ 480,00 · 4 queijos e 4 frios' },
        { id: 'tabua-20', label: '20 pessoas', detail: 'R$ 630,00 · 5 queijos e 5 frios' },
      ]),
    ],
    resolve(choices) {
      return lineFromProduct(productById(choices.opcao || 'tabua-6'));
    },
  },
];
