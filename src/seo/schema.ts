import { brand } from '../data/brand';
import { categoryName, products } from '../data/catalog';
import {
  DEFAULT_OG_IMAGE,
  LOCALE,
  PHONE_E164,
  SITE_NAME,
  absoluteUrl,
  faqs,
  routeFor,
} from './site';

type Json = Record<string, unknown>;

const ORG_ID = absoluteUrl('/#organization');
const SITE_ID = absoluteUrl('/#website');
const LOGO_ID = absoluteUrl('/#logo');

const country = { '@type': 'Country', name: 'Brasil' };
const state = {
  '@type': 'AdministrativeArea',
  name: 'Rio Grande do Sul',
  containedInPlace: country,
};

function city(name: string): Json {
  return { '@type': 'City', name, containedInPlace: state };
}

/** "R$ 1.234,50" -> "1234.50" */
export function priceToNumber(price: string): string | null {
  const match = price.match(/R\$\s*([\d.]+,\d{2})/);
  if (!match) return null;
  return match[1].replace(/\./g, '').replace(',', '.');
}

function organization(): Json {
  return {
    '@type': ['FoodEstablishment', 'LocalBusiness'],
    '@id': ORG_ID,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description:
      'Salgados diferenciados, tortas frias, canapés, terrines, tábuas de frios e mesas de antepastos para eventos, feitos sob encomenda em Caxias do Sul, RS, com atendimento na Serra Gaúcha.',
    logo: { '@id': LOGO_ID },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: PHONE_E164,
    // Sem loja física e sem endereço público: apenas cidade, estado e país.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Caxias do Sul',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    areaServed: brand.serviceArea.map(city),
    sameAs: [`https://www.instagram.com/${brand.instagram}/`],
    paymentAccepted: 'Dinheiro, Pix, Cartão (pago por link)',
    currenciesAccepted: 'BRL',
    knowsLanguage: LOCALE,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: PHONE_E164,
      availableLanguage: 'Portuguese',
      areaServed: 'BR',
      url: `https://wa.me/${brand.whatsapp}`,
      hoursAvailable: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '11:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '13:30',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '11:00',
        },
      ],
    },
  };
}

function logo(): Json {
  return {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: absoluteUrl('/images/logos/logo-color.png'),
    contentUrl: absoluteUrl('/images/logos/logo-color.png'),
    caption: SITE_NAME,
  };
}

function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: absoluteUrl('/'),
    name: SITE_NAME,
    inLanguage: LOCALE,
    publisher: { '@id': ORG_ID },
  };
}

function breadcrumb(path: string): Json | null {
  if (path === '/') return null;
  const route = routeFor(path);
  if (!route) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': absoluteUrl(`${path}#breadcrumb`),
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: route.name, item: absoluteUrl(path) },
    ],
  };
}

function productNode(product: (typeof products)[number]): Json {
  const seller = { '@id': ORG_ID };
  const offers: Json[] = [];

  if (product.variants?.length) {
    for (const variant of product.variants) {
      const price = priceToNumber(variant.price);
      if (!price) continue;
      offers.push({
        '@type': 'Offer',
        name: variant.label,
        price,
        priceCurrency: 'BRL',
        seller,
      });
    }
  } else if (product.price) {
    const price = priceToNumber(product.price);
    if (price) offers.push({ '@type': 'Offer', price, priceCurrency: 'BRL', seller });
  }

  const description = [product.description, ...(product.notes ?? [])].filter(Boolean).join(' ');

  return {
    '@type': 'Product',
    '@id': absoluteUrl(`/cardapio#${product.id}`),
    name: product.name,
    category: categoryName(product.category),
    image: absoluteUrl(product.image),
    ...(description ? { description } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {}),
  };
}

function menuItemList(): Json {
  const shown = products.filter((product) => product.availableForDisplay);
  return {
    '@type': 'ItemList',
    '@id': absoluteUrl('/cardapio#itens'),
    name: `Cardápio ${SITE_NAME}`,
    numberOfItems: shown.length,
    itemListElement: shown.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: productNode(product),
    })),
  };
}

function faqPage(): Json {
  return {
    '@type': 'FAQPage',
    '@id': absoluteUrl('/#faq'),
    inLanguage: LOCALE,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function buildJsonLd(path: string): Json {
  const route = routeFor(path);
  const url = absoluteUrl(path);
  const graph: Json[] = [organization(), logo(), website()];

  if (route) {
    const crumbs = breadcrumb(path);
    graph.push({
      '@type': path === '/cardapio' ? ['WebPage', 'CollectionPage'] : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      inLanguage: LOCALE,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': ORG_ID },
      primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(DEFAULT_OG_IMAGE) },
      ...(crumbs ? { breadcrumb: { '@id': crumbs['@id'] } } : {}),
      ...(path === '/' ? { mainEntity: { '@id': absoluteUrl('/#faq') } } : {}),
      ...(path === '/cardapio' ? { mainEntity: { '@id': absoluteUrl('/cardapio#itens') } } : {}),
    });
    if (crumbs) graph.push(crumbs);
    if (path === '/') graph.push(faqPage());
    if (path === '/cardapio') graph.push(menuItemList());
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
