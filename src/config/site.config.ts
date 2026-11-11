/**
 * CONFIGURAÇÃO DO CLIENTE — o primeiro arquivo a editar ao clonar o template.
 *
 * Tudo que muda de um estabelecimento para outro (marca, contato, domínio,
 * features ligadas e textos base do WhatsApp) fica aqui. Os dados do cardápio,
 * pacotes, galeria etc. ficam em `src/data/*`. Veja CLONE.md.
 *
 * Este módulo não depende de React nem do navegador: é lido também no
 * pré-render do build (scripts/prerender.mjs).
 */
import type { BrandConfig } from '../types';

/** Features que podem ser ligadas/desligadas por cliente. */
export type FeatureName =
  /** Cardápio avulso (/cardapio) com lista de interesse. */
  | 'menu'
  /** Monte sua mesa (/monte-sua-mesa). */
  | 'table'
  /** Pacotes de eventos prontos (/pacotes). */
  | 'packages'
  /** Orçamento de evento guiado, passo a passo (/orcamento). */
  | 'quoteWizard'
  /** Calculadora de quantidades por nº de convidados. */
  | 'calculator'
  /** Lista e mesa salvas no navegador (não somem ao recarregar). */
  | 'persistence'
  /** Link compartilhável da mesa montada. */
  | 'shareTable'
  /** Galeria de eventos realizados (/eventos-realizados). */
  | 'gallery'
  /** Seção de depoimentos de clientes. */
  | 'testimonials';

const brand: BrandConfig = {
  name: 'Flor Alecrim',

  /** Código do país + DDD + número, só dígitos. Vazio desativa os botões de WhatsApp. */
  whatsapp: '5554999563067',
  phoneDisplay: '(54) 99956-3067',

  instagram: 'floralecrim_',

  city: 'Caxias do Sul, RS',
  region: 'Serra Gaúcha',
  serviceArea: ['Caxias do Sul', 'Farroupilha', 'Bento Gonçalves', 'Garibaldi'],

  hours: {
    weekdays: '8h–11h30 e 13h30–18h',
    saturday: '8h–11h',
    note: 'Horários de atendimento pelo WhatsApp',
  },

  /** Antecedência mínima de encomenda, em horas. Usada no orçamento guiado e nos textos. */
  leadTimeHours: 48,
  /** Mínimo de convidados para eventos (0 = sem mínimo). */
  eventMinimumGuests: 15,
  pickup: 'Retirada no bairro Galópolis, em Caxias do Sul, com horário agendado',
  paymentMethods: ['Dinheiro', 'Pix', 'Cartão (pago por link)'],
};

export const siteConfig = {
  brand,

  site: {
    /** Domínio canônico, sem barra no final e sem "www". */
    url: 'https://floralecrim.com.br',
    /** Prefixo das chaves salvas no navegador. Troque por cliente. */
    storageKey: 'flor-alecrim',
    ogImage: '/og.jpg',
    ogImageAlt:
      'Flor Alecrim. Salgados diferenciados e mesas de antepastos sob encomenda em Caxias do Sul.',
  },

  /** Liga/desliga features. Uma feature desligada some do menu, das rotas, do sitemap e da home. */
  features: {
    menu: true,
    table: true,
    packages: true,
    quoteWizard: true,
    calculator: true,
    persistence: true,
    shareTable: true,
    gallery: true,
    testimonials: true,
  } satisfies Record<FeatureName, boolean>,

  packages: {
    /** false = pacotes aparecem "sob consulta", sem preço nem estimativa. */
    showPrices: true,
    priceDisclaimer: 'Estimativa. Valores, disponibilidade e taxa de entrega são confirmados no atendimento.',
  },

  /** Textos base das mensagens de WhatsApp. */
  messages: {
    orderIntro: `Olá! Conheci a ${brand.name} pelo cardápio digital e gostaria de consultar uma encomenda.`,
    orderClosing: 'Poderiam me informar os valores, as opções disponíveis e as condições para encomendar?',
    generic: `Olá! Conheci a ${brand.name} pelo site e gostaria de saber mais sobre as mesas para eventos e os pedidos avulsos. Podem me ajudar?`,
    tableIntro: `Olá! Quero montar uma mesa com a ${brand.name}.`,
    tableEmpty: `Olá! Quero montar uma mesa com a ${brand.name} para um evento. Podem me orientar sobre as opções, quantidades, valores e a data?`,
    tableClosing: 'Podem me orientar sobre quantidades, valores e a data?',
    eventQuote: `Olá! Gostaria de solicitar um orçamento para um evento com a ${brand.name}.`,
    packageIntro: `Olá! Vi os pacotes de eventos da ${brand.name} e tenho interesse neste:`,
    packageClosing: 'Podem confirmar valores, disponibilidade da data e condições?',
    quoteIntro: `Olá! Gostaria de um orçamento de evento com a ${brand.name}. Seguem os detalhes:`,
    quoteClosing: 'Podem me enviar a proposta com valores e disponibilidade?',
  },
} as const;
