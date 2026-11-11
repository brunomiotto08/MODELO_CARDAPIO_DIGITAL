import { siteConfig } from '../config/site.config';
import { menuLine } from './offers';
import { lineCost, roundQuantity } from '../lib/quantities';
import { formatBRL, roundUpTo } from '../lib/money';
import { buildMessage } from '../lib/whatsapp';

/**
 * PACOTES DE EVENTOS — edite por cliente.
 *
 * Cada item aponta para uma linha do cardápio (`key`, a mesma chave de
 * menuLine(): 'canapes', 'terrine-caprese@900g'...) e diz como a quantidade
 * cresce com o número de convidados:
 *   - perGuest: unidades por convidado (canapés, folhados, mini lanches);
 *   - servesPerPiece: pessoas servidas por peça (tortas, tábuas, terrines, brie);
 *   - fixed: quantidade fixa, independente de convidados.
 * Um item só com `label` (sem `key`) entra como "sob consulta".
 *
 * A estimativa usa os preços do próprio cardápio. Para pacotes com preço
 * fechado por pessoa, informe `pricePerGuest` (em centavos): ele substitui a soma.
 */

export type PackageItem = {
  key?: string;
  label?: string;
  perGuest?: number;
  servesPerPiece?: number;
  fixed?: number;
};

export type PackageAddon = {
  id: string;
  label: string;
  description?: string;
  /** Sem itens = sob consulta (entra na mensagem sem valor). */
  items?: PackageItem[];
};

export type EventPackage = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /** ids de src/data/events.ts */
  eventTypes: string[];
  /** Selo opcional no card, ex.: 'Mais pedido'. Use só se for verdade. */
  highlight?: string;
  minGuests: number;
  maxGuests: number;
  defaultGuests: number;
  guestStep?: number;
  items: PackageItem[];
  /** O que vem junto, em texto (ex.: 'Montagem da mesa no local'). */
  includes?: string[];
  addons?: PackageAddon[];
  notes?: string[];
  /** Preço fechado por convidado, em centavos. Substitui a soma do cardápio. */
  pricePerGuest?: number;
  featuredOnHome?: boolean;
};

const sweets: PackageAddon = {
  id: 'doces',
  label: 'Doces',
  description: 'Saem prontos. Valor sob consulta.',
};

const flowers: PackageAddon = {
  id: 'arranjo-floral',
  label: 'Arranjo floral',
  description: 'Valor sob consulta.',
};

export const eventPackages: EventPackage[] = [
  {
    id: 'coffee-break',
    name: 'Coffee break',
    tagline: 'Para reuniões, treinamentos e pausas da manhã ou da tarde.',
    image: '/images/insta/mesa-08.jpg',
    imageAlt: 'Canapés, taças e uma tábua de frios com frutas em um evento',
    eventTypes: ['coffee-break', 'corporativo', 'cafe-da-manha'],
    minGuests: 15,
    maxGuests: 120,
    defaultGuests: 30,
    guestStep: 5,
    items: [
      { key: 'canapes', perGuest: 2 },
      { key: 'mini-folhado-parma-figo', perGuest: 1 },
      { key: 'tortinha-folhada-bacon', perGuest: 1 },
      { key: 'palito-caprese', perGuest: 1 },
      { key: 'torta-fria-frango', servesPerPiece: 12 },
    ],
    addons: [
      {
        id: 'vegetariano',
        label: 'Opção vegetariana',
        description: 'Torta fria vegetariana.',
        items: [{ key: 'torta-fria-vegetariana', servesPerPiece: 24 }],
      },
      sweets,
    ],
    notes: ['Quantidades pensadas para cerca de 2 horas de evento.'],
    featuredOnHome: true,
  },
  {
    id: 'aniversario',
    name: 'Festa de aniversário',
    tagline: 'Salgados e mini lanches para a festa inteira, do começo ao parabéns.',
    image: '/images/insta/mesa-06.jpg',
    imageAlt: 'Mini hambúrgueres e prensadinhos em uma mesa de mármore',
    eventTypes: ['aniversario', 'confraternizacao'],
    minGuests: 15,
    maxGuests: 150,
    defaultGuests: 40,
    guestStep: 5,
    items: [
      { key: 'mini-hamburguer', perGuest: 1.5 },
      { key: 'mini-hot-dog', perGuest: 1 },
      { key: 'canapes', perGuest: 2 },
      { key: 'mini-folhado-carne-seca', perGuest: 1.5 },
      { key: 'torta-fria-frango', servesPerPiece: 12 },
    ],
    addons: [
      {
        id: 'vegetariano',
        label: 'Opção vegetariana',
        description: 'Mini hambúrguer vegetariano.',
        items: [{ key: 'mini-hamburguer-vegetariano', perGuest: 0.5 }],
      },
      sweets,
      flowers,
    ],
    notes: ['Quantidades pensadas para cerca de 4 horas de festa.'],
    featuredOnHome: true,
  },
  {
    id: 'mesa-de-antepastos',
    name: 'Mesa de antepastos',
    tagline: 'Tábuas, queijos, terrines e burrata: a mesa posta para receber.',
    image: '/images/insta/mesa-05.jpg',
    imageAlt: 'Mesa de antepastos ao ar livre, com frios, frutas e um arranjo de flores',
    eventTypes: ['casamento', 'confraternizacao', 'aniversario', 'corporativo'],
    minGuests: 15,
    maxGuests: 80,
    defaultGuests: 25,
    guestStep: 5,
    items: [
      { key: 'tabua-12', servesPerPiece: 12 },
      { key: 'brie-crocante-g', servesPerPiece: 25 },
      { key: 'terrine-caprese@900g', servesPerPiece: 20 },
      { key: 'terrine-gorgonzola@900g', servesPerPiece: 20 },
      { key: 'burrata', servesPerPiece: 10 },
      { key: 'canapes', perGuest: 2 },
      { key: 'palito-caprese', perGuest: 1 },
    ],
    addons: [flowers, sweets],
    notes: ['Ideal como entrada ou para encontros de fim de tarde.'],
    featuredOnHome: true,
  },
  {
    id: 'coquetel',
    name: 'Coquetel',
    tagline: 'Volume de salgados para os salgados serem a refeição do evento.',
    image: '/images/insta/mesa-13.jpg',
    imageAlt: 'Buffet de evento com salgados e frutas',
    eventTypes: ['casamento', 'corporativo', 'confraternizacao'],
    minGuests: 30,
    maxGuests: 200,
    defaultGuests: 60,
    guestStep: 10,
    items: [
      { key: 'canapes', perGuest: 3 },
      { key: 'mini-folhado-parma-figo', perGuest: 2 },
      { key: 'tortinha-folhada-bacon', perGuest: 1.5 },
      { key: 'palito-caprese', perGuest: 1.5 },
      { key: 'mini-hamburguer', perGuest: 1.5 },
      { key: 'brie-crocante-g', servesPerPiece: 30 },
      { key: 'terrine-salmao@900g', servesPerPiece: 25 },
    ],
    addons: [
      {
        id: 'vegetariano',
        label: 'Opção vegetariana',
        description: 'Mini hambúrguer vegetariano.',
        items: [{ key: 'mini-hamburguer-vegetariano', perGuest: 0.5 }],
      },
      sweets,
      flowers,
    ],
    notes: ['Quantidades pensadas para cerca de 4 horas de evento.'],
  },
];

export function packageById(id: string | null | undefined): EventPackage | undefined {
  return id ? eventPackages.find((item) => item.id === id) : undefined;
}

export function clampGuests(pkg: EventPackage, guests: number): number {
  if (!Number.isFinite(guests)) return pkg.defaultGuests;
  return Math.min(pkg.maxGuests, Math.max(pkg.minGuests, Math.round(guests)));
}

export type ResolvedLine = {
  /** Chave do cardápio; ausente em itens só de texto. */
  key?: string;
  name: string;
  /** Ausente em itens sob consulta. */
  quantity?: number;
  /** Centavos; null quando o item não tem preço. */
  cost: number | null;
  addon?: string;
};

function resolveItem(item: PackageItem, guests: number, addon?: string): ResolvedLine | null {
  if (!item.key) {
    return item.label ? { name: item.label, cost: null, addon } : null;
  }
  const line = menuLine(item.key);
  if (!line) return null;
  const raw =
    item.fixed ??
    (item.servesPerPiece ? guests / item.servesPerPiece : (item.perGuest ?? 0) * guests);
  const quantity = roundQuantity(item.key, raw);
  return { key: item.key, name: line.name, quantity, cost: lineCost(item.key, quantity), addon };
}

export type ResolvedPackage = {
  lines: ResolvedLine[];
  /** Adicionais sem itens (sob consulta). */
  extras: string[];
  /** Estimativa total em centavos (null com preços ocultos ou sem nenhum preço). */
  total: number | null;
  perGuest: number | null;
  /** false quando algum item escolhido não tem preço e ficou de fora da soma. */
  complete: boolean;
};

export function resolvePackage(pkg: EventPackage, guestsInput: number, addonIds: readonly string[] = []): ResolvedPackage {
  const guests = clampGuests(pkg, guestsInput);
  const lines: ResolvedLine[] = [];
  const extras: string[] = [];

  for (const item of pkg.items) {
    const line = resolveItem(item, guests);
    if (line) lines.push(line);
  }

  let addonCost = 0;
  let complete = true;
  for (const addon of pkg.addons ?? []) {
    if (!addonIds.includes(addon.id)) continue;
    if (!addon.items?.length) {
      extras.push(addon.label);
      complete = false;
      continue;
    }
    for (const item of addon.items) {
      const line = resolveItem(item, guests, addon.label);
      if (!line) continue;
      lines.push(line);
      if (line.cost === null) complete = false;
      else addonCost += line.cost;
    }
  }

  let base = 0;
  if (pkg.pricePerGuest !== undefined) {
    base = pkg.pricePerGuest * guests;
  } else {
    for (const line of lines) {
      if (line.addon) continue;
      if (line.cost === null) complete = false;
      else base += line.cost;
    }
  }

  const total = siteConfig.packages.showPrices && base + addonCost > 0 ? base + addonCost : null;
  return {
    lines,
    extras,
    total,
    perGuest: total === null ? null : roundUpTo(Math.ceil(total / guests), 100),
    complete,
  };
}

/** Valor "a partir de" exibido no card: preço por convidado no número padrão. */
export function packageStartingPrice(pkg: EventPackage): number | null {
  return resolvePackage(pkg, pkg.defaultGuests).perGuest;
}

/* ─── Mensagem de WhatsApp ───────────────────────────────────── */

function lineText(line: ResolvedLine): string {
  return line.quantity ? `${line.name} — ${line.quantity} un.` : `${line.name} (sob consulta)`;
}

/** Linhas da composição prontas para mensagem (usadas também pelo orçamento guiado). */
export function packageLines(resolved: ResolvedPackage): string[] {
  return [
    ...resolved.lines.filter((line) => !line.addon).map(lineText),
    ...resolved.lines.filter((line) => line.addon).map((line) => `${lineText(line)} [adicional]`),
    ...resolved.extras.map((extra) => `${extra} (sob consulta)`),
  ];
}

export function estimateText(resolved: ResolvedPackage): string | null {
  if (resolved.total === null) return null;
  const per = resolved.perGuest !== null ? ` (cerca de ${formatBRL(resolved.perGuest)} por pessoa)` : '';
  const partial = resolved.complete ? '' : ', sem os itens sob consulta';
  return `Estimativa do site: ${formatBRL(resolved.total)}${per}${partial}.`;
}

export function buildPackageMessage(pkg: EventPackage, guests: number, resolved: ResolvedPackage): string {
  const estimate = estimateText(resolved);
  return buildMessage({
    intro: siteConfig.messages.packageIntro,
    sections: [
      { lines: [`Pacote: ${pkg.name}`, `Convidados: ${clampGuests(pkg, guests)}`] },
      { heading: 'Composição sugerida:', lines: packageLines(resolved) },
      estimate ? { text: estimate } : {},
    ],
    closing: siteConfig.messages.packageClosing,
  });
}
