/**
 * Registro único das páginas do site.
 *
 * Header, Footer, rotas do React, SEO, sitemap, robots e llms.txt derivam desta
 * lista. Uma rota com `feature` desligada em site.config.ts não existe: some do
 * menu, vira 404 e não entra no sitemap.
 *
 * Dados puros (sem React): o pré-render importa este arquivo.
 */
import { isEnabled, type FeatureName } from './features';
import { siteConfig } from './site.config';

const name = siteConfig.brand.name;

export type AppRoute = {
  path: string;
  /** Rótulo da página (breadcrumb e menus). */
  name: string;
  feature?: FeatureName;
  nav?: {
    header?: boolean;
    footer?: boolean;
    /** Rótulo no menu, quando diferente de `name`. */
    label?: string;
  };
  title: string;
  description: string;
  indexable: boolean;
};

const allRoutes: AppRoute[] = [
  {
    path: '/',
    name: 'Início',
    nav: { header: true },
    title: `${name} | Salgados e Mesas para Eventos em Caxias do Sul`,
    description:
      'Salgados diferenciados, tortas frias, canapés, terrines e mesas de antepastos sob encomenda em Caxias do Sul e na Serra Gaúcha. Veja o cardápio e encomende.',
    indexable: true,
  },
  {
    path: '/cardapio',
    name: 'Cardápio',
    feature: 'menu',
    nav: { header: true, footer: true },
    title: `Cardápio de Salgados e Encomendas em Caxias do Sul | ${name}`,
    description:
      'Cardápio com valores: tortas frias, prensadinhos, canapés, terrines, mini folhados, brie crocante, mini lanches e tábuas de frios. Encomende em Caxias do Sul, RS.',
    indexable: true,
  },
  {
    path: '/monte-sua-mesa',
    name: 'Monte sua mesa',
    feature: 'table',
    nav: { header: true, footer: true },
    title: `Monte sua Mesa de Antepastos para Eventos | ${name}`,
    description:
      `Escolha antepastos, salgados e queijos e visualize a mesa do seu evento. Envie a lista pelo WhatsApp e a ${name} confirma quantidades, valores e data.`,
    indexable: true,
  },
  {
    path: '/pacotes',
    name: 'Pacotes para eventos',
    feature: 'packages',
    nav: { header: true, footer: true, label: 'Pacotes' },
    title: `Pacotes para Eventos com Preço por Pessoa | ${name}`,
    description:
      'Pacotes prontos de salgados e antepastos para aniversários, corporativos, coffee breaks e casamentos. Informe o número de convidados e veja a estimativa.',
    indexable: true,
  },
  {
    path: '/orcamento',
    name: 'Orçamento de evento',
    feature: 'quoteWizard',
    nav: { footer: true, label: 'Pedir orçamento' },
    title: `Orçamento de Evento Passo a Passo | ${name}`,
    description:
      `Conte o tipo de evento, a data, o número de convidados e o local. A ${name} recebe o briefing completo pelo WhatsApp e envia a proposta.`,
    indexable: true,
  },
  {
    path: '/eventos-realizados',
    name: 'Eventos realizados',
    feature: 'gallery',
    nav: { footer: true },
    title: `Eventos Realizados: Mesas e Coquetéis | ${name}`,
    description:
      `Fotos de mesas de antepastos, coquetéis e eventos montados pela ${name} na Serra Gaúcha. Inspire-se e peça um evento parecido.`,
    indexable: true,
  },
];

/** Rotas habilitadas para este cliente. */
export const routes: AppRoute[] = allRoutes.filter((route) => !route.feature || isEnabled(route.feature));

export function routeEnabled(path: string): boolean {
  const clean = path.split(/[?#]/)[0] || '/';
  return routes.some((route) => route.path === clean);
}

export type NavLink = { label: string; to: string };

/** Link fixo para a seção "Como encomendar" da home. */
const howToOrder: NavLink = { label: 'Como encomendar', to: '/#como-encomendar' };

export const headerLinks: NavLink[] = [
  ...routes
    .filter((route) => route.nav?.header)
    .map((route) => ({ label: route.nav?.label ?? route.name, to: route.path })),
  howToOrder,
];

export const footerLinks: NavLink[] = [
  ...routes
    .filter((route) => route.nav?.footer)
    .map((route) => ({ label: route.nav?.label ?? route.name, to: route.path })),
  howToOrder,
];
