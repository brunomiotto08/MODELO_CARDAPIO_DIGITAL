import { brand } from '../data/brand';
import { categories, eventOffer, products } from '../data/catalog';
import { tableSuggestions } from '../data/table';
import { buildJsonLd } from './schema';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  LOCALE,
  PHONE_DISPLAY,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  faqs,
  notFoundSeo,
  routeFor,
  routes,
  type SeoRoute,
} from './site';


export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoFor(path: string): SeoRoute {
  return path === notFoundSeo.path ? notFoundSeo : (routeFor(path) ?? notFoundSeo);
}

const HERO_PRELOAD = `<link rel="preload" as="image" type="image/webp" href="/images/opt/hero-960.webp" imagesrcset="/images/opt/hero-480.webp 480w, /images/opt/hero-960.webp 960w, /images/opt/hero-1440.webp 1440w, /images/opt/hero-1920.webp 1920w" imagesizes="(max-width: 1023px) 100vw, 56vw" fetchpriority="high" />`;

/** Bloco de <head> específico da rota, entre os marcadores de index.html. */
export function renderHead(path: string): string {
  const route = seoFor(path);
  const url = absoluteUrl(route.path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const robots = route.indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX;
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
  ];
  if (route.indexable) lines.push(`<link rel="canonical" href="${url}" />`);
  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${LOCALE.replace('-', '_')}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />`,
  );
  if (route.indexable) {
    const json = JSON.stringify(buildJsonLd(route.path)).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json" id="jsonld">${json}</script>`);
  }
  if (route.path === '/') lines.push(HERO_PRELOAD);
  return lines.join('\n    ');
}

const li = (html: string) => `<li>${html}</li>`;
const link = (href: string, label: string) => `<a href="${href}">${escapeHtml(label)}</a>`;

function productItems(category: string): string {
  return products
    .filter((product) => product.availableForDisplay && product.category === category)
    .map((product) => {
      const price = product.variants?.length
        ? product.variants.map((variant) => `${variant.label}: ${variant.price}`).join(', ')
        : [product.price, product.unit ? `por ${product.unit}` : ''].filter(Boolean).join(' ');
      const detail = [product.description, ...(product.notes ?? [])].filter(Boolean).join(' ');
      return li(
        `<h3>${escapeHtml(product.name)}</h3><p>${escapeHtml([price, detail].filter(Boolean).join('. '))}</p>`,
      );
    })
    .join('');
}

function menuCategories(): string {
  return categories
    .filter((category) => category.slug !== 'todos')
    .map((category) => {
      const items = productItems(category.slug);
      return items ? `<section><h2>${escapeHtml(category.name)}</h2><ul>${items}</ul></section>` : '';
    })
    .join('');
}

function eventsBlock(headingLevel: 'h2' = 'h2'): string {
  return `<section id="eventos"><${headingLevel}>Encomendas para eventos</${headingLevel}><ul>${eventOffer.types
    .map((type) => li(escapeHtml(type)))
    .join('')}</ul><p>${escapeHtml(eventOffer.note)} ${escapeHtml(eventOffer.minimum)}</p></section>`;
}

function faqBlock(): string {
  return `<section id="perguntas-frequentes"><h2>Perguntas frequentes</h2>${faqs
    .map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`)
    .join('')}</section>`;
}

function bodyFor(path: string): string {
  if (path === '/') {
    return `<h1>Pequenos detalhes. Grandes momentos à mesa.</h1>
<p>A ${SITE_NAME} faz salgados, antepastos e mesas para eventos sob encomenda em Caxias do Sul, RS. Você escolhe os itens, e a gente confirma quantidades e valores pelo WhatsApp.</p>
<p>${link('/monte-sua-mesa', 'Monte sua mesa')} · ${link('/cardapio', 'Cardápio avulso')}</p>
<section><h2>Feitos para compartilhar à mesa.</h2><p>Salgados para o encontro e para a comemoração. Ingredientes de altíssima qualidade, cuidado no preparo, produção artesanal e sob encomenda. Atendemos a ${brand.region}.</p></section>
<section id="cardapio"><h2>Nosso cardápio</h2><p>Mesas de evento, em fotos reais. Os valores ficam no ${link('/cardapio', 'cardápio avulso')}, e a composição fica em ${link('/monte-sua-mesa', 'Monte sua mesa')}.</p><ul>${categories
      .filter((category) => category.slug !== 'todos')
      .map((category) => li(escapeHtml(category.name)))
      .join('')}</ul></section>
${eventsBlock()}
<section id="como-encomendar"><h2>Como encomendar</h2><ol><li>Escolha o caminho: monte a mesa do evento ou faça um pedido avulso.</li><li>Entre em contato pelo WhatsApp ${escapeHtml(PHONE_DISPLAY)}.</li><li>Combine os detalhes: produtos, quantidades, pagamento e data. Prazo mínimo de 48 horas.</li></ol></section>
${faqBlock()}`;
  }

  if (path === '/cardapio') {
    return `<p>${link('/', 'Voltar ao início')}</p>
<h1>Cardápio</h1>
<p>Salgados, tortas frias, canapés, terrines e tábuas de frios sob encomenda em Caxias do Sul. Pedidos avulsos, para retirar e servir em casa. Prefere uma mesa para o evento? ${link('/monte-sua-mesa', 'Monte sua mesa')}.</p>
${menuCategories()}
${eventsBlock()}`;
  }

  if (path === '/monte-sua-mesa') {
    return `<p>${link('/', 'Voltar ao início')}</p>
<h1>Monte sua mesa</h1>
<p>Escolha quantos itens quiser, de todo o cardápio. A mesa é uma prévia: quantidades, valores e a data se confirmam no WhatsApp.</p>
<section><h2>Sugestões prontas</h2><ul>${tableSuggestions
      .map((item) => li(`<strong>${escapeHtml(item.name)}</strong>: ${escapeHtml(item.serves)}`))
      .join('')}</ul></section>
<section><h2>Cardápio</h2><p>Veja os valores no ${link('/cardapio', 'cardápio avulso')}.</p></section>
<section><h2>Também na mesa</h2><p>Doces e arranjo floral saem prontos. Entram no pedido sem valor fechado.</p></section>`;
  }

  return `<h1>Página não encontrada</h1>
<p>O endereço que você abriu não existe. Volte ao ${link('/', 'início')} ou veja o ${link('/cardapio', 'cardápio')}.</p>`;
}

/**
 * Conteúdo textual da rota, escrito dentro de #root no build. O React substitui
 * este HTML na hidratação cliente (createRoot), então não há mudança visual:
 * ele existe para crawlers que não executam JavaScript.
 */
export function renderBody(path: string): string {
  return `<header><nav aria-label="Navegação principal"><a href="/">Início</a> <a href="/cardapio">Cardápio</a> <a href="/monte-sua-mesa">Monte sua mesa</a> <a href="/#como-encomendar">Como encomendar</a></nav></header>
<main>
${bodyFor(path)}
</main>
<footer><p>${SITE_NAME}. ${escapeHtml(brand.city)}. Atendimento na ${brand.region}.</p><p>WhatsApp: <a href="https://wa.me/${brand.whatsapp}">${escapeHtml(PHONE_DISPLAY)}</a> · Instagram: <a href="https://www.instagram.com/${brand.instagram}/">@${brand.instagram}</a></p></footer>`;
}

export function renderSitemap(): string {
  const urls = routes
    .filter((route) => route.indexable)
    .map(
      (route) =>
        `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderRobots(): string {
  return `# ${SITE_NAME}. Todos os rastreadores, incluindo os de busca e de IA com documentação
# oficial (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
# Claude-SearchBot), podem acessar o conteúdo do site. Para barrar um deles,
# acrescente um grupo próprio de User-agent.
User-agent: *
Allow: /
# Arquivos de trabalho e materiais internos, sem uso nas páginas.
Disallow: /insta_extracted/
Disallow: /new_images/
Disallow: /marca/
Disallow: /descriptions/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/** llms.txt é um formato experimental e opcional; não é fator de ranqueamento. */
export function renderLlmsTxt(): string {
  const menu = categories
    .filter((category) => category.slug !== 'todos')
    .map((category) => `- ${category.name}`)
    .join('\n');
  return `# ${SITE_NAME}

> ${SITE_NAME} faz salgados diferenciados, tortas frias, canapés, terrines, tábuas de frios e mesas de antepastos sob encomenda em ${brand.city}, com atendimento na ${brand.region} (${brand.serviceArea.join(', ')}). Pedidos pelo WhatsApp ${PHONE_DISPLAY}, com prazo mínimo de 48 horas. Não há loja física nem pronta entrega.

## Páginas
- [Início](${absoluteUrl('/')}): apresentação, eventos, como encomendar e perguntas frequentes.
- [Cardápio](${absoluteUrl('/cardapio')}): produtos com valores, tamanhos e pedidos mínimos.
- [Monte sua mesa](${absoluteUrl('/monte-sua-mesa')}): visualização da mesa do evento e envio da lista pelo WhatsApp.

## Categorias do cardápio
${menu}

## Informações práticas
- Atendimento no WhatsApp: segunda a sexta, 8h às 11h30 e 13h30 às 18h; sábado, 8h às 11h.
- Entrega na Serra Gaúcha; retirada no bairro Galópolis, em Caxias do Sul, com horário agendado.
- Eventos: mínimo de 15 pessoas, cardápio personalizado.
- Pagamento: dinheiro, Pix ou cartão (por link).
- Instagram: https://www.instagram.com/${brand.instagram}/
`;
}
