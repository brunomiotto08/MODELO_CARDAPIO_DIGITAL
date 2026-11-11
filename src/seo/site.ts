import { brand } from '../data/brand';

/**
 * Fonte única de verdade do SEO do site (metadados, FAQ e identidade da marca).
 * Este módulo não depende de React nem do navegador: é usado em tempo de execução
 * (useSeo) e no pré-render de build (scripts/prerender.mjs).
 *
 * Domínio canônico: sem "www". O vercel.json redireciona www -> apex (301).
 */
export const SITE_URL = 'https://floralecrim.com.br';
export const SITE_NAME = brand.name;
export const LOCALE = 'pt-BR';
export const DEFAULT_OG_IMAGE = '/og.jpg';
export const DEFAULT_OG_IMAGE_ALT =
  'Flor Alecrim. Salgados diferenciados e mesas de antepastos sob encomenda em Caxias do Sul.';

export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const ROBOTS_NOINDEX = 'noindex, follow';

export const PHONE_DISPLAY = '(54) 99956-3067';
export const PHONE_E164 = `+${brand.whatsapp}`;

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  /** Rótulo usado no BreadcrumbList. */
  name: string;
  indexable: boolean;
};

export const routes: SeoRoute[] = [
  {
    path: '/',
    name: 'Início',
    title: 'Flor Alecrim | Salgados e Mesas para Eventos em Caxias do Sul',
    description:
      'Salgados diferenciados, tortas frias, canapés, terrines e mesas de antepastos sob encomenda em Caxias do Sul e na Serra Gaúcha. Veja o cardápio e encomende.',
    indexable: true,
  },
  {
    path: '/cardapio',
    name: 'Cardápio',
    title: 'Cardápio de Salgados e Encomendas em Caxias do Sul | Flor Alecrim',
    description:
      'Cardápio com valores: tortas frias, prensadinhos, canapés, terrines, mini folhados, brie crocante, mini lanches e tábuas de frios. Encomende em Caxias do Sul, RS.',
    indexable: true,
  },
  {
    path: '/monte-sua-mesa',
    name: 'Monte sua mesa',
    title: 'Monte sua Mesa de Antepastos para Eventos | Flor Alecrim',
    description:
      'Escolha antepastos, salgados e queijos e visualize a mesa do seu evento. Envie a lista pelo WhatsApp e a Flor Alecrim confirma quantidades, valores e data.',
    indexable: true,
  },
];

export const notFoundSeo: SeoRoute = {
  path: '/404',
  name: 'Página não encontrada',
  title: 'Página não encontrada | Flor Alecrim',
  description: 'A página que você procura não existe. Volte ao início ou veja o cardápio da Flor Alecrim.',
  indexable: false,
};

export function routeFor(path: string): SeoRoute | undefined {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return routes.find((route) => route.path === clean);
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path === '/' ? '/' : path}`;
}

export type Faq = { question: string; answer: string };

/**
 * Perguntas e respostas visíveis na home. Cada resposta usa apenas informações
 * já publicadas no site (cardápio, "Para encomendar" e "Como encomendar").
 */
export const faqs: Faq[] = [
  {
    question: 'Onde encomendar salgados e mesas de antepastos em Caxias do Sul?',
    answer:
      'Na Flor Alecrim. Os salgados e antepastos são produzidos sob encomenda em Caxias do Sul, RS, com atendimento em toda a Serra Gaúcha. O pedido é feito pelo WhatsApp (54) 99956-3067, a partir do cardápio ou da página Monte sua mesa.',
  },
  {
    question: 'Quais produtos a Flor Alecrim oferece?',
    answer:
      'Tortas frias (frango e vegetariana), prensadinhos, canapés em oito sabores, terrines, mini folhados, queijo brie crocante com mel e nuts, mini lanches (hambúrguer, hambúrguer vegetariano e hot dog), palito caprese, burrata com tomatinhos confitados e tábuas de frios para 6, 12 ou 20 pessoas. Para eventos, os cardápios são personalizados.',
  },
  {
    question: 'Como consultar o cardápio e os preços?',
    answer:
      'O cardápio com valores está na página Cardápio. Exemplos: canapés a R$ 3,00 a unidade, mini folhados a R$ 3,80 a unidade e torta fria grande (cerca de 12 fatias) a R$ 110,00. Quantidades, valores finais e a data são confirmados no atendimento pelo WhatsApp.',
  },
  {
    question: 'Qual é o pedido mínimo?',
    answer:
      'Depende do item: canapés, 10 unidades por sabor; mini folhados, 20 unidades; mini lanches, 10 unidades; palito caprese, 15 unidades; prensadinhos por unidade, 25 unidades. As tortas frias, terrines, brie, burrata e tábuas são vendidos por peça. Eventos têm mínimo de 15 pessoas.',
  },
  {
    question: 'Como fazer uma encomenda?',
    answer:
      'Escolha entre montar a mesa do evento ou fazer um pedido avulso pelo cardápio, envie a consulta pelo WhatsApp e combine produtos, quantidades, pagamento e data com a equipe.',
  },
  {
    question: 'Qual é a antecedência para encomendar?',
    answer:
      'O prazo mínimo é de 48 horas. A Flor Alecrim não trabalha com pronta entrega, e a data se confirma no atendimento.',
  },
  {
    question: 'Vocês entregam ou tenho que retirar?',
    answer:
      'Há entrega em toda a Serra Gaúcha, incluindo Caxias do Sul, Farroupilha, Bento Gonçalves e Garibaldi, e o valor da entrega acompanha o endereço. Não há loja física: a retirada é no bairro Galópolis, em Caxias do Sul, com horário agendado.',
  },
  {
    question: 'A Flor Alecrim atende eventos?',
    answer:
      'Sim: eventos corporativos, coffee breaks, café da manhã, comemorações, mesas de frutas e mesas de antepastos. O cardápio é personalizado conforme a preferência do cliente e o perfil da comemoração, para no mínimo 15 pessoas. Valores e datas mediante consulta.',
  },
  {
    question: 'Há opções vegetarianas?',
    answer:
      'Sim. O cardápio inclui torta fria vegetariana, prensadinhos vegetarianos, mini hambúrguer vegetariano, canapé caprese, palito caprese e terrine caprese.',
  },
  {
    question: 'Vocês trabalham com doces?',
    answer:
      'Na página Monte sua mesa é possível incluir doces e arranjo floral no pedido; esses itens entram sem valor fechado e são confirmados no atendimento. No cardápio avulso há terrines de sabores doces, como gorgonzola com frutas vermelhas e mix de castanhas com caramelo salgado.',
  },
  {
    question: 'Quais são as formas de pagamento e o horário de atendimento?',
    answer:
      'Pagamento em dinheiro, Pix ou cartão (o cartão é pago por link, à distância). O atendimento pelo WhatsApp é de segunda a sexta, das 8h às 11h30 e das 13h30 às 18h, e aos sábados das 8h às 11h.',
  },
];
